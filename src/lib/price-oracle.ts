import { PriceData } from '@/types/gas';

/**
 * Uniswap V3 ETH/USDC Pool Price Oracle
 * In production, this would integrate with actual Uniswap V3 contracts
 */
export class UniswapV3PriceOracle {
  private poolAddress = '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640'; // ETH/USDC 0.05% pool
  private lastPrice = 3420.50;
  private priceHistory: PriceData[] = [];
  private volatility = 0.02; // 2% volatility for simulation

  constructor(initialPrice?: number) {
    if (initialPrice) {
      this.lastPrice = initialPrice;
    }
    this.initializePriceHistory();
  }

  /**
   * Initialize price history with some sample data
   */
  private initializePriceHistory(): void {
    const now = Date.now();
    const historyLength = 50;
    
    for (let i = historyLength; i >= 0; i--) {
      const timestamp = now - (i * 60000); // 1 minute intervals
      const price = this.generateRealisticPrice(this.lastPrice);
      
      this.priceHistory.push({
        timestamp,
        price
      });
    }
  }

  /**
   * Generate realistic price movements with trend and volatility
   */
  private generateRealisticPrice(basePrice: number): number {
    // Add small trend component
    const trend = (Math.random() - 0.5) * 0.001; // 0.1% trend
    
    // Add volatility
    const volatilityComponent = (Math.random() - 0.5) * this.volatility;
    
    // Add mean reversion
    const meanReversionTarget = 3500; // Target price
    const meanReversion = (meanReversionTarget - basePrice) * 0.0001;
    
    const priceChange = trend + volatilityComponent + meanReversion;
    const newPrice = basePrice * (1 + priceChange);
    
    // Ensure price stays within reasonable bounds
    return Math.max(Math.min(newPrice, 5000), 1000);
  }

  /**
   * Calculate ETH/USD price from Uniswap V3 sqrtPriceX96
   * This is the actual formula used by Uniswap V3
   */
  calculatePriceFromSqrtPriceX96(sqrtPriceX96: string): number {
    const sqrtPrice = parseInt(sqrtPriceX96, 16) / Math.pow(2, 96);
    const price = Math.pow(sqrtPrice, 2) * Math.pow(10, 12); // Adjust for token decimals
    return price;
  }

  /**
   * Fetch current ETH/USD price
   * In production, this would make actual calls to Uniswap V3 pool
   */
  async fetchCurrentPrice(): Promise<number> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      // Generate new realistic price
      const newPrice = this.generateRealisticPrice(this.lastPrice);
      this.lastPrice = newPrice;
      
      // Add to history
      this.addToHistory(newPrice);
      
      return this.lastPrice;
    } catch (error) {
      console.error('Error fetching ETH/USD price:', error);
      return this.lastPrice;
    }
  }

  /**
   * Add price point to history
   */
  private addToHistory(price: number): void {
    this.priceHistory.push({
      timestamp: Date.now(),
      price
    });
    
    // Keep only last 100 price points
    if (this.priceHistory.length > 100) {
      this.priceHistory = this.priceHistory.slice(-100);
    }
  }

  /**
   * Get price history for charting
   */
  getPriceHistory(): PriceData[] {
    return [...this.priceHistory];
  }

  /**
   * Get current price without API call
   */
  getCurrentPrice(): number {
    return this.lastPrice;
  }

  /**
   * Calculate 24h price change
   */
  get24hChange(): { absolute: number; percentage: number } {
    if (this.priceHistory.length < 2) {
      return { absolute: 0, percentage: 0 };
    }

    const current = this.lastPrice;
    const yesterday = this.priceHistory[0]?.price || current;
    const absolute = current - yesterday;
    const percentage = (absolute / yesterday) * 100;

    return { absolute, percentage };
  }

  /**
   * Get price statistics
   */
  getPriceStats(): {
    current: number;
    high24h: number;
    low24h: number;
    change24h: { absolute: number; percentage: number };
    volatility: number;
  } {
    const prices = this.priceHistory.map(p => p.price);
    const high24h = Math.max(...prices);
    const low24h = Math.min(...prices);
    const change24h = this.get24hChange();

    // Calculate volatility as standard deviation
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance) / mean;

    return {
      current: this.lastPrice,
      high24h,
      low24h,
      change24h,
      volatility
    };
  }

  /**
   * Set custom volatility for testing
   */
  setVolatility(volatility: number): void {
    this.volatility = Math.max(0.001, Math.min(volatility, 0.1)); // Clamp between 0.1% and 10%
  }

  /**
   * Simulate major price movement (for testing)
   */
  simulatePriceShock(magnitude: number): void {
    this.lastPrice *= (1 + magnitude);
    this.addToHistory(this.lastPrice);
  }
}
