/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ETHEREUM_RPC_WS: string;
  readonly VITE_POLYGON_RPC_WS: string;
  readonly VITE_ARBITRUM_RPC_WS: string;
  readonly VITE_APP_ENV: 'development' | 'production';
  readonly VITE_APP_NAME: string;
  readonly VITE_DEBUG_LOGGING: string;
  readonly VITE_GAS_UPDATE_INTERVAL: string;
  readonly VITE_PRICE_UPDATE_INTERVAL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
