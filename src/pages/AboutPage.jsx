import SectionTitle from '../components/ui/SectionTitle'

function AboutPage() {
  return (
    <div className="page-content">
      <SectionTitle title="О нас" subtitle="Немного о команде и миссии магазина" />

      <section className="simple-info-card">
        <p>
          PetMall — это интернет-магазин, который помогает владельцам домашних животных быстро находить
          качественные товары.
        </p>
        <p>
          Мы делаем ставку на понятный сервис: удобный каталог, честные отзывы, прозрачные условия и
          дружелюбную поддержку.
        </p>
        <p>
          Наша цель — сделать покупку товаров для питомцев простой и приятной, даже для тех, кто
          заказывает онлайн впервые.
        </p>
      </section>
    </div>
  )
}

export default AboutPage
