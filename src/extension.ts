import * as vscode from 'vscode';
import * as ts from 'typescript';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('alphabetically-sort-interfaces.sortFile', () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        const document = editor.document;
        const text = document.getText();

        const sourceFile = ts.createSourceFile('tempFile.ts', text, ts.ScriptTarget.Latest, true);

        const sortedText = sortInterfacesAndTypes(sourceFile);

        editor.edit(editBuilder => {
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            editBuilder.replace(fullRange, sortedText);
        });
    });

    context.subscriptions.push(disposable);
}

function sortInterfacesAndTypes(sourceFile: ts.SourceFile): string {
    const printer = ts.createPrinter();
    const sortedNodes: ts.Node[] = [];

    ts.forEachChild(sourceFile, node => {
        if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
            sortedNodes.push(sortKeys(node));
        } else {
            sortedNodes.push(node);
        }
    });

    return sortedNodes.map(node => printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)).join('\n');
}

function sortKeys(node: ts.Node): ts.Node {
    if (ts.isInterfaceDeclaration(node)) {
        return ts.factory.updateInterfaceDeclaration(
            node,
            node.modifiers,
            node.name,
            node.typeParameters,
            node.heritageClauses,
            sortMembers(node.members)
        );
    } else if (ts.isTypeAliasDeclaration(node)) {
        if (ts.isTypeLiteralNode(node.type)) {
            return ts.factory.updateTypeAliasDeclaration(
                node,
                node.modifiers,
                node.name,
                node.typeParameters,
                sortTypeLiteral(node.type)
            );
        }
    }
    return node;
}

function sortMembers(members: ts.NodeArray<ts.TypeElement>): ts.NodeArray<ts.TypeElement> {
    return ts.factory.createNodeArray([...members].map(member => {
        if (ts.isPropertySignature(member) && member.type && ts.isTypeLiteralNode(member.type)) {
            const sortedTypeLiteral = sortTypeLiteral(member.type);
            return ts.factory.updatePropertySignature(
                member,
                member.modifiers,
                member.name,
                member.questionToken,
                sortedTypeLiteral
            );
        }
        return member;
    }).sort((a, b) => {
        const aName = (a.name as ts.Identifier).text;
        const bName = (b.name as ts.Identifier).text;
        return aName.localeCompare(bName);
    }));
}

function sortTypeLiteral(typeLiteral: ts.TypeLiteralNode): ts.TypeLiteralNode {
    return ts.factory.updateTypeLiteralNode(
        typeLiteral,
        sortMembers(typeLiteral.members)
    );
}

export function deactivate() {}