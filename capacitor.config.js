/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.FinanceTracker.dncelzie',
  appName: 'Finance Tracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#00C896',
    },
  },
};

module.exports = config;
