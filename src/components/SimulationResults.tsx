import React from 'react';
import { DollarSign, CheckCircle, WifiOff, TrendingDown } from 'lucide-react';
import { SimulationCost } from '@/types/gas';
import { formatCurrency } from '@/lib/gas-utils';

interface SimulationResultsProps {
  costs: SimulationCost[];
  bestChain: SimulationCost;
  simulationAmount: number;
  className?: string;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({
  costs,
  bestChain,
  simulationAmount,
  className = ''
}) => {
  return (
    <div className={`bg-card rounded-xl p-6 shadow-lg chart-container ${className}`}>
      <h3 className="text-2xl font-semibold text-card-foreground mb-6 flex items-center gap-2">
        <DollarSign size={24} className="text-primary" />
        Transaction Cost Analysis ({simulationAmount} ETH transfer)
      </h3>
      
      {/* Best Chain Recommendation */}
      <div className="mb-6 p-4 bg-success/10 rounded-lg border border-success/20">
        <h4 className="text-success font-semibold mb-2 flex items-center gap-2">
          <TrendingDown size={18} />
          Best Choice:
        </h4>
        <p className="text-success/90">
          <strong>{bestChain.chain}</strong> offers the lowest transaction cost at{' '}
          <strong>{formatCurrency(parseFloat(bestChain.costUSD))}</strong>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-muted-foreground p-3 font-medium">Chain</th>
              <th className="text-left text-muted-foreground p-3 font-medium">Status</th>
              <th className="text-left text-muted-foreground p-3 font-medium">Base Fee</th>
              <th className="text-left text-muted-foreground p-3 font-medium">Priority Fee</th>
              <th className="text-left text-muted-foreground p-3 font-medium">Total Fee</th>
              <th className="text-left text-muted-foreground p-3 font-medium">Cost (ETH)</th>
              <th className="text-left text-muted-foreground p-3 font-medium">Cost (USD)</th>
              <th className="text-left text-muted-foreground p-3 font-medium">Block</th>
            </tr>
          </thead>
          <tbody>
            {costs.map((cost) => (
              <tr 
                key={cost.chain} 
                className={`border-b border-border hover:bg-muted/20 transition-colors ${
                  cost.chainKey === bestChain.chainKey ? 'bg-success/5' : ''
                }`}
              >
                <td className="text-card-foreground p-3 font-medium">
                  <div className="flex items-center gap-2">
                    {cost.chain}
                    {cost.chainKey === bestChain.chainKey && (
                      <span className="text-success text-xs font-medium px-2 py-1 bg-success/20 rounded-full">
                        Best
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  {cost.isConnected ? (
                    <span className="text-success text-sm flex items-center gap-1">
                      <CheckCircle size={14} />
                      Online
                    </span>
                  ) : (
                    <span className="text-destructive text-sm flex items-center gap-1">
                      <WifiOff size={14} />
                      Offline
                    </span>
                  )}
                </td>
                <td className="text-muted-foreground p-3 font-mono">{cost.baseFee} gwei</td>
                <td className="text-muted-foreground p-3 font-mono">{cost.priorityFee} gwei</td>
                <td className="text-muted-foreground p-3 font-mono">{cost.totalFee} gwei</td>
                <td className="text-muted-foreground p-3 font-mono">{cost.costETH}</td>
                <td className={`p-3 font-semibold font-mono ${
                  cost.chainKey === bestChain.chainKey 
                    ? 'text-success glow-success' 
                    : 'text-warning'
                }`}>
                  ${cost.costUSD}
                </td>
                <td className="text-muted-foreground p-3 font-mono text-sm">
                  #{cost.blockNumber.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-muted/10 rounded-lg border border-border">
          <div className="text-muted-foreground text-sm">Cheapest Option</div>
          <div className="text-card-foreground font-semibold text-lg">
            {bestChain.chain}
          </div>
          <div className="text-success font-mono text-sm">
            ${bestChain.costUSD}
          </div>
        </div>
        
        <div className="p-4 bg-muted/10 rounded-lg border border-border">
          <div className="text-muted-foreground text-sm">Most Expensive</div>
          <div className="text-card-foreground font-semibold text-lg">
            {costs.reduce((most, current) => 
              parseFloat(current.costUSD) > parseFloat(most.costUSD) ? current : most
            ).chain}
          </div>
          <div className="text-warning font-mono text-sm">
            ${costs.reduce((most, current) => 
              parseFloat(current.costUSD) > parseFloat(most.costUSD) ? current : most
            ).costUSD}
          </div>
        </div>
        
        <div className="p-4 bg-muted/10 rounded-lg border border-border">
          <div className="text-muted-foreground text-sm">Potential Savings</div>
          <div className="text-success font-semibold text-lg">
            ${(parseFloat(costs.reduce((most, current) => 
              parseFloat(current.costUSD) > parseFloat(most.costUSD) ? current : most
            ).costUSD) - parseFloat(bestChain.costUSD)).toFixed(6)}
          </div>
          <div className="text-muted-foreground text-xs">
            vs most expensive
          </div>
        </div>
      </div>
    </div>
  );
};