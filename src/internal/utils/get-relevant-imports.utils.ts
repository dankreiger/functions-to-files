import ts from 'typescript';

export function getRelevantImports(
  sourceFile: ts.SourceFile,
  usedIdentifiers: Set<string>
): string[] {
  const relevantImports: string[] = [];

  sourceFile.forEachChild((node) => {
    if (ts.isImportDeclaration(node)) {
      const importClause = node.importClause;
      const namedBindings = importClause?.namedBindings;
      let importPath = (node.moduleSpecifier as ts.StringLiteral).text;

      // Check for named imports like `import { A, B } from 'module'`
      if (namedBindings && ts.isNamedImports(namedBindings)) {
        const importedElements = namedBindings.elements
          .filter((element) => usedIdentifiers.has(element.name.text))
          .map((element) => element.getText());

        if (importedElements.length > 0) {
          relevantImports.push(
            `import { ${importedElements.join(', ')} } from '${importPath}';`
          );
        }
      }

      // Check for default imports like `import A from 'module'`
      if (importClause?.name && usedIdentifiers.has(importClause.name.text)) {
        relevantImports.push(
          `import ${importClause.name.getText()} from '${importPath}';`
        );
      }

      // Handle type imports separately (import { type A } from ...)
      if (namedBindings && ts.isNamedImports(namedBindings)) {
        const typeImports = namedBindings.elements
          .filter(
            (element) =>
              element.name.getText().startsWith('type') &&
              usedIdentifiers.has(element.name.getText().replace('type ', ''))
          )
          .map((element) => element.getText());

        if (typeImports.length > 0) {
          relevantImports.push(
            `import { ${typeImports.join(', ')} } from '${importPath}';`
          );
        }
      }
    }
  });

  return relevantImports;
}
