import React from 'react';
import { Wallet, Info } from 'lucide-react';

interface SimulationControlsProps {
  amount: number;
  gasLimit: number;
  onAmountChange: (amount: number) => void;
  onGasLimitChange: (gasLimit: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  amount,
  gasLimit,
  onAmountChange,
  onGasLimitChange
}) => {
  const commonGasLimits = [
    { label: 'ETH Transfer', value: 21000 },
    { label: 'ERC-20 Transfer', value: 65000 },
    { label: 'Uniswap Swap', value: 150000 },
    { label: 'NFT Mint', value: 200000 },
    { label: 'Complex DeFi', value: 300000 }
  ];

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg chart-container">
      <h3 className="text-2xl font-semibold text-card-foreground mb-6 flex items-center gap-2">
        <Wallet size={24} className="text-primary" />
        Transaction Simulation
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-muted-foreground font-medium mb-2">
            Transaction Amount (ETH):
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
            className="w-full bg-input text-foreground px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            placeholder="0.5"
            step="0.01"
            min="0"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-muted-foreground font-medium mb-2">
            Gas Limit:
          </label>
          <input
            type="number"
            value={gasLimit}
            onChange={(e) => onGasLimitChange(parseInt(e.target.value) || 21000)}
            className="w-full bg-input text-foreground px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            placeholder="21000"
            min="21000"
          />
        </div>
      </div>

      {/* Quick presets */}
      <div className="mt-4">
        <label className="block text-muted-foreground font-medium mb-2">
          Quick Presets:
        </label>
        <div className="flex flex-wrap gap-2">
          {commonGasLimits.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onGasLimitChange(preset.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                gasLimit === preset.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:border-primary/30'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-start gap-3">
          <Info className="text-primary flex-shrink-0 mt-0.5" size={16} />
          <div className="text-primary/90 text-sm">
            <p className="font-medium mb-1">💡 Gas Limit Guidelines:</p>
            <ul className="space-y-1 text-xs">
              <li>• Standard ETH transfer: 21,000 gas</li>
              <li>• ERC-20 transfers: 65,000-80,000 gas</li>
              <li>• DEX swaps: 100,000-200,000 gas</li>
              <li>• NFT mints: 150,000-250,000 gas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};