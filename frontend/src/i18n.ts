import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import vi from './locales/vi/translation.json'
import en from './locales/en/translation.json'

const savedLang = localStorage.getItem('lang')
const defaultLang = 'vi'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
    },
    lng: savedLang || defaultLang,
    fallbackLng: defaultLang,
    interpolation: { escapeValue: false },
  })

export default i18n
