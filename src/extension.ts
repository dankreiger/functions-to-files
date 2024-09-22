import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import * as vscode from 'vscode';
import { createCommandId, getRelevantImports } from './internal';

// Helper function to find the used identifiers within a node
function findUsedIdentifiers(node: ts.Node, identifiers: Set<string>) {
  if (ts.isIdentifier(node)) {
    identifiers.add(node.text);
  }

  node.forEachChild((childNode) => {
    findUsedIdentifiers(childNode, identifiers);
  });
}

// Function to write function content and include necessary imports
function writeFunctionToFile(
  newFileName: string,
  newFileContent: string,
  relevantImports: string[]
) {
  const fullContent = `${relevantImports.join('\n')}\n\n${newFileContent}`;
  fs.writeFileSync(newFileName, fullContent);
  vscode.window.showInformationMessage(`Created: ${newFileName}`);
}

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

      const directoryPath = path.join(path.dirname(fileName), 'split-utils');
      try {
        if (!fs.existsSync(directoryPath)) {
          fs.mkdirSync(directoryPath, { recursive: true });
        }
      } catch (err) {
        return vscode.window.showErrorMessage(
          `Failed to create directory: ${err.message}`
        );
      }

      // Iterate through each node and process function declarations
      sourceFile.forEachChild((node) => {
        if (ts.isVariableStatement(node)) {
          node.declarationList.declarations.forEach((declaration) => {
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

              // Collect the used identifiers for the current function
              const usedIdentifiers = new Set<string>();
              findUsedIdentifiers(declaration.initializer, usedIdentifiers);

              // Get the relevant imports for this function
              const relevantImports = getRelevantImports(
                sourceFile,
                usedIdentifiers
              );

              const printer = ts.createPrinter();
              const newFileContent = printer.printNode(
                ts.EmitHint.Unspecified,
                node,
                sourceFile
              );

              writeFunctionToFile(newFileName, newFileContent, relevantImports);
            }
          });
        }

        if (ts.isFunctionDeclaration(node) && node.name) {
          const functionName = node.name.getText();
          const newFileName = path.join(directoryPath, `${functionName}.ts`);

          // Collect the used identifiers for the current function
          const usedIdentifiers = new Set<string>();
          findUsedIdentifiers(node, usedIdentifiers);

          // Get the relevant imports for this function
          const relevantImports = getRelevantImports(
            sourceFile,
            usedIdentifiers
          );

          const printer = ts.createPrinter();
          const newFileContent = printer.printNode(
            ts.EmitHint.Unspecified,
            node,
            sourceFile
          );

          writeFunctionToFile(newFileName, newFileContent, relevantImports);
        }
      });

      vscode.window.showInformationMessage(
        'Functions split into separate files with relevant imports.'
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
