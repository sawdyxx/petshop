import { useLanguage } from '../../context/useLanguage'

function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-columns">
          <div className="footer-column">
            <h4>PetMall</h4>
            <p>{t('footer.brandDescription')}</p>
            <p>{t('footer.brandSubtext')}</p>
          </div>
          <div className="footer-column">
            <h4>{t('footer.customersTitle')}</h4>
            <a href="#!">{t('footer.customersDelivery')}</a>
            <a href="#!">{t('footer.customersReturns')}</a>
            <a href="#!">{t('footer.customersFaq')}</a>
          </div>
          <div className="footer-column">
            <h4>{t('footer.contactsTitle')}</h4>
            <p>+996 (700) 123-456</p>
            <p>hello@petmall.kg</p>
            <p>{t('footer.hours')}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PetMall</span>
          <span>{t('footer.madeWithLove')}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
