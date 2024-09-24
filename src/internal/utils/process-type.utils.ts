import path from 'path';
import ts from 'typescript';
import { findUsedIdentifiers } from './find-unused-identifiers.utils';
import { getRelevantImports } from './get-relevant-imports.utils';
import { writeContentToFile } from './write-content-to-file.utils';

// Function to process type aliases
export function processType(
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
