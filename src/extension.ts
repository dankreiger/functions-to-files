import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import * as vscode from 'vscode';
import {
  createCommandId,
  processFunction,
  processInterface,
  processType,
} from './internal';

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
