/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { builders as b } from 'estree-toolkit';
import { irChildrenToEs } from '../ir-to-es';
import { expressionIrToEs } from '../expression';
import { optimizeAdjacentYieldStmts } from '../shared';
import type { ChildNode as IrChildNode, If as IrIf } from '@lwc/template-compiler';
import type { BlockStatement as EsBlockStatement } from 'estree';
import type { Transformer, TransformerContext } from '../types';

function bBlockStatement(childNodes: IrChildNode[], cxt: TransformerContext): EsBlockStatement {
    const statements = irChildrenToEs(childNodes, cxt);
    return b.blockStatement(optimizeAdjacentYieldStmts(statements));
}

export const If: Transformer<IrIf> = function If(node, cxt) {
    const { modifier: trueOrFalseAsStr, condition, children } = node;

    const trueOrFalse = trueOrFalseAsStr === 'true';
    const comparison = b.binaryExpression(
        '===',
        b.literal(trueOrFalse),
        expressionIrToEs(condition, cxt)
    );

    return [b.ifStatement(comparison, bBlockStatement(children, cxt))];
};
