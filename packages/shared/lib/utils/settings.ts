export const getDefaultSettings = (settings: any) => {
  const defaultSettings: Record<string, any> = {};
  Object.keys(settings).forEach(category => {
    settings[category].forEach((setting: any) => {
      defaultSettings[setting.id] = setting.default;
    });
  });
  return defaultSettings;
};
