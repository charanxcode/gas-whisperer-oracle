/**
 * Configuration module for environment variables
 * Load and validate all configuration values
 */

interface AppConfig {
  app: {
    env: 'development' | 'production';
    name: string;
    debugLogging: boolean;
  };
  rpc: {
    ethereum: string;
    polygon: string;
    arbitrum: string;
  };
  intervals: {
    gasUpdate: number;
    priceUpdate: number;
  };
}

const getEnvVariable = (key: keyof ImportMetaEnv, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value && !defaultValue) {
    console.warn(`Missing environment variable: ${key}`);
  }
  return value || '';
};

export const config: AppConfig = {
  app: {
    env: (import.meta.env.VITE_APP_ENV || 'development') as 'development' | 'production',
    name: import.meta.env.VITE_APP_NAME || 'Gas Whisperer Oracle',
    debugLogging: import.meta.env.VITE_DEBUG_LOGGING === 'true',
  },
  rpc: {
    ethereum: getEnvVariable(
      'VITE_ETHEREUM_RPC_WS',
      'wss://mainnet.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID'
    ),
    polygon: getEnvVariable(
      'VITE_POLYGON_RPC_WS',
      'wss://polygon-mainnet.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID'
    ),
    arbitrum: getEnvVariable(
      'VITE_ARBITRUM_RPC_WS',
      'wss://arbitrum-mainnet.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID'
    ),
  },
  intervals: {
    gasUpdate: parseInt(import.meta.env.VITE_GAS_UPDATE_INTERVAL || '6000'),
    priceUpdate: parseInt(import.meta.env.VITE_PRICE_UPDATE_INTERVAL || '10000'),
  },
};

/**
 * Validate configuration on initialization
 */
export const validateConfig = (): boolean => {
  const requiredVars: (keyof ImportMetaEnv)[] = [
    'VITE_ETHEREUM_RPC_WS',
    'VITE_POLYGON_RPC_WS',
    'VITE_ARBITRUM_RPC_WS',
  ];

  const missing = requiredVars.filter(
    (key) => !import.meta.env[key] || import.meta.env[key]?.includes('YOUR_')
  );

  if (missing.length > 0) {
    console.warn(
      `⚠️ Missing or incomplete configuration for: ${missing.join(', ')}`,
      '\nPlease set these environment variables in .env file'
    );
    return false;
  }

  return true;
};

export default config;
