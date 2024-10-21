import type { MatchersObject, RawMatcherFn } from '@vitest/expect';

function pass(message: string) {
    return {
        pass: true,
        message: () => message,
    } as const;
}

function fail(message: string) {
    return {
        pass: false,
        message: () => message,
    } as const;
}

type ExpectedMessage = string | RegExp;

function formatConsoleCall(args: any[]) {
    return args.map(String).join(' ');
}

// TODO [#869]: Improve lookup logWarning doesn't use console.group anymore.
function consoleDevMatcherFactory(
    methodName: 'error' | 'warn',
    expectInProd: boolean = false
): RawMatcherFn {
    return function (actual: () => void, expectedMessages: ExpectedMessage | ExpectedMessage[]) {
        const { isNot } = this;

        if (isNot) {
            const spy = vi.spyOn(console, methodName);
            try {
                actual();
            } finally {
                spy.mockReset();
            }

            const callsArgs = spy.mock.calls;
            const formattedCalls = callsArgs
                .map(function (arg) {
                    return '"' + formatConsoleCall(arg) + '"';
                })
                .join(', ');

            if (callsArgs.length === 0) {
                return {
                    pass: false,
                    message: function () {
                        return (
                            'Expect console.' + methodName + ' to be called, but was never called.'
                        );
                    },
                };
            }
            return {
                pass: false,
                message: function () {
                    return 'Expect no message but received:\n' + formattedCalls;
                },
            };
        } else {
            function matchMessage(message: string, expectedMessage: ExpectedMessage) {
                if (typeof expectedMessage === 'string') {
                    return message === expectedMessage;
                } else {
                    return expectedMessage.test(message);
                }
            }

            if (!Array.isArray(expectedMessages)) {
                expectedMessages = [expectedMessages];
            }

            if (typeof actual !== 'function') {
                throw new Error('Expected function to throw error.');
            } else if (
                expectedMessages.some(function (message) {
                    return typeof message !== 'string' && !(message instanceof RegExp);
                })
            ) {
                throw new Error(
                    'Expected a string or a RegExp to compare the thrown error against, or an array of such.'
                );
            }

            const spy = vi.spyOn(console, methodName);

            try {
                actual();
            } finally {
                // spy.mockReset();
            }

            const callsArgs = spy.mock.calls;
            const formattedCalls = callsArgs
                .map(function (callArgs) {
                    return '"' + formatConsoleCall(callArgs) + '"';
                })
                .join(', ');

            if (!expectInProd && process.env.NODE_ENV === 'production') {
                if (callsArgs.length !== 0) {
                    return fail(
                        'Expected console.' +
                            methodName +
                            ' to never called in production mode, but it was called ' +
                            callsArgs.length +
                            ' with ' +
                            formattedCalls +
                            '.'
                    );
                } else {
                    return pass(
                        'Expected console.' + methodName + ' to never called in production mode.'
                    );
                }
            } else {
                if (callsArgs.length === 0) {
                    return fail(
                        'Expected console.' +
                            methodName +
                            ' to called with ' +
                            JSON.stringify(expectedMessages) +
                            ', but was never called.'
                    );
                } else {
                    if (callsArgs.length !== expectedMessages.length) {
                        return fail(
                            'Expected console.' +
                                methodName +
                                ' to be called ' +
                                expectedMessages.length +
                                ' time(s), but was called ' +
                                callsArgs.length +
                                ' time(s).'
                        );
                    }
                    for (let i = 0; i < callsArgs.length; i++) {
                        const callsArg = callsArgs[i];
                        const expectedMessage = expectedMessages[i];
                        const actualMessage = formatConsoleCall(callsArg);
                        if (!matchMessage(actualMessage, expectedMessage)) {
                            return fail(
                                'Expected console.' +
                                    methodName +
                                    ' to be called with "' +
                                    expectedMessage +
                                    '", but was called with "' +
                                    actualMessage +
                                    '".'
                            );
                        }
                    }
                    return pass(
                        'Expected console.' +
                            methodName +
                            ' to be called with the expected messages.'
                    );
                }
            }
        }
    };
}

type Callback = () => void;
type ErrorListener = (callback: Callback) => Error | undefined;

function errorMatcherFactory(errorListener: ErrorListener, expectInProd?: boolean): RawMatcherFn {
    return function (actual, expectedErrorCtor, expectedMessage) {
        function matchMessage(message: string) {
            if (typeof expectedMessage === 'undefined') {
                return true;
            } else if (typeof expectedMessage === 'string') {
                return message === expectedMessage;
            } else {
                return expectedMessage.test(message);
            }
        }

        function matchError(error: Error) {
            return error instanceof expectedErrorCtor && matchMessage(error.message);
        }

        function throwDescription(thrown: Error) {
            return thrown.name + ' with message "' + thrown.message + '"';
        }

        if (typeof expectedMessage === 'undefined') {
            if (typeof expectedErrorCtor === 'undefined') {
                // 0 arguments provided
                expectedMessage = undefined;
                expectedErrorCtor = Error;
            } else {
                // 1 argument provided
                expectedMessage = expectedErrorCtor;
                expectedErrorCtor = Error;
            }
        }

        if (typeof actual !== 'function') {
            throw new Error('Expected function to throw error.');
        } else if (expectedErrorCtor !== Error && !(expectedErrorCtor.prototype instanceof Error)) {
            throw new Error('Expected an error constructor.');
        } else if (
            typeof expectedMessage !== 'undefined' &&
            typeof expectedMessage !== 'string' &&
            !(expectedMessage instanceof RegExp)
        ) {
            throw new Error('Expected a string or a RegExp to compare the thrown error against.');
        }

        const thrown = errorListener(actual);

        if (!expectInProd && process.env.NODE_ENV === 'production') {
            if (thrown !== undefined) {
                return fail(
                    'Expected function not to throw an error in production mode, but it threw ' +
                        throwDescription(thrown) +
                        '.'
                );
            } else {
                return pass('Expected function not to throw an error in production mode.');
            }
        } else {
            if (thrown === undefined) {
                return fail(
                    'Expected function to throw an ' +
                        expectedErrorCtor.name +
                        ' error in development mode"' +
                        (expectedMessage ? 'with message ' + expectedMessage : '') +
                        '".'
                );
            } else if (!matchError(thrown)) {
                return fail(
                    'Expected function to throw an ' +
                        expectedErrorCtor.name +
                        ' error in development mode "' +
                        (expectedMessage ? 'with message ' + expectedMessage : '') +
                        '", but it threw ' +
                        throwDescription(thrown) +
                        '.'
                );
            } else {
                return pass('Expected function to throw the expected error.');
            }
        }
    };
}

function directErrorListener(callback: Callback) {
    try {
        callback();
    } catch (error) {
        return error as Error;
    }
}

// Listen for errors using window.addEventListener('error')
function windowErrorListener(callback: Callback) {
    let error;
    function onError(event: ErrorEvent) {
        event.preventDefault(); // don't log the error
        error = event.error;
    }

    window.addEventListener('error', onError);
    try {
        callback();
    } finally {
        window.removeEventListener('error', onError);
    }

    return error;
}

// For errors we expect to be thrown in the connectedCallback() phase
// of a custom element, there are two possibilities:
// 1) We're using non-native lifecycle callbacks, so the error is thrown synchronously
// 2) We're using native lifecycle callbacks, so the error is thrown asynchronously and can
//    only be caught with window.addEventListener('error')
//      - Note native lifecycle callbacks are all thrown asynchronously.
function customElementCallbackReactionErrorListener(callback: Callback) {
    return lwcRuntimeFlags.DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE
        ? directErrorListener(callback)
        : windowErrorListener(callback);
}

const customMatchers = {
    toLogErrorDev: consoleDevMatcherFactory('error'),
    toLogError: consoleDevMatcherFactory('error', true),
    toLogWarningDev: consoleDevMatcherFactory('warn'),
    toThrowErrorDev: errorMatcherFactory(directErrorListener),
    toThrowCallbackReactionErrorDev: errorMatcherFactory(
        customElementCallbackReactionErrorListener
    ),
    toThrowCallbackReactionError: errorMatcherFactory(
        customElementCallbackReactionErrorListener,
        true
    ),
    toThrowCallbackReactionErrorEvenInSyntheticLifecycleMode: errorMatcherFactory(
        windowErrorListener,
        true
    ),
    toBeTrue(received: boolean, message = 'Expected value to be true') {
        return received === true ? pass(message) : fail(message);
    },
    toBeFalse(received: boolean, message = 'Expected value to be false') {
        return received === false ? pass(message) : fail(message);
    },
    toHaveSize(received: { length: number }, size: number) {
        const { isNot } = this;
        const to = isNot ? 'not to' : 'to';
        return {
            pass: received.length === size,
            message: () =>
                `Expected array ${to} have size ${size}, but received ${received.length}`,
        };
    },
} as const satisfies MatchersObject;

expect.extend(customMatchers);

interface CustomMatchers<R = unknown> {
    toLogErrorDev: (expected: ExpectedMessage | ExpectedMessage[]) => R;
    toLogError: (expected: ExpectedMessage | ExpectedMessage[]) => R;
    toLogWarningDev: (expected: ExpectedMessage | ExpectedMessage[]) => R;
    toThrowErrorDev: (
        errorCtor: ErrorConstructor,
        expected: ExpectedMessage | ExpectedMessage[]
    ) => R;

    toThrowCallbackReactionErrorDev: (expected: ExpectedMessage | ExpectedMessage[]) => R;
    toThrowCallbackReactionError: (expected: ExpectedMessage | ExpectedMessage[]) => R;

    toHaveSize: (size: number) => R;

    toEqualWireSettings: (actual: any, expected: any) => R;
}

declare module 'vitest' {
    // TypeScript interfaces get merged; this is a false positive
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Assertion<T = any> extends CustomMatchers<T> {}
    // TypeScript interfaces get merged; this is a false positive
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface AsymmetricMatchersContaining extends CustomMatchers {}
}
