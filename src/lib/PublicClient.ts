import axios, { AxiosInstance } from 'axios';

export function PublicClient(apiUri = 'https://www.okex.com/', axiosConfig = {}) {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: apiUri,
    ...axiosConfig
  });

  async function get(url: string): Promise<any> {
    return axiosInstance.get(url)
      .then(res => res.data);
  }

  return {
    async getSpotInstruments(): Promise<any> {
      return get('/api/spot/v3/instruments');
    },
    async getSwapInstruments(): Promise<any> {
      return axios.get('/api/swap/v3/instruments');
    }
  };


}
