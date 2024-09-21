import z from 'zod';

export const commandNameSchema = z.enum(['moveFunctionsToFiles'] as const);
