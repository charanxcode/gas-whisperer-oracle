import { WebSocketProviderOptions, BlockData } from '@/types/gas';

export class WebSocketProvider {
  private url: string;
  private chainName: string;
  private ws: WebSocket | null = null;
  private listeners: Map<string, Array<(data: any) => void>> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;

  constructor(options: WebSocketProviderOptions) {
    this.url = options.url;
    this.chainName = options.chainName;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 5;
    this.reconnectDelay = options.reconnectDelay ?? 1000;
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  connect(): void {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.log(`Connected to ${this.chainName}`);
        this.emit('connect', { status: 'connected', chain: this.chainName });
        
        // Subscribe to new blocks
        this.subscribeToBlocks();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.emit('disconnect', { chain: this.chainName });
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error(`WebSocket error for ${this.chainName}:`, error);
        this.emit('error', { error, chain: this.chainName });
      };
    } catch (error) {
      console.error(`Failed to connect to ${this.chainName}:`, error);
      this.attemptReconnect();
    }
  }

  private subscribeToBlocks(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        id: 1,
        method: 'eth_subscribe',
        params: ['newHeads']
      }));
    }
  }

  private handleMessage(data: any): void {
    if (data.method === 'eth_subscription' && data.params?.result) {
      this.handleNewBlock(data.params.result);
    }
  }

  private handleNewBlock(blockData: any): void {
    const baseFee = parseInt(blockData.baseFeePerGas || '0x0', 16) / 1e9;
    const priorityFee = Math.random() * 5 + 1; // Simulated priority fee
    
    const processedBlock: BlockData = {
      blockNumber: parseInt(blockData.number, 16),
      baseFee,
      priorityFee,
      timestamp: Date.now(),
      chain: this.chainName
    };

    this.emit('block', processedBlock);
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect to ${this.chainName} (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
    } else {
      console.error(`Max reconnection attempts reached for ${this.chainName}`);
      this.emit('maxReconnectAttemptsReached', { chain: this.chainName });
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getChainName(): string {
    return this.chainName;
  }

  // Send custom RPC requests
  sendRequest(method: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const id = Date.now();
      const request = {
        id,
        method,
        params
      };

      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 30000);

      const handleResponse = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.id === id) {
            clearTimeout(timeout);
            this.ws!.removeEventListener('message', handleResponse);
            
            if (data.error) {
              reject(new Error(data.error.message));
            } else {
              resolve(data.result);
            }
          }
        } catch (error) {
          // Ignore parsing errors for subscription messages
        }
      };

      this.ws.addEventListener('message', handleResponse);
      this.ws.send(JSON.stringify(request));
    });
  }
}