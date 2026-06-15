export const adminAnimalTypes = ['Собаки', 'Кошки', 'Птицы', 'Грызуны', 'Рыбы', 'Питомцы']

export const orderStatuses = ['new', 'processing', 'completed', 'cancelled']

export const messageStatuses = ['new', 'reviewed', 'archived']

export function createDefaultProductForm() {
  return {
    id: '',
    name: '',
    animalType: 'Собаки',
    category: 'Корм',
    price: '',
    oldPrice: '',
    rating: '4.8',
    image: '',
    description: '',
    specs: '',
    isPopular: false,
    isPromo: false,
    isActive: true,
  }
}

export function formatAdminPrice(value) {
  return `${new Intl.NumberFormat('ky-KG').format(Number(value) || 0)} сом`
}

export function formatAdminDate(value) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export async function fileToOptimizedImageDataUrl(file, options = {}) {
  const { maxWidth = 1400, maxHeight = 1400, quality = 0.86, type = 'image/jpeg' } = options

  if (!(file instanceof File)) {
    throw new Error('Please choose a valid image file.')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are supported.')
  }

  const sourceDataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(sourceDataUrl)

  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1)
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Your browser could not prepare the image for upload.')
  }

  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL(type, quality)
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Unable to read the selected image file.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Unable to process the selected image file.'))
    image.src = source
  })
}
