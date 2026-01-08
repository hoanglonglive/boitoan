import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import vi from './locales/vi/translation.json'
import en from './locales/en/translation.json'

const defaultLang = 'vi'

// Xóa localStorage cũ nếu có giá trị không hợp lệ
const savedLang = localStorage.getItem('lang')
if (savedLang && !['vi', 'en'].includes(savedLang)) {
  localStorage.removeItem('lang')
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
    },
    lng: savedLang && ['vi', 'en'].includes(savedLang) ? savedLang : defaultLang,
    fallbackLng: defaultLang,
    interpolation: { escapeValue: false },
  })

export default i18n
