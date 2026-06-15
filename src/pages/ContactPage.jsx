import { useState } from 'react'
import { useLanguage } from '../context/useLanguage'
import { submitContactMessage } from '../lib/storeApi'

function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' })

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitState({
        status: 'error',
        message: t('contact.errorMissingFields'),
      })
      return
    }

    try {
      setSubmitState({ status: 'loading', message: '' })
      await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        message: formData.message.trim(),
      })
      setSubmitState({
        status: 'success',
        message: t('contact.successMessage'),
      })
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      setSubmitState({
        status: 'error',
        message: error.message || t('contact.errorSubmit'),
      })
    }
  }

  return (
    <div className="page-content contact-page">
      <section className="contact-hero">
        <div className="contact-hero-top">
          <span className="contact-hero-badge">{t('contact.badge')}</span>
          <svg className="contact-hero-mark" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 6c-8.9 0-16 7.1-16 16v3h-4c-3.3 0-6 2.7-6 6v17c0 3.3 2.7 6 6 6h40c3.3 0 6-2.7 6-6V31c0-3.3-2.7-6-6-6h-4v-3c0-8.9-7.1-16-16-16Zm-10 19v-3c0-5.5 4.5-10 10-10s10 4.5 10 10v3H22Zm7 9h6v7h-6v-7Z" fill="#fc8200" />
          </svg>
        </div>
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.text')}</p>
      </section>

      <section className="contact-stats">
        <article className="contact-stat-card">
          <svg className="contact-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 5v5l4 2-1 2-5-3V7h2Z" fill="#904800" />
          </svg>
          <strong>09:00–21:00</strong>
          <span>{t('contact.hoursTitle')}</span>
        </article>
        <article className="contact-stat-card">
          <svg className="contact-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16v11H4V6Zm2 2v7h12V8H6Zm3 10h6v2H9v-2Z" fill="#904800" />
          </svg>
          <strong>{t('contact.responseValue')}</strong>
          <span>{t('contact.responseTimeTitle')}</span>
        </article>
        <article className="contact-stat-card">
          <svg className="contact-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 4 7v6c0 5 3.4 9.4 8 10.7 4.6-1.3 8-5.7 8-10.7V7l-8-4Z" fill="#904800" />
          </svg>
          <strong>{t('contact.supportValue')}</strong>
          <span>{t('contact.supportTitle')}</span>
        </article>
      </section>

      <div className="contact-layout">
        <article className="contact-info-card">
          <h3>{t('contact.infoTitle')}</h3>
          <div className="contact-channel-line">
            <div className="contact-channel-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.7 10.8a15 15 0 0 0 5.5 5.5l1.8-1.8c.2-.2.5-.3.8-.2 1 .3 2 .5 3.2.5.5 0 .9.4.9.9V20c0 .5-.4.9-.9.9C10.6 20.9 3.1 13.4 3.1 4.9c0-.5.4-.9.9-.9H8.3c.5 0 .9.4.9.9 0 1.1.2 2.2.5 3.2.1.3 0 .6-.2.8l-1.8 1.9Z" fill="#fc8200" />
              </svg>
            </div>
            <div>
              <span>{t('contact.phone')}</span>
              <strong>+996 (700) 123-456</strong>
            </div>
          </div>
          <div className="contact-channel-line">
            <div className="contact-channel-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16v12H4V6Zm2 2v.6l6 4 6-4V8l-6 4-6-4Z" fill="#fc8200" />
              </svg>
            </div>
            <div>
              <span>Email</span>
              <strong>hello@petmall.kg</strong>
            </div>
          </div>
          <div className="contact-channel-line">
            <div className="contact-channel-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" fill="#fc8200" />
              </svg>
            </div>
            <div>
              <span>{t('contact.address')}</span>
              <strong>г. Бишкек, пр. Чуй, 150</strong>
            </div>
          </div>
          <div className="contact-channel-line">
            <div className="contact-channel-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 5v5l4 2-1 2-5-3V7h2Z" fill="#fc8200" />
              </svg>
            </div>
            <div>
              <span>{t('contact.schedule')}</span>
              <strong>{t('contact.scheduleValue')}</strong>
            </div>
          </div>
          <div className="contact-socials">
            <button type="button" aria-label="Telegram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m21 4-3 16-5.5-4-2.8 2.6.5-4.8L17 8l-8.6 5.4L3 11.6 21 4Z" fill="currentColor" />
              </svg>
            </button>
            <button type="button" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm5 2.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm5-1.2a1.1 1.1 0 1 1-1.1 1.1A1.1 1.1 0 0 1 17 6.3Z" fill="currentColor" />
              </svg>
            </button>
            <button type="button" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 12a8 8 0 0 1-12.6 6.6L4 20l1.4-3.2A8 8 0 1 1 20 12Zm-4.7 2.7c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.4.1l-.5.7c-.1.1-.2.2-.4.1-1.2-.6-2-1.4-2.8-2.6-.1-.2 0-.3.1-.4l.5-.6c.1-.2.1-.3 0-.4l-.7-1.6c-.1-.2-.2-.2-.4-.2h-.3c-.2 0-.4.1-.6.3-.7.7-1 1.5-1 2.5 0 .2.1.5.2.8.6 1.7 2.2 3.5 3.9 4.5 1.5.8 2.6 1 3.5.9 1.2-.1 2.2-1 2.5-1.9.1-.5.1-.8 0-.9-.2-.1-.3-.1-.5-.2Z" fill="currentColor" />
              </svg>
            </button>
          </div>
          <div className="contact-note contact-note-design">
            <p>{t('contact.urgentNote')}</p>
          </div>
        </article>

        <form className="contact-form contact-form-design" onSubmit={handleSubmit}>
          <div className="contact-form-head">
            <svg className="contact-form-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 5h18v14H3V5Zm2 2v1l7 4.7L19 8V7l-7 4.7L5 7Z" fill="#fc8200" />
            </svg>
            <h3>{t('contact.formTitle')}</h3>
          </div>
          <input type="text" placeholder={t('contact.yourName')} value={formData.name} onChange={handleChange('name')} />
          <input type="email" placeholder={t('contact.yourEmail')} value={formData.email} onChange={handleChange('email')} />
          <input type="tel" placeholder={t('contact.optionalPhone')} value={formData.phone} onChange={handleChange('phone')} />
          <textarea rows="5" placeholder={t('contact.message')} value={formData.message} onChange={handleChange('message')} />
          {submitState.message ? (
            <div className={submitState.status === 'success' ? 'status-banner success' : 'status-banner error'}>
              <strong>{submitState.status === 'success' ? t('contact.successTitle') : t('contact.errorTitle')}</strong>
              <span>{submitState.message}</span>
            </div>
          ) : null}
          <div className="form-actions contact-form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitState.status === 'loading'}>
              {submitState.status === 'loading' ? t('contact.loading') : t('contact.send')}
            </button>
            <span>{t('contact.responseHint')}</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactPage
