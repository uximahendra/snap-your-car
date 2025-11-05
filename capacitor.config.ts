import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0f00b5ea324f4141b0764fc14e1aa065',
  appName: 'auto-studio-magic',
  webDir: 'dist',
  server: {
    url: 'https://0f00b5ea-324f-4141-b076-4fc14e1aa065.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    ScreenOrientation: {
      lock: 'landscape'
    }
  }
};

export default config;
