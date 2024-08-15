import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'eu.project.threeco',
  appName: '3CO',
  webDir: 'www',
  plugins: {
    CapacitorSQLite: {
      "iosDatabaseLocation": "Library/CapacitorDatabase"
    }
  }
};

export default config;
