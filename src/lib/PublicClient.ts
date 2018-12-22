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
      params: { readonly size: string; readonly depth: string }
    ): Promise<any> {
      return get(`/api/spot/v3/instruments/${instrument_id}/book`, params);
    }
  };
}
