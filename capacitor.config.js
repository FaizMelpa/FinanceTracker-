/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.mycashjournal.Fz',
  appName: 'Cash Journal',
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
