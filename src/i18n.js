import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import uzTranslation from './locales/uz/translation.json';
import enTranslation from './locales/en/translation.json';
import ruTranslation from './locales/ru/translation.json';

const resources = {
  uz: {
    translation: uzTranslation 
  },
  en: {
    translation: enTranslation 
  },
  ru: {
    translation: ruTranslation
  }
};

i18n
  .use(LanguageDetector)
  
  .use(initReactI18next) 
  
  .init({
    resources: resources,
    
    fallbackLng: 'en', 
    ns: ['translation'],
    defaultNS: 'translation',
    
    react: {
      useSuspense: false
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
    }
  });

// i18n can be exported here as default, if needed elsewhere
