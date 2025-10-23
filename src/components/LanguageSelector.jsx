import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = {
  uz: { nativeName: 'O`zbekcha' },
  en: { nativeName: 'English' },
  ru: { nativeName: 'Русский' },
};

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const currentLang = i18n.resolvedLanguage; 

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <select
      value={currentLang}
      onChange={handleLanguageChange}
      className="bg-gray-100 border border-gray-300 text-gray-700 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      aria-label="Select language"
    >
      {Object.keys(LANGUAGES).map((lng) => (
        <option key={lng} value={lng}>
          {LANGUAGES[lng].nativeName}
        </option>
      ))}
    </select>
  );
}
