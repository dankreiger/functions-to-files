import * as fs from 'fs';
import * as path from 'path';

import * as ts from 'typescript';
import * as vscode from 'vscode';
import { createCommandId } from './internal';

export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    createCommandId('moveFunctionsToFiles'),
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return vscode.window.showErrorMessage('No active editor found.');
      }

      const { fileName, getText } = editor.document;

      const sourceFile = ts.createSourceFile(
        path.basename(fileName),
        getText(),
        ts.ScriptTarget.Latest,
        true
      );

      // Directory to store the split files
      const directoryPath = path.join(path.dirname(fileName), 'split-utils');
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
      }

      sourceFile.forEachChild((node) => {
        // Check for VariableStatement (e.g. const or let declarations)
        if (ts.isVariableStatement(node)) {
          node.declarationList.declarations.forEach((declaration) => {
            // Check if the initializer is an ArrowFunction
            if (
              declaration.initializer &&
              ts.isArrowFunction(declaration.initializer)
            ) {
              const functionName = (
                declaration.name as ts.Identifier
              ).getText();
              const newFileName = path.join(
                directoryPath,
                `${functionName}.ts`
              );

              // Use Printer to print the entire declaration (including 'const' or 'let')
              const printer = ts.createPrinter();
              const newFileContent = printer.printNode(
                ts.EmitHint.Unspecified,
                node, // Pass the entire VariableStatement node
                sourceFile
              );

              fs.writeFileSync(newFileName, newFileContent);
              vscode.window.showInformationMessage(`Created: ${newFileName}`);
            }
          });
        }

        // Existing code for handling function declarations
        if (ts.isFunctionDeclaration(node) && node.name) {
          const functionName = node.name.getText();
          const newFileName = path.join(directoryPath, `${functionName}.ts`);

          const printer = ts.createPrinter();
          const newFileContent = printer.printNode(
            ts.EmitHint.Unspecified,
            node,
            sourceFile
          );

          fs.writeFileSync(newFileName, newFileContent);
          vscode.window.showInformationMessage(`Created: ${newFileName}`);
        }
      });

      vscode.window.showInformationMessage(
        'Functions split into separate files.'
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
