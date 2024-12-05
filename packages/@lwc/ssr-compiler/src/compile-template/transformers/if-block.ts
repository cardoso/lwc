/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { builders as b } from 'estree-toolkit';
import { expressionIrToEs } from '../expression';
import { irChildrenToEs } from '../ir-to-es';
import { isElseBlock, optimizeAdjacentYieldStmts } from '../shared';
import type {
    ChildNode as IrChildNode,
    ElseifBlock as IrElseifBlock,
    IfBlock as IrIfBlock,
} from '@lwc/template-compiler';
import type { Transformer, TransformerContext } from '../types';
import type { BlockStatement as EsBlockStatement, IfStatement as EsIfStatement } from 'estree';

export const IfBlock: Transformer<IrIfBlock | IrElseifBlock> = function IfBlock(node, cxt) {
    return [bIfStatement(node, cxt)];
};

function bIfStatement(
    ifElseIfNode: IrIfBlock | IrElseifBlock,
    cxt: TransformerContext
): EsIfStatement {
    const { children, condition, else: elseNode } = ifElseIfNode;

    let elseBlock = null;
    if (elseNode) {
        if (isElseBlock(elseNode)) {
            elseBlock = bBlockStatement(elseNode.children, cxt);
        } else {
            elseBlock = bIfStatement(elseNode, cxt);
        }
    }

    return b.ifStatement(
        expressionIrToEs(condition, cxt),
        bBlockStatement(children, cxt),
        elseBlock
    );
}

function bBlockStatement(childNodes: IrChildNode[], cxt: TransformerContext): EsBlockStatement {
    const statements = irChildrenToEs(childNodes, cxt);

    if (!cxt.isSlotted) {
        statements.unshift(bYieldComment());
        statements.push(bYieldComment());
    }

    return b.blockStatement(optimizeAdjacentYieldStmts(statements));
}

function bYieldComment() {
    return b.expressionStatement(b.yieldExpression(b.literal('<!---->')));
}
