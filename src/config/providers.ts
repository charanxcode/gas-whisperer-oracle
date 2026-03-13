import { config } from './config';

export interface ProviderEndpoint {
  name: string;
  chainId: number;
  wsUrl: string;
  displayName: string;
  color: string;
}

export const PROVIDER_ENDPOINTS: Record<string, ProviderEndpoint> = {
  ethereum: {
    name: 'ethereum',
    chainId: 1,
    wsUrl: config.rpc.ethereum,
    displayName: 'Ethereum',
    color: '#627EEA', // Ethereum Purple
  },
  polygon: {
    name: 'polygon',
    chainId: 137,
    wsUrl: config.rpc.polygon,
    displayName: 'Polygon',
    color: '#8247E5', // Polygon Purple
  },
  arbitrum: {
    name: 'arbitrum',
    chainId: 42161,
    wsUrl: config.rpc.arbitrum,
    displayName: 'Arbitrum',
    color: '#28A0F0', // Arbitrum Blue
  },
};

export const CHAIN_LIST = Object.values(PROVIDER_ENDPOINTS).map((endpoint) => ({
  key: endpoint.name,
  label: endpoint.displayName,
  chainId: endpoint.chainId,
}));
