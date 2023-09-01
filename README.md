# RevBits - GitHub Actions

The RevBits GitHub Action repository hosts the source code for the `revbits-github-actions` action, designed to seamlessly fetch secrets from the RevBits PAM Secrets Manager for utilization within your GitHub Actions workflows. 

This action empowers you to securely integrate sensitive information into your automated processes.

The `revbits-github-actions` automates the process of retrieving secrets from the RevBits PAM Secrets Manager and injects them as masked [environment variables](https://docs.github.com/en/actions/learn-github-actions/environment-variables) within your chosen GitHub action.

Review GitHub's recommendations for [security hardening GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions) when using sensitive secrets.

## Usage

To incorporate this action into your GitHub workflow, follow these steps and employ the provided syntax:

```
- name: Step name
  uses: revbits-github-actions
  with:
    pam_hostname: ${{ secrets.PAM_HOSTNAME }}
    api_key: ${{ secrets.API_KEY }}
    pam_secret_keys: ${{ secrets.SECRET_KEYS }}
```

## Parameters

- `pam_hostname`

  If you are using a self-hosted instance of `RevBits PAM`, please provide the URL in the following format: https://your.domain.com

- `api_key`

  This API key is essential for interacting with the `RevBits PAM` to retrieve secrets.

- `pam_secret_keys`

  Specify one or more secret keys (separated by commas) that you wish to fetch or obtain.

  GitHub's environment variables adhere to more stringent naming criteria compared to those of `RevBits PAM` secrets.

  Example:
  > NOTE: Here YOUTUBE & NPM are sample keys saved on PAM Secret Manager

  ```
    secrets: YOUTUBE,NPM
  ```

## Examples

```
- name: Get Secrets
  id: get-secrets
  uses: RevBits/revbits-github-actions@v1
  with:
    pam_hostname: ${{ secrets.PAM_HOSTNAME }}
    api_key: ${{ secrets.API_KEY }}
    pam_secret_keys: YOUTUBE,NPM

- name: Display Secrets
  run: |
    echo "YOUTUBE: ${{ steps.get-secrets.outputs.YOUTUBE }}"
    echo "NPM: ${{ steps.get-secrets.outputs.NPM }}"
```

## Run Locally

Install npm dependencies

```bash
$ npm install
```

Compile the TypeScript code and create a distribution package.

```bash
$ npm run make:lib
```

Run the tests :heavy_check_mark:

```bash
$ npm test
```

## Prepare Source for Distribution

GitHub recommends utilizing a tool known as [@vercel/ncc](https://github.com/vercel/ncc) for the purpose of compiling code and modules into a single file, which is employed for distribution purposes.
