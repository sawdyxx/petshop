export const products = [
  {
    id: 1,
    name: 'Сухой корм для кошек Premium',
    animalType: 'Кошки',
    category: 'Корм',
    price: 1450,
    oldPrice: 1690,
    rating: 4.8,
    image: '🐱',
    isPopular: true,
    isPromo: true,
    description: 'Сбалансированный корм для здорового пищеварения и блестящей шерсти.',
    specs: ['Вес: 2 кг', 'Возраст: от 1 года', 'Без искусственных красителей']
  },
  {
    id: 2,
    name: 'Влажный корм для котят',
    animalType: 'Кошки',
    category: 'Корм',
    price: 320,
    oldPrice: null,
    rating: 4.7,
    image: '🐈',
    isPopular: true,
    isPromo: false,
    description: 'Нежный паштет с высоким содержанием мяса для роста и развития котят.',
    specs: ['Вес: 85 г', 'Возраст: до 12 месяцев', 'С витаминами A и D']
  },
  {
    id: 3,
    name: 'Лакомства для дрессировки собак',
    animalType: 'Собаки',
    category: 'Лакомства',
    price: 540,
    oldPrice: 650,
    rating: 4.9,
    image: '🐶',
    isPopular: true,
    isPromo: true,
    description: 'Небольшие кусочки для поощрения, идеально подходят для тренировок.',
    specs: ['Вес: 300 г', 'Подходит для всех пород', 'Удобная zip-упаковка']
  },
  {
    id: 4,
    name: 'Поводок прогулочный Comfort',
    animalType: 'Собаки',
    category: 'Аксессуары',
    price: 990,
    oldPrice: null,
    rating: 4.6,
    image: '🦮',
    isPopular: false,
    isPromo: false,
    description: 'Мягкая ручка и надежный карабин для комфортных прогулок каждый день.',
    specs: ['Длина: 2 м', 'Материал: нейлон', 'Цвет: графит']
  },
  {
    id: 5,
    name: 'Игрушка-мяч интерактивный',
    animalType: 'Собаки',
    category: 'Игрушки',
    price: 780,
    oldPrice: 920,
    rating: 4.8,
    image: '⚽',
    isPopular: true,
    isPromo: true,
    description: 'Прочная игрушка для активных игр дома и на улице.',
    specs: ['Диаметр: 7 см', 'Материал: безопасная резина', 'Для средних и крупных собак']
  },
  {
    id: 6,
    name: 'Клетка-домик для хомяка',
    animalType: 'Грызуны',
    category: 'Домики',
    price: 2100,
    oldPrice: null,
    rating: 4.5,
    image: '🐹',
    isPopular: false,
    isPromo: false,
    description: 'Уютный домик с туннелями и зоной для отдыха.',
    specs: ['Размер: 45 × 30 см', 'Материал: дерево', 'Легко чистить']
  },
  {
    id: 7,
    name: 'Минеральный камень для птиц',
    animalType: 'Птицы',
    category: 'Уход',
    price: 260,
    oldPrice: null,
    rating: 4.4,
    image: '🦜',
    isPopular: false,
    isPromo: false,
    description: 'Источник кальция для здоровья клюва и костей.',
    specs: ['Вес: 70 г', 'Подходит для попугаев', 'Крепление в комплекте']
  },
  {
    id: 8,
    name: 'Шампунь для питомцев Sensitive',
    animalType: 'Кошки',
    category: 'Уход',
    price: 690,
    oldPrice: 790,
    rating: 4.7,
    image: '🧴',
    isPopular: true,
    isPromo: true,
    description: 'Мягкий шампунь для чувствительной кожи без резких отдушек.',
    specs: ['Объем: 300 мл', 'Без сульфатов', 'Подходит кошкам и собакам']
  },
  {
    id: 9,
    name: 'Лежанка ортопедическая',
    animalType: 'Собаки',
    category: 'Домики',
    price: 3200,
    oldPrice: 3690,
    rating: 4.9,
    image: '🛏️',
    isPopular: true,
    isPromo: false,
    description: 'Комфортная лежанка с поддержкой суставов для взрослых питомцев.',
    specs: ['Размер: M', 'Съемный чехол', 'Противоскользящее дно']
  }
]

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
    answer: 'Доставка от 250 ₽, при заказе от 3000 ₽ — бесплатно.'
  },
  {
    id: 3,
    question: 'Есть ли самовывоз?',
    answer: 'Да, самовывоз доступен из пункта выдачи ежедневно с 10:00 до 20:00.'
  }
]
