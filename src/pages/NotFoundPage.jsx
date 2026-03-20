import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="page-content">
      <section className="not-found">
        <h1>404</h1>
        <p>Страница не найдена.</p>
        <Link to="/" className="btn btn-primary">
          Вернуться на главную
        </Link>
      </section>
    </div>
  )
}

export default NotFoundPage
