import { useCallback, useEffect, useState } from 'react'
import { messageStatuses } from '../lib/adminPanel'
import { useLanguage } from '../context/useLanguage'
import { fetchAdminMessages, updateAdminMessageStatus } from '../lib/storeApi'

function AdminMessagesPage() {
  const { formatDate, t } = useLanguage()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })

  const loadMessages = useCallback(async () => {
    setIsLoading(true)
    setStatusMessage({ type: '', text: '' })

    try {
      const nextMessages = await fetchAdminMessages()
      setMessages(nextMessages)
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.message || t('admin.messages.loadingText') })
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    void loadMessages()
  }, [loadMessages])

  const handleMessageStatusChange = async (messageId, status) => {
    try {
      await updateAdminMessageStatus(messageId, status)
      setMessages((prevMessages) =>
        prevMessages.map((message) => (message.id === messageId ? { ...message, status } : message)),
      )
      setStatusMessage({ type: 'success', text: t('admin.messages.updateSuccess', { id: messageId.slice(0, 8), status }) })
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.message || t('admin.messages.updateError') })
    }
  }
  const statusLabels = {
    new: t('common.statusNew'),
    reviewed: t('common.statusReviewed'),
    archived: t('common.statusArchived'),
  }

  return (
    <>
      <section className="admin-header-card">
        <div>
          <span className="admin-eyebrow">{t('admin.messages.badge')}</span>
          <h1>{t('admin.messages.title')}</h1>
          <p>{t('admin.messages.text')}</p>
        </div>
        <div className="inline-actions">
          <button type="button" className="btn btn-primary" onClick={() => loadMessages()}>
            {t('admin.messages.refresh')}
          </button>
        </div>
      </section>

      {statusMessage.text ? (
        <div className={`status-banner ${statusMessage.type === 'error' ? 'error' : 'success'}`}>
          <strong>{statusMessage.type === 'error' ? t('admin.overview.update') : t('admin.overview.loaded')}</strong>
          <span>{statusMessage.text}</span>
        </div>
      ) : null}

      {isLoading ? (
        <section className="admin-panel-card">
          <h2>{t('admin.messages.loadingTitle')}</h2>
          <p>{t('admin.messages.loadingText')}</p>
        </section>
      ) : (
        <section className="admin-stack-list">
          {messages.map((message) => (
            <article key={message.id} className="admin-panel-card admin-message-card">
              <div className="admin-section-head">
                <div>
                  <h2>{message.name}</h2>
                  <p>
                    {message.email}
                    {message.phone ? ` · ${message.phone}` : ''}
                  </p>
                </div>
                <select value={message.status} onChange={(event) => handleMessageStatusChange(message.id, event.target.value)}>
                  {messageStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status] ?? status}
                    </option>
                  ))}
                </select>
              </div>
              <p>{message.message}</p>
              <small>{formatDate(message.created_at)}</small>
            </article>
          ))}

          {!messages.length ? (
            <article className="admin-panel-card">
              <h2>{t('admin.messages.noMessagesTitle')}</h2>
              <p>{t('admin.messages.noMessagesText')}</p>
            </article>
          ) : null}
        </section>
      )}
    </>
  )
}

export default AdminMessagesPage
