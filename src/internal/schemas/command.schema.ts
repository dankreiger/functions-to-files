import { z } from 'zod';
import { commandNameSchema } from './command-name.schema';

export const commandSchema = z.enum(commandNameSchema.options);
