import path from 'path';
import ts from 'typescript';
import { findUsedIdentifiers } from './find-unused-identifiers.utils';
import { getRelevantImports } from './get-relevant-imports.utils';
import { writeContentToFile } from './write-content-to-file.utils';

// Function to process interfaces
export function processInterface(
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
