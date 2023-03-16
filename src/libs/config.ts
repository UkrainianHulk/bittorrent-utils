import { resolve } from 'node:path';
import { env, cwd } from 'node:process';
import merge from 'deepmerge';
import defaultConfig from '../../config/default.js';

const { NODE_ENV } = env

async function importConfig(name: string): Promise<Partial<typeof defaultConfig>> {
  try { 
    const configPath = resolve(cwd(), 'config', name);
    const imported = await import(`file://${configPath}.ts`);
    return imported.default;
  } catch (error) {
    throw new Error (`Failed to import config "${name}"`)
  }
}

const config = (NODE_ENV != null)
  ? merge(defaultConfig, await importConfig(NODE_ENV))
  : defaultConfig;

export default config;
