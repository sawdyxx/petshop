import { products, reviews, shopAdvantages } from '../data/products'

function AboutPage() {
  const totalProducts = products.length

  return (
    <div className="page-content about-page">
      <section className="about-hero">
        <div className="about-hero-top">
          <span className="about-hero-badge">О PawPalace</span>
          <svg className="about-hero-mark" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M14 40c0-8 6-14 14-14s14 6 14 14-6 14-14 14-14-6-14-14Z" fill="#fc8200" />
            <path
              d="M26 18c0-4 3-7 7-7s7 3 7 7-3 7-7 7-7-3-7-7ZM10 24c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5Zm39 0c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5ZM18 11c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5Zm23 0c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5Z"
              fill="#ffd8ad"
            />
          </svg>
        </div>
        <h1>
          Мы делаем заботу о питомцах <span>приятной</span> каждый день
        </h1>
        <p>
          PawPalace объединяет качественные товары, честные условия и удобный сервис, чтобы вам было легко
          выбирать лучшее для своего любимца.
        </p>
      </section>

      <section className="about-pillars">
        <article className="about-pillar-card">
          <div className="about-pillar-head">
            <svg className="about-pillar-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3 4 7v6c0 5 3.4 9.4 8 10.7 4.6-1.3 8-5.7 8-10.7V7l-8-4Z" fill="#fc8200" />
            </svg>
            <h3>Наша миссия</h3>
          </div>
          <p>Подбирать товары, которые улучшают повседневную жизнь питомцев и делают уход проще.</p>
        </article>
        <article className="about-pillar-card">
          <div className="about-pillar-head">
            <svg className="about-pillar-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 4h14v16H5V4Zm3 3v2h8V7H8Zm0 4v2h8v-2H8Zm0 4v2h5v-2H8Z" fill="#fc8200" />
            </svg>
            <h3>Как мы работаем</h3>
          </div>
          <p>Постоянно обновляем каталог, проверяем качество и сохраняем прозрачные условия покупки.</p>
        </article>
        <article className="about-pillar-card">
          <div className="about-pillar-head">
            <svg className="about-pillar-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21c-4.6-2.6-8-6-8-10.2C4 7 7 4 10.5 4c1.7 0 3.3.8 4.5 2.1C16.2 4.8 17.8 4 19.5 4 23 4 26 7 26 10.8 26 15 22.6 18.4 18 21l-3-1.7L12 21Z" fill="#fc8200" transform="translate(-3)" />
            </svg>
            <h3>Что важно для нас</h3>
          </div>
          <p>Дружелюбный сервис, понятная навигация и единый стиль на всех страницах магазина.</p>
        </article>
      </section>

      <section className="about-stats">
        <article className="about-stat-card">
          <svg className="about-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5h16v14H4V5Zm3 3v8h10V8H7Z" fill="#904800" />
          </svg>
          <strong>{totalProducts}+</strong>
          <span>товаров в каталоге</span>
        </article>
        <article className="about-stat-card">
          <svg className="about-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 5v5l4 2-1 2-5-3V7h2Z" fill="#904800" />
          </svg>
          <strong>7 дней</strong>
          <span>поддержка клиентов</span>
        </article>
        <article className="about-stat-card">
          <svg className="about-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 14h11v5H3v-5Zm13-6h5l3 4v7h-8V8Zm2 2v7h4v-3.4L19.8 10H18Z" fill="#904800" />
          </svg>
          <strong>1 день</strong>
          <span>быстрая доставка по городу</span>
        </article>
      </section>

      <section className="about-story">
        <article className="about-story-card">
          <h3>Почему выбирают нас</h3>
          <ul className="about-advantages-list">
            {shopAdvantages.map((item) => (
              <li key={item}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m9.2 16.6-3.8-3.8 1.4-1.4 2.4 2.4 7-7 1.4 1.4-8.4 8.4Z" fill="#fc8200" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="about-story-card">
          <h3>Отзывы покупателей</h3>
          <div className="about-reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="about-review-item">
                <strong>{review.author}</strong>
                <p>{review.text}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="about-cta">
        <h2>Вместе создаём счастливую жизнь для питомцев</h2>
        <p>Спасибо, что выбираете PawPalace. Мы продолжаем развивать магазин, чтобы покупки были ещё удобнее.</p>
        <ul className="about-cta-points">
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 5h16v12H4V5Zm2 2v8h12V7H6Zm5 11h2v2h-2v-2Z" fill="#fc8200" />
            </svg>
            <span>Широкий ассортимент для разных питомцев</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3 5 7v5c0 4.3 2.9 8.2 7 9.3 4.1-1.1 7-5 7-9.3V7l-7-4Z" fill="#fc8200" />
            </svg>
            <span>Проверенные товары и понятные карточки</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 13h11v6H3v-6Zm13-7h5l3 4v9h-8V6Zm2 2v9h4V11l-1.5-3H18Z" fill="#fc8200" />
            </svg>
            <span>Быстрая доставка и поддержка без выходных</span>
          </li>
        </ul>
      </section>
    </div>
  )
}

export default AboutPage
