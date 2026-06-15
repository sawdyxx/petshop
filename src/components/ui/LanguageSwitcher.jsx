import { useLanguage } from '../../context/useLanguage'

function LanguageSwitcher({ className = '' }) {
  const { language, languages, setLanguage, t } = useLanguage()

  return (
    <label className={`language-switcher ${className}`.trim()}>
      <span>{t('language.label')}</span>
      <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t('language.label')}>
        {languages.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default LanguageSwitcher
