import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="page-content">
      <section className="not-found">
        <div className="not-found-icon">🐾</div>
        <h1>404</h1>
        <p>Похоже, этой страницы больше нет или ссылка введена с ошибкой.</p>
        <div className="inline-actions">
          <Link to="/" className="btn btn-primary">
            Вернуться на главную
          </Link>
          <Link to="/catalogue" className="btn btn-secondary">
            Открыть каталог
          </Link>
        </div>
      </section>
    </div>
  )
}

export default NotFoundPage
