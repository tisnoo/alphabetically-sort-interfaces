import * as vscode from 'vscode';
import * as ts from 'typescript'; // For TypeScript parsing

export async function sortInterfaceKeys(reverse = false) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return; // Handle no active editor case
  }

  vscode.window.showInformationMessage('Sorting.');

  const document = editor.document;
  if (document.languageId !== 'typescript') {
    vscode.window.showInformationMessage('This command only works in TypeScript files.');
    return;
  }

  const text = document.getText();

  // Use the TypeScript compiler API for reliable parsing
  const sourceFile = ts.createSourceFile(
    "temp.ts", // Temporary filename
    text,
    ts.ScriptTarget.Latest,
    true,
  );

  // Find all interface declarations
  const interfaces: ts.InterfaceDeclaration[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isInterfaceDeclaration(node)) {
      interfaces.push(node);
    }
  });

  for (const interfaceNode of interfaces) {
    const members = [...interfaceNode.members];

    // Sort members based on their names (case-insensitive)
    members.sort((a, b) => {
      const nameA = a?.name?.getText().toLowerCase() || '';
      const nameB = b?.name?.getText().toLowerCase() || '';

      return reverse ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
    });

    const newText = updateInterfaceContent(sourceFile, interfaceNode, members); // Helper function to update interface text
    const range = new vscode.Range(document.positionAt(interfaceNode.getStart()), document.positionAt(interfaceNode.getEnd()));
    
    // Update the document content with sorted members    
    await editor.edit((editBuilder) => editBuilder.replace(range, newText));
  }
}

function updateInterfaceContent(sourceFile: ts.SourceFile, interfaceNode: ts.InterfaceDeclaration, sortedMembers: ts.Node[]): string {
  const printer = ts.createPrinter(); // Use the TypeScript printer

  // Generate the interface declaration with sorted members
  let newInterfaceText = printer.printNode(ts.EmitHint.Unspecified, interfaceNode.name, sourceFile);
  newInterfaceText += " {\n";
  for (const member of sortedMembers) {
    newInterfaceText += `  ${printer.printNode(ts.EmitHint.Unspecified, member, sourceFile)}\n`;
  }
  newInterfaceText += "}";

  return newInterfaceText;
}