import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context/useAdmin'
import { useLanguage } from '../context/useLanguage'
import LanguageSwitcher from '../components/ui/LanguageSwitcher'

function AdminLoginPage() {
  const { user, isAdmin, isLoading, authMessage, signIn, signOut, signUp } = useAdmin()
  const { t } = useLanguage()
  const [mode, setMode] = useState('signin')
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [submitState, setSubmitState] = useState({ type: '', message: '' })

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitState({ type: '', message: '' })

    try {
      if (mode === 'signin') {
        await signIn(formData)
        setSubmitState({ type: 'success', message: t('admin.login.signInSuccess') })
        return
      }

      const result = await signUp(formData)
      setSubmitState({
        type: 'success',
        message: result.requiresConfirmation ? t('admin.login.signUpConfirm') : t('admin.login.signUpSuccess'),
      })
    } catch (error) {
      setSubmitState({ type: 'error', message: error.message || t('admin.login.genericError') })
    }
  }

  if (isLoading) {
    return (
      <div className="admin-shell">
        <div className="admin-centered-card">
          <LanguageSwitcher className="admin-language-switcher" />
          <h1>{t('admin.login.loadingTitle')}</h1>
          <p>{t('admin.login.loadingText')}</p>
        </div>
      </div>
    )
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  if (user && !isAdmin) {
    return (
      <div className="admin-shell">
        <div className="admin-centered-card">
          <LanguageSwitcher className="admin-language-switcher" />
          <span className="admin-eyebrow">{t('admin.login.ownerAccess')}</span>
          <h1>{t('admin.login.deniedTitle')}</h1>
          <p>{authMessage || t('admin.login.deniedText')}</p>
          <div className="inline-actions">
            <button type="button" className="btn btn-primary" onClick={() => signOut()}>
              {t('admin.menu.signOut')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <div className="admin-centered-card admin-auth-card">
        <LanguageSwitcher className="admin-language-switcher" />
        <span className="admin-eyebrow">{t('admin.login.badge')}</span>
        <h1>{t('admin.login.title')}</h1>
        <p>{t('admin.login.text')}</p>

        <div className="admin-auth-switch">
          <button
            type="button"
            className={`admin-auth-tab ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => setMode('signin')}
          >
            {t('admin.login.signInTab')}
          </button>
          <button
            type="button"
            className={`admin-auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            {t('admin.login.signUpTab')}
          </button>
        </div>

        {(submitState.message || authMessage) && (
          <div className={`status-banner ${submitState.type === 'error' ? 'error' : 'success'}`}>
            <strong>{submitState.type === 'error' ? t('admin.login.actionNeeded') : t('admin.login.update')}</strong>
            <span>{submitState.message || authMessage}</span>
          </div>
        )}

        <form className="admin-auth-form" onSubmit={handleSubmit}>
          <label>
            {t('admin.login.email')}
            <input type="email" value={formData.email} onChange={handleChange('email')} required />
          </label>
          <label>
            {t('admin.login.password')}
            <input
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              minLength={6}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary">
            {mode === 'signin' ? t('admin.login.openDashboard') : t('admin.login.createOwner')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
