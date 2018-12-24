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
    options: { readonly qs?: string; readonly body?: string } = {}
  ) => {
    // tslint:disable:no-if-statement
    // tslint:disable:no-let
    // tslint:disable:no-expression-statement
    const timestamp = Date.now() / 1000;
    const what = timestamp + method.toUpperCase() + path + (options.body || '');
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
    opts: { readonly body?: string } = {}
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

  async function post(
    url: string,
    body?: object,
    params?: object
  ): Promise<any> {
    const bodyJson = JSON.stringify(body);
    return axiosInstance
      .post(url, body, {
        headers: { ...getSignature('post', url, { body: bodyJson }) },
        params
      })
      .then(res => res.data);
  }

  return {
    async getSpotAccounts(currency?: string): Promise<any> {
      return currency ? get(`/api/spot/v3/accounts/${currency}`) : get('/api/spot/v3/accounts');
    },
    async getSpotLedger(currency: string): Promise<any> {
      return get(`/api/spot/v3/accounts/${currency}/ledger`);
    },
    async postSpotOrder(params: {
      readonly instrument_id: string;
      readonly client_oid?: string;
      readonly type: string;
      readonly side: string;
      readonly margin_trading?: number;
    }): Promise<any> {
      return post('/api/spot/v3/orders', params);
    },
    async postSpotBatchOrders(params: [{
      readonly instrument_id: string;
      readonly client_oid?: string;
      readonly type: string;
      readonly side: string;
      readonly margin_trading?: number;
    }]): Promise<any> {
      return post('/api/spot/v3/batch_orders', params);
    },
    async postSpotCancelOrder(order_id: string, params: {
      readonly instrument_d: string,
      readonly client_oid?: string
    }): Promise<any> {
      return post(`/api/spot/v3/cancel_orders/${order_id}`, params);
    },
    async postSpotCancelBatchOrders(params: [{ readonly instument_id: string, readonly order_ids: [string] }]): Promise<any> {
      return post(`/api/spot/v3/cancel_batch_orders`, params);
    },
    async getSpotOrders(params: {
      readonly status: string,
      readonly instument_id: string,
      readonly from?: string,
      readonly to?: string,
      readonly limit?: string
    }): Promise<any> {
      return get(`/api/spot/v3/orders?` + querystring.stringify(params));
    },
    async getSpotOrdersPending(params?: {
      readonly from?: string,
      readonly to?: string,
      readonly limit?: string,
      readonly instrument_id?: string,
    }): Promise<any> {
      return get(`/api/spot/v3/orders_pending` + params ? `?${querystring.stringify(params)}` : '');
    },
    async getSpotOrder(order_id: string, params: { readonly instrument_id: string }): Promise<any> {
      return get(`/api/spot/v3/orders/${order_id}?` + querystring.stringify(params));
    },
    async getSpotFills(params: {
      readonly order_id: string,
      readonly instument_id: string,
      readonly from?: string,
      readonly to?: string,
      readonly limit?: string,
    }): Promise<any> {
      return get(`/api/spot/v3/fills?${querystring.stringify(params)}`);
    },

  };
}
