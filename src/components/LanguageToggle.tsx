import React from 'react';
import { useLanguageStore } from '../store/languageStore';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}
      className="px-3 py-1 rounded-md bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200"
    >
      {language.toUpperCase()}
    </button>
  );
}