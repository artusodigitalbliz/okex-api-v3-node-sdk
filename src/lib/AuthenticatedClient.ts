// tslint:disable:variable-name

import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';
import * as querystring from 'querystring';

export function AuthenticatedClient(
  key: string,
  secret: string,
  passphrase: string,
  apiUri = 'https://www.okex.com',
  axiosConfig = {}
): any {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: apiUri,
    timeout: 3000,
    ...axiosConfig
  });

  const signRequest = (
    method: string,
    path: string,
    options: { readonly qs?: string; readonly body?: object } = {}
  ) => {
    // tslint:disable:no-if-statement
    // tslint:disable:no-let
    // tslint:disable:no-expression-statement
    const timestamp = new Date().toISOString();
    let body = '';
    if (options.body) {
      body = JSON.stringify(options.body);
    } else if (options.qs && Object.keys(options.qs).length !== 0) {
      body = '?' + querystring.stringify(options.qs);
    }
    const what = timestamp + method.toUpperCase() + path + body;
    const hmac = crypto.createHmac('sha256', secret);
    const signature = hmac.update(what).digest('base64');
    return {
      key,
      passphrase,
      signature,
      timestamp
    };
  };
  const getSignature = (
    method: string,
    relativeURI: string,
    opts: { readonly body?: object } = {}
  ) => {
    const sig = signRequest(method, relativeURI, opts);

    return {
      'OK-ACCESS-KEY': sig.key,
      'OK-ACCESS-PASSPHRASE': sig.passphrase,
      'OK-ACCESS-SIGN': sig.signature,
      'OK-ACCESS-TIMESTAMP': sig.timestamp
    };
  };

  async function get(url: string, params?: object): Promise<any> {
    return axiosInstance
      .get(url, { params, headers: { ...getSignature('get', url) } })
      .then(res => res.data);
  }

  return {
    async getSpotAccounts(): Promise<any> {
      return get('/api/spot/v3/accounts');
    }
  };
}
