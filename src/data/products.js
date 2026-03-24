import productsSampleText from './products sample?raw'

function normalizeText(value) {
  return value.replace(/\r/g, '')
}

function parsePrice(value) {
  return Number(value.replace(/[^\d]/g, ''))
}

function inferAnimalType(name, section) {
  const source = `${name} ${section}`.toLowerCase()

  if (source.includes('кош')) return 'Кошки'
  if (source.includes('собак') || source.includes('щен')) return 'Собаки'
  if (source.includes('птиц') || source.includes('попуга')) return 'Птицы'
  if (source.includes('рыб') || source.includes('аквариум')) return 'Рыбы'
  if (source.includes('грызун') || source.includes('хомяк') || source.includes('кролик')) {
    return 'Грызуны'
  }
  return 'Питомцы'
}

function inferCategory(name, section, specs) {
  const source = `${name} ${section} ${specs.join(' ')}`.toLowerCase()

  if (source.includes('корм')) return 'Корм'
  if (
    source.includes('лакомств') ||
    source.includes('печенье') ||
    source.includes('пауч') ||
    source.includes('консервы') ||
    source.includes('палочки')
  ) {
    return 'Лакомства'
  }
  if (
    source.includes('игруш') ||
    source.includes('мяч') ||
    source.includes('диск') ||
    source.includes('дразнил') ||
    source.includes('мышк') ||
    source.includes('лазер')
  ) {
    return 'Игрушки'
  }
  if (
    source.includes('ошейник') ||
    source.includes('поводок') ||
    source.includes('шлейка') ||
    source.includes('перенос') ||
    source.includes('адресник') ||
    source.includes('миска') ||
    source.includes('поилка') ||
    source.includes('кормушка')
  ) {
    return 'Аксессуары'
  }
  if (
    source.includes('шампун') ||
    source.includes('пуход') ||
    source.includes('гребень') ||
    source.includes('когтерез') ||
    source.includes('лосьон') ||
    source.includes('щёт') ||
    source.includes('пелен') ||
    source.includes('лоток') ||
    source.includes('наполнитель')
  ) {
    return 'Уход'
  }
  if (
    source.includes('лежанка') ||
    source.includes('домик') ||
    source.includes('клетка') ||
    source.includes('когтеточка') ||
    source.includes('комплекс') ||
    source.includes('туалет')
  ) {
    return 'Домики'
  }
  if (
    source.includes('аквариум') ||
    source.includes('грунт') ||
    source.includes('сачок') ||
    source.includes('декор')
  ) {
    return 'Аквариум'
  }
  return section || 'Товары'
}

function getAnimalImageTag(animalType) {
  if (animalType === 'Кошки') return 'cat'
  if (animalType === 'Собаки') return 'dog'
  if (animalType === 'Птицы') return 'bird'
  if (animalType === 'Рыбы') return 'fish'
  if (animalType === 'Грызуны') return 'hamster'
  return 'pet'
}

function getCategoryImageTag(category) {
  if (category === 'Корм') return 'petfood'
  if (category === 'Лакомства') return 'snack'
  if (category === 'Игрушки') return 'toy'
  if (category === 'Аксессуары') return 'accessory'
  if (category === 'Уход') return 'grooming'
  if (category === 'Домики') return 'pet-bed'
  if (category === 'Аквариум') return 'aquarium'
  return 'supplies'
}

function inferImage(animalType, category, id) {
  const animalTag = getAnimalImageTag(animalType)
  const categoryTag = getCategoryImageTag(category)
  return `https://loremflickr.com/640/640/${animalTag},${categoryTag},pet?lock=${id}`
}

function isSectionHeading(line) {
  if (!line) return false
  if (/^\d+\.\s+/.test(line)) return false
  if (line.startsWith('Цена:')) return false
  if (line.startsWith('Описание:')) return false
  if (line === 'Характеристики:') return false
  if (/^[^:]+:\s.+$/.test(line) && !line.startsWith('Товары для ')) return false
  return true
}

function parseProductsFromSample(rawText) {
  const lines = normalizeText(rawText).split('\n')
  const parsedProducts = []
  let section = 'Товары'
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()

    if (!line) {
      index += 1
      continue
    }

    if (isSectionHeading(line)) {
      section = line
      index += 1
      continue
    }

    const productHeaderMatch = line.match(/^(\d+)\.\s+(.+)$/)

    if (!productHeaderMatch) {
      index += 1
      continue
    }

    const id = Number(productHeaderMatch[1])
    const name = productHeaderMatch[2]
    let price = 0
    let description = ''
    const specs = []

    index += 1

    while (index < lines.length) {
      const detailLine = lines[index].trim()

      if (!detailLine) {
        index += 1
        continue
      }

      if (/^\d+\.\s+/.test(detailLine)) break

      if (isSectionHeading(detailLine)) {
        section = detailLine
        index += 1
        continue
      }

      if (detailLine.startsWith('Цена:')) {
        price = parsePrice(detailLine)
        index += 1
        continue
      }

      if (detailLine.startsWith('Описание:')) {
        description = detailLine.replace('Описание:', '').trim()
        index += 1
        continue
      }

      if (detailLine !== 'Характеристики:') {
        specs.push(detailLine)
      }

      index += 1
    }

    const animalType = inferAnimalType(name, section)
    const category = inferCategory(name, section, specs)
    const rating = Number((4.2 + ((id % 8) * 0.1)).toFixed(1))
    const isPromo = id % 5 === 0
    const oldPrice = isPromo ? Math.round(price * 1.15) : null
    const isPopular = id <= 20 || id % 7 === 0

    parsedProducts.push({
      id,
      name,
      animalType,
      category,
      price,
      oldPrice,
      rating,
      image: inferImage(animalType, category, id),
      isPopular,
      isPromo,
      description,
      specs
    })
  }

  return parsedProducts
}

export const products = parseProductsFromSample(productsSampleText)

export const shopAdvantages = [
  'Быстрая доставка по городу за 1 день',
  'Проверенные бренды и качественные товары',
  'Понятный возврат и обмен без сложностей',
  'Поддержка клиентов 7 дней в неделю'
]

export const reviews = [
  { id: 1, author: 'Анна', text: 'Очень удобный каталог и быстрая доставка. Заказываю корм постоянно.' },
  { id: 2, author: 'Игорь', text: 'Классные цены и хорошие акции. Корзина и оформление заказа сделаны понятно.' },
  { id: 3, author: 'Мария', text: 'Нашла всё для котенка в одном месте. Интерфейс простой и приятный.' }
]

export const faqItems = [
  {
    id: 1,
    question: 'Можно ли вернуть товар?',
    answer: 'Да, в течение 14 дней при сохранении товарного вида и упаковки.'
  },
  {
    id: 2,
    question: 'Сколько стоит доставка?',
    answer: 'Доставка от 250 сом, при заказе от 3000 сом — бесплатно.'
  },
  {
    id: 3,
    question: 'Есть ли самовывоз?',
    answer: 'Да, самовывоз доступен из пункта выдачи ежедневно с 10:00 до 20:00.'
  }
]
