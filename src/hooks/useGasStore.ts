import { useState, useCallback } from 'react';
import { 
  GasStoreState, 
  ChainName, 
  ErrorNotification, 
  BlockData,
  ChainData 
} from '@/types/gas';
import { generateCandlestickData } from '@/lib/gas-utils';

const initialChainData: ChainData = {
  baseFee: 0,
  priorityFee: 0,
  history: [],
  candlestickData: [],
  lastUpdate: Date.now(),
  isConnected: false,
  blockNumber: 0
};

const initialState: GasStoreState = {
  mode: 'live',
  chains: {
    ethereum: { ...initialChainData, baseFee: 15.5, priorityFee: 2.1 },
    polygon: { ...initialChainData, baseFee: 0.03, priorityFee: 0.01 },
    arbitrum: { ...initialChainData, baseFee: 0.8, priorityFee: 0.2 }
  },
  usdPrice: 3420.50,
  priceHistory: [],
  simulationAmount: 0.5,
  simulationGasLimit: 21000,
  isConnected: false,
  errors: [],
  lastPriceUpdate: Date.now()
};

export const useGasStore = () => {
  const [state, setState] = useState<GasStoreState>(initialState);

  const updateChainData = useCallback((chain: ChainName, data: Partial<BlockData & { isConnected: boolean }>) => {
    setState(prev => {
      const chainData = prev.chains[chain];
      const newDataPoint = {
        timestamp: Date.now(),
        baseFee: data.baseFee ?? chainData.baseFee,
        priorityFee: data.priorityFee ?? chainData.priorityFee,
        totalFee: (data.baseFee ?? chainData.baseFee) + (data.priorityFee ?? chainData.priorityFee),
        blockNumber: data.blockNumber ?? chainData.blockNumber
      };

      // Generate candlestick data for 15-minute intervals
      const updatedHistory = [...chainData.history.slice(-100), newDataPoint];
      const candlestickData = generateCandlestickData(updatedHistory);

      return {
        ...prev,
        chains: {
          ...prev.chains,
          [chain]: {
            ...chainData,
            baseFee: data.baseFee ?? chainData.baseFee,
            priorityFee: data.priorityFee ?? chainData.priorityFee,
            blockNumber: data.blockNumber ?? chainData.blockNumber,
            lastUpdate: Date.now(),
            isConnected: data.isConnected ?? chainData.isConnected,
            history: updatedHistory,
            candlestickData
          }
        }
      };
    });
  }, []);

  const updateUsdPrice = useCallback((price: number) => {
    setState(prev => ({
      ...prev,
      usdPrice: price,
      lastPriceUpdate: Date.now(),
      priceHistory: [...prev.priceHistory.slice(-100), {
        timestamp: Date.now(),
        price: price
      }]
    }));
  }, []);

  const setMode = useCallback((mode: 'live' | 'simulation') => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const setSimulationAmount = useCallback((amount: number) => {
    setState(prev => ({ ...prev, simulationAmount: amount }));
  }, []);

  const setSimulationGasLimit = useCallback((gasLimit: number) => {
    setState(prev => ({ ...prev, simulationGasLimit: gasLimit }));
  }, []);

  const setConnected = useCallback((connected: boolean) => {
    setState(prev => ({ ...prev, isConnected: connected }));
  }, []);

  const addError = useCallback((error: Omit<ErrorNotification, 'id'>) => {
    setState(prev => ({
      ...prev,
      errors: [...prev.errors.slice(-4), { ...error, id: Date.now() }]
    }));
  }, []);

  const removeError = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      errors: prev.errors.filter(error => error.id !== id)
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: [] }));
  }, []);

  const resetChainData = useCallback((chain?: ChainName) => {
    setState(prev => {
      if (chain) {
        return {
          ...prev,
          chains: {
            ...prev.chains,
            [chain]: { ...initialChainData }
          }
        };
      }
      
      // Reset all chains
      return {
        ...prev,
        chains: {
          ethereum: { ...initialChainData },
          polygon: { ...initialChainData },
          arbitrum: { ...initialChainData }
        }
      };
    });
  }, []);

  const getBestChain = useCallback(() => {
    const { chains, simulationGasLimit, usdPrice } = state;
    
    let bestChain: ChainName = 'ethereum';
    let lowestCost = Infinity;

    (Object.entries(chains) as [ChainName, ChainData][]).forEach(([chain, data]) => {
      if (!data.isConnected) return;
      
      const totalFeeGwei = data.baseFee + data.priorityFee;
      const totalFeeEth = (totalFeeGwei * simulationGasLimit) / 1e9;
      const totalCostUSD = totalFeeEth * usdPrice;
      
      if (totalCostUSD < lowestCost) {
        lowestCost = totalCostUSD;
        bestChain = chain;
      }
    });

    return bestChain;
  }, [state]);

  const getChainStats = useCallback(() => {
    const stats = Object.entries(state.chains).map(([chain, data]) => {
      const history = data.history.slice(-10); // Last 10 data points
      if (history.length < 2) {
        return {
          chain: chain as ChainName,
          trend: 'stable' as const,
          avgGasPrice: data.baseFee + data.priorityFee,
          changePercentage: 0
        };
      }

      const recent = history[history.length - 1].totalFee;
      const previous = history[0].totalFee;
      const changePercentage = ((recent - previous) / previous) * 100;
      const avgGasPrice = history.reduce((sum, point) => sum + point.totalFee, 0) / history.length;

      return {
        chain: chain as ChainName,
        trend: Math.abs(changePercentage) < 1 ? 'stable' : changePercentage > 0 ? 'up' : 'down',
        avgGasPrice,
        changePercentage
      };
    });

    return stats;
  }, [state.chains]);

  return {
    state,
    actions: {
      updateChainData,
      updateUsdPrice,
      setMode,
      setSimulationAmount,
      setSimulationGasLimit,
      setConnected,
      addError,
      removeError,
      clearErrors,
      resetChainData
    },
    selectors: {
      getBestChain,
      getChainStats
    }
  };
};