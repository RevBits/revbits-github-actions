import * as core from '@actions/core';
import * as secretman from '@revbits/pam-secretman-js-plugin';

import { run } from '../src/main';
import {
  API_KEY,
  HOSTNAME,
  SECRET_KEY1,
  SECRET_KEY1_VALUE,
  SECRET_KEY2,
  SECRET_KEY2_VALUE,
  SECRET_KEYS,
} from './constants';

jest.mock('@actions/core');
jest.mock('@revbits/pam-secretman-js-plugin');
function designMockServers() {
  // Mock the behavior of core.getInput
  (core.getInput as any).mockImplementation((inputName: string) => {
    if (inputName === 'pam_hostname') return HOSTNAME;
    if (inputName === 'api_key') return API_KEY;
    if (inputName === 'pam_secret_keys') return SECRET_KEYS;

    return undefined;
  });

  (secretman.generateSecret as any).mockImplementation((hostname: string, key: string) => {
    if (key === SECRET_KEY1) return SECRET_KEY1_VALUE;
    if (key === SECRET_KEY2) return SECRET_KEY2_VALUE;

    return undefined;
  });
}

describe('getSecret', () => {
  beforeAll(() => designMockServers());

  it('should call getSecret for each secret key', async () => {
    await run();

    // Verify that getSecret was called twice (once for each secret key)
    expect(secretman.generateSecret).toHaveBeenCalledTimes(2);
  });
});
