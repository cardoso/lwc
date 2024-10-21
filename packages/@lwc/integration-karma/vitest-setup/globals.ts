import { vi } from 'vitest';

type Procedure = (...args: any[]) => any;
type Methods<T> = keyof {
    [K in keyof T as T[K] extends Procedure ? K : never]: T[K];
};

type Classes<T> = {
    [K in keyof T]: T[K] extends new (...args: any[]) => any ? K : never;
}[keyof T] &
    (string | symbol);

export function spyOn<T, M extends Classes<Required<T>> | Methods<Required<T>>>(
    obj: T,
    methodName: M
) {
    const spy = vi.spyOn(obj, methodName);

    Object.defineProperty(spy, 'and', {
        value: {
            returnValue(value: any) {
                return spy.mockReturnValue(value);
            },
            callFake(fn: any) {
                return spy.mockImplementationOnce(fn);
            },
            callThrough() {
                return spy.mockClear();
            },
        },
    });

    Object.defineProperty(spy, 'calls', {
        value: {
            allArgs() {
                return spy.mock.calls;
            },
            mostRecent() {
                return {
                    args: spy.mock.lastCall,
                };
            },
            count() {
                return spy.mock.calls.length;
            },
            argsFor(index: number) {
                return spy.mock.calls[index];
            },
            reset() {
                return spy.mockClear();
            },
        },
    });

    return spy;
}

vi.stubGlobal('spyOn', spyOn);

export function createSpy() {
    const spy = vi.fn();

    Object.defineProperty(spy, 'calls', {
        value: {
            allArgs() {
                return spy.mock.calls;
            },
            count() {
                return spy.mock.calls.length;
            },
            reset() {
                return spy.mockClear();
            },
        },
    });

    return spy;
}

vi.stubGlobal('jasmine', {
    createSpy,
    any: (constructor: unknown) => expect.any(constructor),
    objectContaining: <T = any>(o: T) => expect.objectContaining(o),
    arrayWithExactContents: <T = unknown>(expected: Array<T>) => expect.arrayContaining(expected),
});

vi.stubGlobal('xit', it.skip);
vi.stubGlobal('xdescribe', describe.skip);

declare global {
    var WireService: typeof import('@lwc/wire-service');
    var LWC: typeof import('@lwc/engine-dom');
    var spyOn: typeof vi.spyOn;
    var xit: typeof it.skip;
    var xdescribe: typeof describe.skip;
    var jasmine: {
        createSpy: typeof createSpy;
        any: typeof expect.any;
        objectContaining: typeof expect.objectContaining;
        arrayWithExactContents: typeof expect.arrayContaining;
    };

    interface Window {
        __lwcResetWarnedOnVersionMismatch: () => void;
        __lwcResetGlobalStylesheets: () => void;
        __lwcResetAlreadyLoggedMessages: () => void;
    }
}
