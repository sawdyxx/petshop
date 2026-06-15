import { useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './LanguageContextValue'
import {
  DEFAULT_LANGUAGE,
  getTranslationValue,
  interpolateTranslation,
  LANGUAGE_LOCALES,
  LANGUAGE_OPTIONS,
  localizeProduct,
  translateAnimalType,
  translateCategory,
} from '../i18n/translations'

const LANGUAGE_STORAGE_KEY = 'pawpalace-language'

function getStoredLanguage() {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  const isSupported = LANGUAGE_OPTIONS.some((option) => option.code === storedLanguage)

  return isSupported ? storedLanguage : DEFAULT_LANGUAGE
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getStoredLanguage)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(() => {
    const locale = LANGUAGE_LOCALES[language] ?? LANGUAGE_LOCALES[DEFAULT_LANGUAGE]

    const t = (key, params) => {
      const currentValue = getTranslationValue(language, key)
      const fallbackValue = getTranslationValue(DEFAULT_LANGUAGE, key)
      return interpolateTranslation(currentValue ?? fallbackValue ?? key, params)
    }

    return {
      language,
      setLanguage,
      locale,
      languages: LANGUAGE_OPTIONS.map((option) => ({
        ...option,
        label: t(`language.${option.code}`),
      })),
      t,
      formatPrice(value) {
        return `${new Intl.NumberFormat(locale).format(Number(value) || 0)} ${t('common.currency')}`
      },
      formatDate(value, options = { dateStyle: 'medium', timeStyle: 'short' }) {
        return new Intl.DateTimeFormat(locale, options).format(new Date(value))
      },
      localizeProduct(product) {
        return localizeProduct(product, language)
      },
      translateAnimalType(value) {
        return translateAnimalType(value, language)
      },
      translateCategory(value) {
        return translateCategory(value, language)
      },
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
