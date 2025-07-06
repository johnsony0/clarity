import type React from 'react';
import { SettingInput } from './SettingInput';

interface CategorySectionProps {
  category: string;
  settings: any[];
  currentSettings: Record<string, any>;
  onChange: (id: string, value: any) => void;
  mode: number;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  settings,
  currentSettings,
  onChange,
  mode,
}) => {
  return (
    <div className={`${mode ? 'mb-8' : 'mb-2'}`}>
      <div className={`${mode ? 'mb-4' : 'mb-1'}`}>
        <h2 className={`text-xl font-semibold text-heading`}>{category}</h2>
        {category === 'Content' && <h6>Exclusive to Facebook and Twitter</h6>}
        {category === 'Topic' && <h6>[Beta Test] Exclusive to Facebook and Twitter</h6>}
        {category === 'Bias' && <h6>Exclusive to Facebook and Twitter</h6>}
      </div>
      <div className={`${mode ? 'space-y-4' : 'space-y-1'}`}>
        {settings.map(setting => (
          <SettingInput
            key={setting.id}
            setting={{ ...setting, value: currentSettings[setting.id] }}
            onChange={onChange}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
};
