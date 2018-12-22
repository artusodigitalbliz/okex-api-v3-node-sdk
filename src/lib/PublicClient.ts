// tslint:disable:variable-name

import axios, { AxiosInstance } from 'axios';

export function PublicClient(
  apiUri = 'https://www.okex.com',
  axiosConfig = {}
): any {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: apiUri,
    timeout: 3000,
    ...axiosConfig
  });

  async function get(url: string, params?: object): Promise<any> {
    return axiosInstance.get(url, { params }).then(res => res.data);
  }

  return {
    async getSpotInstruments(): Promise<any> {
      return get('/api/spot/v3/instruments');
    },
    async getSpotBook(
      instrument_id: string,
      params?: { readonly size?: string; readonly depth?: string }
    ): Promise<any> {
      return get(`/api/spot/v3/instruments/${instrument_id}/book`, params);
    },
    async getSpotTicker(instrument_id?: string): Promise<any> {
      return instrument_id ? get(`/api/spot/v3/instruments/${instrument_id}/ticker`) : get('/api/spot/v3/instruments/ticker');
    },
    async getSpotTrade(
      instrument_id: string,
      params?: { readonly from?: string, readonly to?: string, readonly limit?: string }
    ): Promise<any> {
      return get(`/api/spot/v3/instruments/${instrument_id}/trades`, params);
    },
    async getSpotCandles(
      instrument_id: string,
      params?: { readonly start?: string, readonly end?: string, readonly granularity?: number }
    ): Promise<any> {
      return get(`/api/spot/v3/instruments/${instrument_id}/candles`, params);
    }
  };
}
