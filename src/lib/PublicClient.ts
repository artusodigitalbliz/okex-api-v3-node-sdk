import axios, { AxiosInstance } from 'axios';

export function PublicClient(
  apiUri = 'https://www.okex.com',
  axiosConfig = {}
): {
  readonly getSpotInstruments: () => Promise<any>;
} {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: apiUri,
    timeout: 3000,
    ...axiosConfig
  });

  async function get(url: string): Promise<any> {
    return axiosInstance.get(url).then(res => res.data);
  }

  return {
    async getSpotInstruments(): Promise<any> {
      return get('/api/spot/v3/instruments');
    }
  };
}
