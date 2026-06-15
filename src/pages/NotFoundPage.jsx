import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'

function NotFoundPage() {
  const { t } = useLanguage()

  return (
    <div className="page-content">
      <section className="not-found">
        <div className="not-found-icon">🐾</div>
        <h1>404</h1>
        <p>{t('notFound.text')}</p>
        <div className="inline-actions">
          <Link to="/" className="btn btn-primary">
            {t('notFound.home')}
          </Link>
          <Link to="/catalogue" className="btn btn-secondary">
            {t('notFound.catalog')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default NotFoundPage
