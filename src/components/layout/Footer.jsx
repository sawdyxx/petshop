function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-columns">
          <div className="footer-column">
            <h4>PetMall</h4>
            <p>Интернет-магазин товаров для домашних животных.</p>
            <p>Удобный каталог, быстрая доставка и приятный сервис каждый день.</p>
          </div>
          <div className="footer-column">
            <h4>Покупателям</h4>
            <a href="#!">Доставка и оплата</a>
            <a href="#!">Возврат товара</a>
            <a href="#!">Частые вопросы</a>
          </div>
          <div className="footer-column">
            <h4>Контакты</h4>
            <p>+996 (700) 123-456</p>
            <p>hello@petmall.kg</p>
            <p>ежедневно 09:00–21:00</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PetMall</span>
          <span>С любовью к питомцам</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
