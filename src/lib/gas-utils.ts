import { GasCost, CandlestickData, GasDataPoint } from '@/types/gas';

/**
 * Calculate gas cost in various denominations
 */
export const calculateGasCost = (
  baseFee: number,
  priorityFee: number,
  gasLimit: number,
  ethPrice: number
): GasCost => {
  const totalFeeGwei = baseFee + priorityFee;
  const totalFeeEth = (totalFeeGwei * gasLimit) / 1e9;
  const totalCostUSD = totalFeeEth * ethPrice;
  
  return {
    totalFeeGwei,
    totalFeeEth,
    totalCostUSD
  };
};

/**
 * Generate candlestick data for 15-minute intervals
 */
export const generateCandlestickData = (history: GasDataPoint[]): CandlestickData[] => {
  if (history.length < 2) return [];

  const intervals: Record<number, CandlestickData> = {};
  const intervalSize = 15 * 60 * 1000; // 15 minutes in milliseconds

  history.forEach(point => {
    const intervalKey = Math.floor(point.timestamp / intervalSize) * intervalSize;
    
    if (!intervals[intervalKey]) {
      intervals[intervalKey] = {
        timestamp: intervalKey,
        open: point.totalFee,
        high: point.totalFee,
        low: point.totalFee,
        close: point.totalFee,
        volume: 1
      };
    } else {
      intervals[intervalKey].high = Math.max(intervals[intervalKey].high, point.totalFee);
      intervals[intervalKey].low = Math.min(intervals[intervalKey].low, point.totalFee);
      intervals[intervalKey].close = point.totalFee;
      intervals[intervalKey].volume += 1;
    }
  });

  return Object.values(intervals).sort((a, b) => a.timestamp - b.timestamp);
};

/**
 * Format gas price with appropriate precision
 */
export const formatGasPrice = (gasPrice: number, decimals: number = 2): string => {
  if (gasPrice < 0.01) {
    return gasPrice.toFixed(4);
  }
  if (gasPrice < 1) {
    return gasPrice.toFixed(3);
  }
  return gasPrice.toFixed(decimals);
};

/**
 * Format currency values
 */
export const formatCurrency = (value: number, currency: 'USD' | 'ETH' = 'USD'): string => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(value);
  }
  
  return `${value.toFixed(8)} ETH`;
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Get gas price trend indicator
 */
export const getGasTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
  const change = calculatePercentageChange(current, previous);
  if (Math.abs(change) < 1) return 'stable';
  return change > 0 ? 'up' : 'down';
};

/**
 * Generate mock gas price with realistic volatility
 */
export const generateMockGasPrice = (basePrice: number, volatility: number = 0.1): number => {
  const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
  const change = basePrice * volatility * randomFactor;
  return Math.max(basePrice + change, 0.1); // Minimum gas price
};

/**
 * Time formatting utilities
 */
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Chain-specific utilities
 */
export const getChainColor = (chain: string): string => {
  const colors = {
    ethereum: '#3B82F6',
    polygon: '#8B5CF6',
    arbitrum: '#10B981'
  };
  return colors[chain as keyof typeof colors] || '#6B7280';
};

export const getChainIcon = (chain: string): string => {
  const icons = {
    ethereum: '⟠',
    polygon: '⬡',
    arbitrum: '◈'
  };
  return icons[chain as keyof typeof icons] || '●';
};