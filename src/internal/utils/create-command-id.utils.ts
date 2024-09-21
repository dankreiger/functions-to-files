import { Split } from 'type-fest';
import type { contributes } from '../../../package.json.d';
import { commandNameSchema } from '../schemas';

export const createCommandId = <
  const T extends (typeof contributes.commands)[number]['command']
>(
  cmd: Split<T, '.'>[1]
) => `functions-to-files.${commandNameSchema.Enum[cmd]}` as const;
