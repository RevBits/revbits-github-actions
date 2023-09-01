import * as core from '@actions/core';
import * as secretman from '@revbits/pam-secretman-js-plugin';
import { isValidUrl } from './validators';

function trimSlashes(str: string): string {
  return str.replace(/^\/+|\/+$/g, '');
}

function getStr(str: string | undefined): string {
  return (str || '')?.toString();
}

function setSecret(key: string, value: string) {
  core.setSecret(value);
  core.exportVariable(key, value);
  core.setOutput(key, value);
}

async function getSecret(hostname: string, apiKey: string, key: string) {
  core.info(`Getting Secret for ${key} from ${hostname}`);
  const response = await secretman.generateSecret(hostname, key, apiKey).catch((err) => {
    console.error(`Error finding Secret ${key}: ${err.message}`);
    core.setFailed(`Invalid/Expired Secret "${key}"`);
  });

  if (response) {
    core.info(`Setting Secret for ${key}`);
    setSecret(key, response);
  }
}

async function getAndSetSecrets(hostname: string, apiKey: string, secretKeys: string) {
  const p = secretKeys
    ?.split(',')
    .map((key) => key.trim())
    .map(async (key) => getSecret(hostname, apiKey, key));
  await Promise.all(p);
}

export async function run(): Promise<void> {
  try {
    const hostname: string = core.getInput('pam_hostname', { required: true });
    const apiKey: string = core.getInput('api_key', { required: true });
    const secretKeys: string = core.getInput('pam_secret_keys', { required: true });

    core.info('Validating inputs...');
    if (!isValidUrl(hostname)) {
      throw TypeError('input provided for hostname not in expected format');
    }

    await getAndSetSecrets(trimSlashes(hostname), getStr(apiKey), getStr(secretKeys));
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
