import { useCallback, useEffect, useRef, useState } from 'react'
import { adminAnimalTypes, createDefaultProductForm, fileToOptimizedImageDataUrl } from '../lib/adminPanel'
import { useLanguage } from '../context/useLanguage'
import { fetchAdminProducts, saveAdminProduct } from '../lib/storeApi'

function AdminProductsPage() {
  const { formatPrice, localizeProduct, t, translateAnimalType } = useLanguage()
  const [products, setProducts] = useState([])
  const [productForm, setProductForm] = useState(createDefaultProductForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })
  const fileInputRef = useRef(null)

  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    setStatusMessage({ type: '', text: '' })

    try {
      const nextProducts = await fetchAdminProducts()
      setProducts(nextProducts)
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.message || t('admin.products.loading') })
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  const handleProductChange = (field) => (event) => {
    const nextValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setProductForm((prev) => ({ ...prev, [field]: nextValue }))
  }

  const handleEditProduct = (product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      animalType: product.animalType,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice ?? '',
      rating: product.rating,
      image: product.image,
      description: product.description,
      specs: product.specs.join('\n'),
      isPopular: product.isPopular,
      isPromo: product.isPromo,
      isActive: product.isActive !== false,
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetProductForm = () => {
    setProductForm(createDefaultProductForm())
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageFileChange = async (event) => {
    const [file] = Array.from(event.target.files || [])

    if (!file) {
      return
    }

    setIsUploadingImage(true)
    setStatusMessage({ type: '', text: '' })

    try {
      const imageDataUrl = await fileToOptimizedImageDataUrl(file)
      setProductForm((prev) => ({ ...prev, image: imageDataUrl }))
      setStatusMessage({ type: 'success', text: t('admin.products.addedPicture', { name: file.name }) })
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.message || t('admin.products.imageError') })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setProductForm((prev) => ({ ...prev, image: '' }))

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSaveProduct = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setStatusMessage({ type: '', text: '' })

    if (!productForm.image) {
      setStatusMessage({ type: 'error', text: t('admin.products.pictureRequired') })
      setIsSaving(false)
      return
    }

    try {
      const savedProduct = await saveAdminProduct(productForm)
      setProducts((prevProducts) => {
        const exists = prevProducts.some((product) => product.id === savedProduct.id)
        return exists
          ? prevProducts.map((product) => (product.id === savedProduct.id ? savedProduct : product))
          : [savedProduct, ...prevProducts]
      })
      setStatusMessage({ type: 'success', text: t('admin.products.saveSuccess', { name: savedProduct.name }) })
      resetProductForm()
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.message || t('admin.products.saveError') })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <section className="admin-header-card">
        <div>
          <span className="admin-eyebrow">{t('admin.products.badge')}</span>
          <h1>{t('admin.products.title')}</h1>
          <p>{t('admin.products.text')}</p>
        </div>
        <div className="inline-actions">
          <button type="button" className="btn btn-secondary" onClick={resetProductForm}>
            {t('admin.products.newProduct')}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => loadProducts()}>
            {t('admin.products.refreshList')}
          </button>
        </div>
      </section>

      {statusMessage.text ? (
        <div className={`status-banner ${statusMessage.type === 'error' ? 'error' : 'success'}`}>
          <strong>{statusMessage.type === 'error' ? t('admin.overview.update') : t('admin.overview.loaded')}</strong>
          <span>{statusMessage.text}</span>
        </div>
      ) : null}

      <section className="admin-products-layout">
        <form className="admin-panel-card admin-product-form" onSubmit={handleSaveProduct}>
          <div className="admin-section-head">
            <h2>{productForm.id ? t('admin.products.editProduct') : t('admin.products.createProduct')}</h2>
            <span>{productForm.id ? `ID ${productForm.id}` : t('admin.products.newEntry')}</span>
          </div>

          <div className="form-grid">
            <label>
              {t('admin.products.productName')}
              <input type="text" value={productForm.name} onChange={handleProductChange('name')} required />
            </label>
            <label>
              {t('admin.products.animalType')}
              <select value={productForm.animalType} onChange={handleProductChange('animalType')}>
                {adminAnimalTypes.map((animalType) => (
                  <option key={animalType} value={animalType}>
                    {translateAnimalType(animalType)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('admin.products.category')}
              <input type="text" value={productForm.category} onChange={handleProductChange('category')} required />
            </label>
            <label>
              {t('admin.products.price')}
              <input type="number" min="0" value={productForm.price} onChange={handleProductChange('price')} required />
            </label>
            <label>
              {t('admin.products.oldPrice')}
              <input type="number" min="0" value={productForm.oldPrice} onChange={handleProductChange('oldPrice')} />
            </label>
            <label>
              {t('admin.products.rating')}
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={productForm.rating}
                onChange={handleProductChange('rating')}
                required
              />
            </label>
          </div>

          <label>
            {t('admin.products.description')}
            <textarea rows="4" value={productForm.description} onChange={handleProductChange('description')} />
          </label>

          <label>
            {t('admin.products.specs')}
            <textarea rows="6" value={productForm.specs} onChange={handleProductChange('specs')} />
          </label>

          <div className="admin-image-field">
            <div className="admin-section-head">
              <div>
                <h2>{t('admin.products.pictureTitle')}</h2>
                <p>{t('admin.products.pictureText')}</p>
              </div>
              {productForm.image ? (
                <button type="button" className="btn btn-secondary" onClick={handleRemoveImage}>
                  {t('admin.products.removePicture')}
                </button>
              ) : null}
            </div>

            <label className="admin-upload-field">
              <span>{t('admin.products.uploadLabel')}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleImageFileChange}
              />
            </label>

            <p className="admin-helper-text">
              {isUploadingImage ? t('admin.products.preparingImage') : t('admin.products.imageHelp')}
            </p>

            {productForm.image ? (
              <div className="admin-image-preview-card">
                <img src={productForm.image} alt={productForm.name || t('admin.products.pictureTitle')} className="admin-image-preview" />
              </div>
            ) : (
              <div className="admin-image-preview-card admin-image-preview-empty">
                <span>{t('admin.products.noPicture')}</span>
              </div>
            )}
          </div>

          <div className="admin-checkbox-row">
            <label>
              <input type="checkbox" checked={productForm.isPopular} onChange={handleProductChange('isPopular')} />
              {t('admin.products.popular')}
            </label>
            <label>
              <input type="checkbox" checked={productForm.isPromo} onChange={handleProductChange('isPromo')} />
              {t('admin.products.promo')}
            </label>
            <label>
              <input type="checkbox" checked={productForm.isActive} onChange={handleProductChange('isActive')} />
              {t('admin.products.active')}
            </label>
          </div>

          <div className="admin-page-actions">
            <button type="submit" className="btn btn-primary" disabled={isSaving || isUploadingImage}>
              {isUploadingImage
                ? t('admin.products.preparingImage')
                : isSaving
                  ? t('admin.products.saving')
                  : productForm.id
                    ? t('admin.products.saveChanges')
                    : t('admin.products.create')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetProductForm}>
              {t('admin.products.clearForm')}
            </button>
          </div>
        </form>

        <div className="admin-panel-card">
          <div className="admin-section-head">
            <h2>{t('admin.products.inventory')}</h2>
            <span>{t('admin.products.totalProducts', { count: products.length })}</span>
          </div>

          {isLoading ? (
            <p>{t('admin.products.loading')}</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.products.image')}</th>
                    <th>{t('admin.products.name')}</th>
                    <th>{t('admin.products.type')}</th>
                    <th>{t('admin.products.price')}</th>
                    <th>{t('admin.products.status')}</th>
                    <th>{t('admin.products.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const viewProduct = localizeProduct(product)

                    return (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-thumb">
                          {product.image ? <img src={product.image} alt={viewProduct.name} /> : <span>{t('admin.products.noImage')}</span>}
                        </div>
                      </td>
                      <td>
                        <div className="admin-product-cell">
                          <strong>{viewProduct.name}</strong>
                          <span>{viewProduct.category}</span>
                        </div>
                      </td>
                      <td>{viewProduct.animalType}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td>
                        <span className={`admin-status-chip ${product.isPopular ? 'processing' : 'completed'}`}>
                          {product.isActive === false ? t('common.statusInactive') : product.isPromo ? t('common.statusPromo') : t('common.statusLive')}
                        </span>
                      </td>
                      <td>
                        <button type="button" className="btn btn-secondary" onClick={() => handleEditProduct(product)}>
                          {t('admin.products.edit')}
                        </button>
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default AdminProductsPage
