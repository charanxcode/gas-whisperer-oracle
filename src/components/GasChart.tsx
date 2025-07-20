import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ChartDataPoint } from '@/types/gas';

interface GasChartProps {
  data: ChartDataPoint[];
  className?: string;
}

export const GasChart: React.FC<GasChartProps> = ({ data, className = '' }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="text-card-foreground font-medium mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value.toFixed(2)} gwei`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-card rounded-xl p-6 shadow-lg chart-container ${className}`}>
      <h3 className="text-2xl font-semibold text-card-foreground mb-6 flex items-center gap-2">
        <TrendingUp size={24} className="text-primary" />
        Gas Price Trends (Real-Time)
      </h3>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ 
                value: 'Gas Price (gwei)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                color: 'hsl(var(--card-foreground))'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="ethereum" 
              stroke="hsl(var(--ethereum))" 
              strokeWidth={3}
              name="Ethereum"
              dot={{ fill: 'hsl(var(--ethereum))', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="polygon" 
              stroke="hsl(var(--polygon))" 
              strokeWidth={3}
              name="Polygon"
              dot={{ fill: 'hsl(var(--polygon))', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="arbitrum" 
              stroke="hsl(var(--arbitrum))" 
              strokeWidth={3}
              name="Arbitrum"
              dot={{ fill: 'hsl(var(--arbitrum))', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--ethereum))' }}></div>
          <span>Ethereum Mainnet</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--polygon))' }}></div>
          <span>Polygon</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--arbitrum))' }}></div>
          <span>Arbitrum</span>
        </div>
      </div>
    </div>
  );
};