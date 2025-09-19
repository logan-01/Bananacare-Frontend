import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bananacare.app",
  appName: "bananacare",
  webDir: "out",
  // server: {
  //   url: "http://192.168.1.205:3000",
  //   cleartext: true,
  // },
  android: {
    path: "../mobile/android",
  },
  ios: {
    path: "../mobile/ios",
  },
  plugins: {
    StatusBar: {
      style: "dark",
      backgroundColor: "#000000",
      overlaysWebView: true,
    },
  },
};

export default config;
