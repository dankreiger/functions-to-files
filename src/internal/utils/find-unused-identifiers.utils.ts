import ts from 'typescript';

// Helper function to find the used identifiers within a node
export function findUsedIdentifiers(node: ts.Node, identifiers: Set<string>) {
  if (ts.isIdentifier(node)) {
    identifiers.add(node.text);
  }

  node.forEachChild((childNode) => {
    findUsedIdentifiers(childNode, identifiers);
  });
}
