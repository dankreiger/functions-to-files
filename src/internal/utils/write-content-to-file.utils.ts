import * as fs from 'node:fs';
import * as vscode from 'vscode';

// Function to write content and include necessary imports
export function writeContentToFile(
  newFileName: string,
  newFileContent: string,
  relevantImports: string[]
) {
  const fullContent = `${relevantImports.join('\n')}\n\n${newFileContent}`;
  fs.writeFileSync(newFileName, fullContent);
  vscode.window.showInformationMessage(`Created: ${newFileName}`);
}
