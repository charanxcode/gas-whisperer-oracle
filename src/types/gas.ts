export interface ChainData {
  baseFee: number;
  priorityFee: number;
  history: GasDataPoint[];
  candlestickData: CandlestickData[];
  lastUpdate: number;
  isConnected: boolean;
  blockNumber: number;
}

export interface GasDataPoint {
  timestamp: number;
  baseFee: number;
  priorityFee: number;
  totalFee: number;
  blockNumber: number;
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceData {
  timestamp: number;
  price: number;
}

export interface BlockData {
  blockNumber: number;
  baseFee: number;
  priorityFee: number;
  timestamp: number;
  chain: string;
}

export interface SimulationCost {
  chain: string;
  chainKey: string;
  baseFee: string;
  priorityFee: string;
  totalFee: string;
  costUSD: string;
  costETH: string;
  blockNumber: number;
  isConnected: boolean;
}

export interface GasCost {
  totalFeeGwei: number;
  totalFeeEth: number;
  totalCostUSD: number;
}

export interface ErrorNotification {
  id: number;
  message: string;
  type: 'error' | 'warning' | 'info';
  chain?: string;
}

export interface ChartDataPoint {
  time: string;
  ethereum: number;
  polygon: number;
  arbitrum: number;
}

export type ChainName = 'ethereum' | 'polygon' | 'arbitrum';

export interface GasStoreState {
  mode: 'live' | 'simulation';
  chains: Record<ChainName, ChainData>;
  usdPrice: number;
  priceHistory: PriceData[];
  simulationAmount: number;
  simulationGasLimit: number;
  isConnected: boolean;
  errors: ErrorNotification[];
  lastPriceUpdate: number;
}

export interface WebSocketProviderOptions {
  url: string;
  chainName: string;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}