import type { contributes } from '../../../package.json.d';

export const createCommandId = <
  const T extends (typeof contributes.commands)[number]['command'],
>(
  cmd: T
) => cmd;
