import path from 'path';
import ts from 'typescript';
import { findUsedIdentifiers } from './find-unused-identifiers.utils';
import { getRelevantImports } from './get-relevant-imports.utils';
import { writeContentToFile } from './write-content-to-file.utils';

// Function to process function declarations
export function processFunction(
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
