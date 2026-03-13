import React, { useEffect, useRef } from 'react';
import { Activity, DollarSign, Wallet, RefreshCw } from 'lucide-react';
import { useGasStore } from '@/hooks/useGasStore';
import { WebSocketProvider } from '@/lib/websocket-provider';
import { UniswapV3PriceOracle } from '@/lib/price-oracle';
import { calculateGasCost, generateMockGasPrice } from '@/lib/gas-utils';
import { ChartDataPoint, SimulationCost, ChainName } from '@/types/gas';
import { PROVIDER_ENDPOINTS, config } from '@/config/providers';

import { ErrorNotifications } from './ErrorNotifications';
import { GasPriceCard } from './GasPriceCard';
import { SimulationControls } from './SimulationControls';
import { GasChart } from './GasChart';
import { SimulationResults } from './SimulationResults';

export const GasTracker: React.FC = () => {
  const { state, actions, selectors } = useGasStore();
  const providersRef = useRef<Record<string, WebSocketProvider>>({});
  const intervalsRef = useRef<Record<string, NodeJS.Timeout>>({});
  const priceOracleRef = useRef(new UniswapV3PriceOracle());

  // Initialize WebSocket connections and price oracle
  useEffect(() => {
    const rpcEndpoints: Record<string, string> = {
      ethereum: PROVIDER_ENDPOINTS.ethereum.wsUrl,
      polygon: PROVIDER_ENDPOINTS.polygon.wsUrl,
      arbitrum: PROVIDER_ENDPOINTS.arbitrum.wsUrl
    };

    // Initialize WebSocket providers (simulated for demo)
    Object.entries(rpcEndpoints).forEach(([chain, url]) => {
      const provider = new WebSocketProvider({ url, chainName: chain });
      providersRef.current[chain] = provider;

      provider.on('connect', () => {
        console.log(`Connected to ${chain}`);
        actions.updateChainData(chain as ChainName, { isConnected: true });
        actions.setConnected(true);
      });

      provider.on('disconnect', () => {
        console.log(`Disconnected from ${chain}`);
        actions.updateChainData(chain as ChainName, { isConnected: false });
        actions.addError({ message: `Disconnected from ${chain}`, type: 'warning', chain });
      });

      provider.on('error', (error) => {
        console.error(`Error from ${chain}:`, error);
        actions.addError({ message: `Connection error: ${chain}`, type: 'error', chain });
      });

      provider.on('block', (blockData) => {
        actions.updateChainData(chain as ChainName, {
          baseFee: blockData.baseFee,
          priorityFee: blockData.priorityFee,
          blockNumber: blockData.blockNumber,
          isConnected: true
        });
      });

      // Simulate connection for demo
      setTimeout(() => {
        provider.emit('connect', { status: 'connected', chain });
      }, Math.random() * 2000);
    });

    // Start price oracle updates
    const priceInterval = setInterval(async () => {
      try {
        const newPrice = await priceOracleRef.current.fetchCurrentPrice();
        actions.updateUsdPrice(newPrice);
      } catch (error) {
        console.error('Error updating ETH/USD price:', error);
        actions.addError({ message: 'Failed to update ETH/USD price', type: 'error' });
      }
    }, config.intervals.priceUpdate);

    intervalsRef.current.priceUpdate = priceInterval;

    // Simulate live gas updates
    const gasUpdateInterval = setInterval(() => {
      if (state.mode === 'live') {
        Object.keys(rpcEndpoints).forEach(chain => {
          const currentData = state.chains[chain as ChainName];
          const baseFee = generateMockGasPrice(currentData.baseFee || 15, 0.15);
          const priorityFee = generateMockGasPrice(currentData.priorityFee || 2, 0.2);
          const blockNumber = (currentData.blockNumber || 18000000) + Math.floor(Math.random() * 3) + 1;
          
          actions.updateChainData(chain as ChainName, {
            baseFee,
            priorityFee,
            blockNumber,
            isConnected: true
          });
        });
      }
    }, config.intervals.gasUpdate);

    intervalsRef.current.gasUpdate = gasUpdateInterval;

    return () => {
      Object.values(providersRef.current).forEach(provider => {
        provider.disconnect();
      });
      Object.values(intervalsRef.current).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, [state.mode, actions]);

  // Prepare chart data
  const chartData: ChartDataPoint[] = state.chains.ethereum.history.slice(-20).map((point, index) => ({
    time: new Date(point.timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    ethereum: point.totalFee,
    polygon: state.chains.polygon.history[index]?.totalFee || 0,
    arbitrum: state.chains.arbitrum.history[index]?.totalFee || 0
  }));

  // Calculate simulation costs
  const simulationCosts: SimulationCost[] = Object.entries(state.chains).map(([chain, data]) => {
    const cost = calculateGasCost(data.baseFee, data.priorityFee, state.simulationGasLimit, state.usdPrice);
    
    return {
      chain: chain.charAt(0).toUpperCase() + chain.slice(1),
      chainKey: chain,
      baseFee: data.baseFee.toFixed(2),
      priorityFee: data.priorityFee.toFixed(2),
      totalFee: (data.baseFee + data.priorityFee).toFixed(2),
      costUSD: cost.totalCostUSD.toFixed(6),
      costETH: cost.totalFeeEth.toFixed(8),
      blockNumber: data.blockNumber,
      isConnected: data.isConnected
    };
  });

  // Get best chain recommendation
  const bestChain = simulationCosts.reduce((best, current) => 
    parseFloat(current.costUSD) < parseFloat(best.costUSD) ? current : best
  );

  const connectionStatus = Object.values(state.chains).some(chain => chain.isConnected);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Error Messages */}
        <ErrorNotifications 
          errors={state.errors}
          onRemoveError={actions.removeError}
        />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-2 text-gradient-crypto">
            Real-Time Cross-Chain Gas Tracker
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Live gas prices across Ethereum, Polygon, and Arbitrum networks with USD simulation
          </p>
          <div className="flex justify-center items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-colors ${
                connectionStatus ? 'bg-success glow-success' : 'bg-destructive'
              }`}></div>
              <span className="text-sm text-muted-foreground">
                {connectionStatus ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign size={16} />
              ETH/USD: ${state.usdPrice.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date(state.lastPriceUpdate).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-card rounded-xl p-1 flex shadow-lg border border-border">
            <button
              onClick={() => actions.setMode('live')}
              className={`px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 font-medium ${
                state.mode === 'live' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Activity size={18} />
              Live Mode
            </button>
            <button
              onClick={() => actions.setMode('simulation')}
              className={`px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 font-medium ${
                state.mode === 'simulation' 
                  ? 'bg-secondary text-secondary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Wallet size={18} />
              Simulation Mode
            </button>
          </div>
        </div>

        {/* Simulation Controls */}
        {state.mode === 'simulation' && (
          <SimulationControls
            amount={state.simulationAmount}
            gasLimit={state.simulationGasLimit}
            onAmountChange={actions.setSimulationAmount}
            onGasLimitChange={actions.setSimulationGasLimit}
          />
        )}

        {/* Gas Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(state.chains).map(([chain, data]) => (
            <GasPriceCard 
              key={chain}
              chain={chain}
              data={data}
            />
          ))}
        </div>

        {/* Chart */}
        <GasChart 
          data={chartData}
          className="mb-8"
        />

        {/* Simulation Results */}
        {state.mode === 'simulation' && (
          <SimulationResults
            costs={simulationCosts}
            bestChain={bestChain}
            simulationAmount={state.simulationAmount}
          />
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-lg">Real-time data from Ethereum, Polygon, and Arbitrum networks</p>
          <p className="text-sm mt-2">Updates every 6 seconds in live mode • ETH/USD from Uniswap V3</p>
          <div className="mt-4 flex justify-center items-center gap-4 text-xs">
            <span>Built with React + TypeScript + Zustand</span>
            <span>•</span>
            <span>WebSocket RPC Connections</span>
            <span>•</span>
            <span>Uniswap V3 Price Oracle</span>
          </div>
          <div className="mt-2 flex justify-center">
            <RefreshCw 
              size={16} 
              className={`text-muted-foreground ${state.mode === 'live' ? 'animate-spin' : ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};