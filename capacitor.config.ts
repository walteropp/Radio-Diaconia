import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.radiodiaconia.app',
  appName: 'Radio Diaconia',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
