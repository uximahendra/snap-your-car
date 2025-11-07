import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.snapyourcar',
  appName: 'snap-your-car',
  webDir: 'dist',
  // server: {
  //   url: 'https://0f00b5ea-324f-4141-b076-4fc14e1aa065.lovableproject.com?forceHideBadge=true',
  //   cleartext: true,
  //   androidScheme: 'https'
  // },
  android: {
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: "#0F1729",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    },
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;
