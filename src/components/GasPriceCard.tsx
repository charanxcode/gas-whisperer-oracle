import React from 'react';
import { Zap, CheckCircle, WifiOff } from 'lucide-react';
import { ChainData } from '@/types/gas';
import { formatGasPrice } from '@/lib/gas-utils';

interface GasPriceCardProps {
  chain: string;
  data: ChainData;
  className?: string;
}

export const GasPriceCard: React.FC<GasPriceCardProps> = ({
  chain,
  data,
  className = ''
}) => {
  const chainColors = {
    ethereum: 'text-ethereum border-ethereum/20',
    polygon: 'text-polygon border-polygon/20',
    arbitrum: 'text-arbitrum border-arbitrum/20'
  };

  const chainColor = chainColors[chain as keyof typeof chainColors] || 'text-muted-foreground border-muted/20';

  return (
    <div className={`bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 gas-indicator border ${chainColor} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-card-foreground capitalize flex items-center gap-2">
          {chain}
          {data.isConnected ? (
            <CheckCircle className="text-success glow-success" size={20} />
          ) : (
            <WifiOff className="text-destructive" size={20} />
          )}
        </h3>
        <Zap className="text-warning" size={28} />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Base Fee:</span>
          <span className="text-card-foreground font-mono font-medium">
            {formatGasPrice(data.baseFee)} gwei
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Priority Fee:</span>
          <span className="text-card-foreground font-mono font-medium">
            {formatGasPrice(data.priorityFee)} gwei
          </span>
        </div>
        
        <div className="flex justify-between items-center border-t border-border pt-3">
          <span className="text-muted-foreground font-medium">Total:</span>
          <span className="text-success font-semibold font-mono text-lg">
            {formatGasPrice(data.baseFee + data.priorityFee)} gwei
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Block:</span>
          <span className="text-muted-foreground font-mono">#{data.blockNumber.toLocaleString()}</span>
        </div>
        
        {data.lastUpdate && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
            Updated: {new Date(data.lastUpdate).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};