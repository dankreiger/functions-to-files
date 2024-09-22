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

// Function to write content and include necessary imports
function writeContentToFile(
  newFileName: string,
  newFileContent: string,
  relevantImports: string[]
) {
  const fullContent = `${relevantImports.join('\n')}\n\n${newFileContent}`;
  fs.writeFileSync(newFileName, fullContent);
  vscode.window.showInformationMessage(`Created: ${newFileName}`);
}

// Function to process function declarations
function processFunction(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  directoryPath: string
) {
  if (ts.isVariableStatement(node)) {
    node.declarationList.declarations.forEach((declaration) => {
      if (
        declaration.initializer &&
        ts.isArrowFunction(declaration.initializer)
      ) {
        const functionName = (declaration.name as ts.Identifier).getText();
        const newFileName = path.join(directoryPath, `${functionName}.ts`);

        const usedIdentifiers = new Set<string>();
        findUsedIdentifiers(declaration.initializer, usedIdentifiers);
        const relevantImports = getRelevantImports(sourceFile, usedIdentifiers);

        const printer = ts.createPrinter();
        const newFileContent = printer.printNode(
          ts.EmitHint.Unspecified,
          node,
          sourceFile
        );

        writeContentToFile(newFileName, newFileContent, relevantImports);
      }
    });
  }

  if (ts.isFunctionDeclaration(node) && node.name) {
    const functionName = node.name.getText();
    const newFileName = path.join(directoryPath, `${functionName}.ts`);

    const usedIdentifiers = new Set<string>();
    findUsedIdentifiers(node, usedIdentifiers);
    const relevantImports = getRelevantImports(sourceFile, usedIdentifiers);

    const printer = ts.createPrinter();
    const newFileContent = printer.printNode(
      ts.EmitHint.Unspecified,
      node,
      sourceFile
    );

    writeContentToFile(newFileName, newFileContent, relevantImports);
  }
}

// Function to process type aliases
function processType(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  directoryPath: string
) {
  if (ts.isTypeAliasDeclaration(node) && node.name) {
    const typeName = node.name.getText();
    const newFileName = path.join(directoryPath, `${typeName}.ts`);

    const usedIdentifiers = new Set<string>();
    findUsedIdentifiers(node, usedIdentifiers);
    const relevantImports = getRelevantImports(sourceFile, usedIdentifiers);

    const printer = ts.createPrinter();
    const newFileContent = printer.printNode(
      ts.EmitHint.Unspecified,
      node,
      sourceFile
    );

    writeContentToFile(newFileName, newFileContent, relevantImports);
  }
}

// Function to process interfaces
function processInterface(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  directoryPath: string
) {
  if (ts.isInterfaceDeclaration(node) && node.name) {
    const interfaceName = node.name.getText();
    const newFileName = path.join(directoryPath, `${interfaceName}.ts`);

    const usedIdentifiers = new Set<string>();
    findUsedIdentifiers(node, usedIdentifiers);
    const relevantImports = getRelevantImports(sourceFile, usedIdentifiers);

    const printer = ts.createPrinter();
    const newFileContent = printer.printNode(
      ts.EmitHint.Unspecified,
      node,
      sourceFile
    );

    writeContentToFile(newFileName, newFileContent, relevantImports);
  }
}

export async function activate(context: vscode.ExtensionContext) {
  // Command to move functions to separate files
  let moveFunctionsCommand = vscode.commands.registerCommand(
    createCommandId('functions-to-files.moveFunctionsToFiles'),
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

      // Process all nodes for functions
      sourceFile.forEachChild((node) => {
        processFunction(node, sourceFile, directoryPath);
      });

      vscode.window.showInformationMessage(
        'Functions split into separate files with relevant imports.'
      );
    }
  );

  // Command to move types and interfaces to separate files
  let moveTypesAndInterfacesCommand = vscode.commands.registerCommand(
    createCommandId('functions-to-files.moveTypesToFiles'),
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

      // Process all nodes for types and interfaces
      sourceFile.forEachChild((node) => {
        processType(node, sourceFile, directoryPath);
        processInterface(node, sourceFile, directoryPath);
      });

      vscode.window.showInformationMessage(
        'Types and interfaces split into separate files with relevant imports.'
      );
    }
  );

  context.subscriptions.push(
    moveFunctionsCommand,
    moveTypesAndInterfacesCommand
  );
}

export function deactivate() {}
