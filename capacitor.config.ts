import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bananacare.app",
  appName: "bananacare",
  webDir: "out",
  server: {
    url: " http://192.168.1.200:3000",
    cleartext: true,
  },
  android: {
    path: "../mobile/android",
  },
  ios: {
    path: "../mobile/ios",
  },
};

export default config;
