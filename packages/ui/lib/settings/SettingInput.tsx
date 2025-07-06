import type React from 'react';
import { useState, useEffect } from 'react';
import { Button, Input, Field, Label, Switch, Select } from '@headlessui/react';

interface SettingInputProps {
  setting: any;
  onChange: (id: string, value: any) => void;
  mode: number;
}

export const SettingInput: React.FC<SettingInputProps> = ({ setting, onChange, mode }) => {
  const [arrayValue, setArrayValue] = useState<string>('');
  const [arrayItems, setArrayItems] = useState<string[]>(setting.value || []);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    ai: false,
    messages: false,
    search: false,
  });

  // Load saved slider value and toggle states on initial load
  useEffect(() => {
    chrome.storage.sync.get(['toggleStates'], result => {
      if (result.toggleStates !== undefined) {
        setToggleStates(result.toggleStates);
      }
    });
  }, []);

  // Sync arrayItems with setting.value
  useEffect(() => {
    if (setting.value && Array.isArray(setting.value)) {
      setArrayItems(setting.value);
    }
  }, [setting.value]);

  const handleArrayAdd = () => {
    if (arrayValue.trim()) {
      const newItems = [...arrayItems, arrayValue.trim()];
      setArrayItems(newItems);
      onChange(setting.id, newItems); // Update parent settings
      setArrayValue('');
    }
  };

  const handleArrayRemove = (item: string) => {
    const newItems = arrayItems.filter(i => i !== item);
    setArrayItems(newItems);
    onChange(setting.id, newItems); // Update parent settings
  };

  switch (setting.type) {
    case 'checkbox':
      return (
        <Field>
          <div className="flex items-center">
            <Switch
              checked={setting.value}
              onChange={checked => onChange(setting.id, checked)}
              disabled={toggleStates[setting.tag]}
              className={`${
                setting.value ? 'bg-secondary' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2
              ${toggleStates[setting.tag] ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <span
                className={`${
                  setting.value ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <Label className="ml-4 text-sm text-heading">{setting.label}</Label>
          </div>
          {setting.label === 'Grayscale' && (
            <h6>
              Known error when using Facebook Messenger overlay with Grayscale. Known error with timeout not showing on
              YouTube with Grayscale on.
            </h6>
          )}
        </Field>
      );
    case 'number':
      return (
        <div>
          <label htmlFor={setting.id} className="block text-sm font-medium text-heading">
            {setting.label}
          </label>
          <Input
            type="number"
            id={setting.id}
            value={setting.value}
            min={setting.min}
            max={setting.max}
            onChange={e => onChange(setting.id, parseInt(e.target.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm rounded-md shadow-sm bg-bg text-font"
          />
        </div>
      );
    case 'array':
      return (
        <div>
          <label htmlFor={setting.id} className="block text-sm font-medium text-heading">
            {setting.label}
          </label>
          <div className="flex">
            <Input
              type="text"
              value={arrayValue}
              placeholder={setting.placeholder}
              onChange={e => setArrayValue(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm rounded-md shadow-sm bg-bg text-font"
            />
            <Button
              onClick={handleArrayAdd}
              className="ml-2 px-4 py-2 bg-secondary text-heading rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
              Add
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap">
            {arrayItems.map((item, index) => (
              <span
                key={index}
                onClick={() => handleArrayRemove(item)}
                className="inline-block bg-secondary text-heading rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer hover:bg-secondary-dark">
                {item}
              </span>
            ))}
          </div>
        </div>
      );
    case 'select':
      return (
        <div>
          <label htmlFor={setting.id} className="block text-sm font-medium text-heading">
            {setting.label}
          </label>
          <Select
            id={setting.id}
            value={setting.value}
            onChange={e => onChange(setting.id, e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm rounded-md shadow-sm bg-bg text-font">
            {setting.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </Select>
        </div>
      );
    default:
      return null;
  }
};
