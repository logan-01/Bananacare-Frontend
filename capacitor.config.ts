import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bananacare.app",
  appName: "bananacare",
  webDir: "out",
  //!Remove Server in Production
  // server: {
  //   url: "http://192.168.1.207:3000",
  //   cleartext: true,
  // },
  plugins: {
    StatusBar: {
      style: "dark",
      backgroundColor: "#000000",
      overlaysWebView: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#fbfefa",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
    },
  },
};

export default config;
