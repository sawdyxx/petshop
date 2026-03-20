import SectionTitle from '../components/ui/SectionTitle'

function ContactPage() {
  return (
    <div className="page-content">
      <SectionTitle title="Контакты" subtitle="Свяжитесь с нами удобным способом" />

      <div className="contact-layout">
        <article className="simple-info-card">
          <h3>Контактная информация</h3>
          <p>Телефон: +7 (900) 123-45-67</p>
          <p>Email: hello@petmall.ru</p>
          <p>Адрес: г. Алматы, ул. Бауыржана Момышулы, 15</p>
          <p>График: ежедневно 09:00–21:00</p>
        </article>

        <form className="contact-form">
          <h3>Форма обратной связи</h3>
          <input type="text" placeholder="Ваше имя" />
          <input type="email" placeholder="Ваш email" />
          <textarea rows="5" placeholder="Сообщение" />
          <button type="button" className="btn btn-primary">
            Отправить
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactPage
