import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import SectionTitle from '../components/ui/SectionTitle'
import { useShop } from '../context/useShop'
import { products } from '../data/products'
import productDescriptionHtml from '../../productdescription?raw'

const catalogueProducts = {
  'myagkaya-kostochka-solnechniy-blik': {
    metaTitle: 'Мягкая косточка "Солнечный блик"',
    breadcrumbTitle: 'Мягкая косточка "Солнечный блик"',
    pageTitle: 'Мягкая косточка "Солнечный блик"',
    price: '890 ₽',
    imageAlt: 'Soft orange plush dog toy shaped like a bone',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQy1SkmP-ABOUm5z2Kf-qR6m9KvAaySPWVTok_KpgW5ftxoQUoIftBEMHxU-9WoqCh-Ifner2hWq7kB7uoIrjE1MJUuPSTa_5gRW6teQQ5WURDKwWwsteCAdBToMzRB3BQRSiSrLiK0XLJKnOvdeRu0__AQnabx81I1SrH7FBcJHriuy6NKQTPblmeenXvtPwM6uQz54XC0TIyHASzUSTdx3-i3MkGnOOZi8ug9QLp589LQw4uyITbTurIQFpcKVioaGcApNlQ2KJ2',
  },
  'mnogourovnevyy-zamok-murlyka': {
    metaTitle: 'Многоуровневый замок "Мурлыка"',
    breadcrumbTitle: 'Многоуровневый замок "Мурлыка"',
    pageTitle: 'Многоуровневый замок "Мурлыка"',
    price: '9 900 ₽',
    imageAlt: 'Premium wooden cat climbing tree with plush levels',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQB4DTi47cqtzFp9_DPToeY_P94tVK7yuLiwXjGKlTYX72SrFqS8Po53APqbj8TG-9zqkQY_6l5cwrgtUpBSmPi0mWUWssOlTLvXVWQ3Je0CDgPq8PnaVnrK0OODC48pA-1L0DElU24kfz8QnirBaTJFKpL9BUIzenrdqa8Q7Jq-OglIbQE9aCPaCHAQfdF8rEtOoDcoWXvJyCoP8SPgOFg4mIQn1zpUFWiZkZEhvTDrVOluBvK45ZzJBanamgOvjVqnTOl0k8ojVb',
  },
  'organicheskie-lakomstva-bio-gav': {
    metaTitle: 'Органические лакомства "Био-Гав"',
    breadcrumbTitle: 'Органические лакомства "Био-Гав"',
    pageTitle: 'Органические лакомства "Био-Гав"',
    price: '540 ₽',
    imageAlt: 'Bag of organic gourmet treats for dogs',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfpgxRqM98u3JejMxfDdgFHSFwcqbdp1mTkmLJzO-BWDaD3szjLlDHLQnu9HOUGYON-Dn97DZYHnFs28uJPS7Vxflt5DNLlMwPjR79dxh6SyNvMh4Anj6UX6xbrybldN7_Od495VPx9HBMnLmICnsCODsu_YhQuFkKgOIOUCY98F_Lg7a7qtrGyzDUXrDXB5igu5jkTHbjLC6bQ3tv86lQmxlV3TVu6qI0EwXIz1ZGixGMaqk0yzP-6923nBdydG6sPNZjhW7dcxdn',
  },
  'umnyy-myach-interaktiv': {
    metaTitle: 'Умный мяч "Интерактив"',
    breadcrumbTitle: 'Умный мяч "Интерактив"',
    pageTitle: 'Умный мяч "Интерактив"',
    price: '1 250 ₽',
    imageAlt: 'Teal colored interactive smart ball toy for pets',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCno8idiBhv6ZQ48WswraJmkiK8H4KXLNhlnYoJKuhJeTAQteXT2HAku_G9p9E4cgJMeUskLdnmdxPRahyJeEcea8SAeKLRaIn7_7R7XNXQw3Kuif7BnFcb8Npbh-HttNkztXsUZwXPKPSyLA3KdLVckAab8bSlST3gQige3F1IZyMvlLytwgJqoEttJEMY2JJSQmqqd5PZaEGa3mqSQH2l_GEDKKjm_KoomS8SbAYOB95Rcu8pssJvQYBT6ziLX1P1JNFX_Rd_vVUE',
  },
  'oblachnaya-lezhanka-nezhnost': {
    metaTitle: 'Облачная лежанка "Нежность"',
    breadcrumbTitle: 'Облачная лежанка "Нежность"',
    pageTitle: 'Облачная лежанка "Нежность"',
    price: '3 100 ₽',
    imageAlt: 'Soft fleece grey round bed for a cat or small dog',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhMbRshT-aPaX7C8zpAWRQaPbJMydhMXqgIjFEfthK2sH1IjI2pUlW-f-GZmZbCs9Hjy3DVfs4gbJT09MQ1QwPo6gpGM1A0myNAfwfYVVVvU-bnUAUX3BjV1-Mj-k4R92OcTUjkuwTkr4qoLfXudF83o-4srRxQC7w7Gra2kwiGAmVL89YccPYeUWuCDiDlJI3-dMsUUkKf9RItAvxZJmW-rygF1HJjZNQh11GNapyU2bdnSXyCNQ9wSDKoR4tyST-noBscYXPbnNH',
  },
  'pitevoy-fontanchik-rodnik': {
    metaTitle: 'Питьевой фонтанчик "Родник"',
    breadcrumbTitle: 'Питьевой фонтанчик "Родник"',
    pageTitle: 'Питьевой фонтанчик "Родник"',
    price: '2 450 ₽',
    imageAlt: 'Automatic pet water fountain with flowing water',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBON5_YVw8h7vCMCmaGVron0xrOdJEMs8C8p7SjDU6HXq4zbo-jksePtESgviuKx8maSAJ1CHuu39SVx3KW5mDGBadbZ3m9HPRBaVNfIrXatSq-8Y8mybQqNQgXx0AmGCBD1SWqji8VkMcEl29AxpRwWA_CTW2fbWNGdcpOByVGFrEgWdKgDXLG-98WrX8F2lqa08DGJlP5wxtNHI51VaRMoxp5wMKJhx6_vtXvKNDsdUI7ysdU9u7e_gyGInP6zzk8FoQWLXKzsPPj',
  },
}

function getCatalogueProductHtml(catalogueProduct) {
  return productDescriptionHtml
    .replace('Лакомства для щенков Гурман - PawPalace', `${catalogueProduct.metaTitle} - PawPalace`)
    .replace('Лакомства "Гурман"', catalogueProduct.breadcrumbTitle)
    .replace('Лакомства для щенков "Гурман" (12 шт)', catalogueProduct.pageTitle)
    .replace('$24.99', catalogueProduct.price)
    .replace('Изысканные лакомства для щенков в премиальной миске', catalogueProduct.imageAlt)
    .replace(
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKQD_jyNOlOF5kn-Qn8Z4WRvqH9Znn4ZSZcQKcM3SrS01jxRyD3sjBf1ulRttKcB17HzweTsDzNKIzcNOq9kzZfTG3H-Ncy8OawrHDmU3Us0MgCg_pcI4XwbwjnDK-2cUE-24pn_2zC6qlI2zwTtpXJf2lmndNNm8Ft-_QpuUUjp5ZpEYx84xdozgk1iZ4U-EFEGkEEpVlp13umV_Hj-8RUzVuo1l1tMG_kiW2reBO4Z2h42vl0j6SzVe1P3Qn-zOOQXkUlxUkFD0U',
      catalogueProduct.imageUrl
    )
    .replace(
      '<a class="font-headline text-base font-bold tracking-tight text-primary border-b-2 border-primary pb-1" href="#">Каталог</a>',
      '<a class="font-headline text-base font-bold tracking-tight text-primary border-b-2 border-primary pb-1" href="/catalogue" target="_top">Каталог</a>'
    )
    .replace(
      '<a class="hover:text-primary transition-colors" href="#">Главная</a>',
      '<a class="hover:text-primary transition-colors" href="/" target="_top">Главная</a>'
    )
    .replace(
      '<a class="hover:text-primary transition-colors" href="#">Каталог</a>',
      '<a class="hover:text-primary transition-colors" href="/catalogue" target="_top">Каталог</a>'
    )
    .replace(
      '<a class="text-primary font-black text-lg flex items-center gap-3 hover:translate-x-2 transition-transform bg-primary/10 px-8 py-4 rounded-full" href="#">',
      '<a class="text-primary font-black text-lg flex items-center gap-3 hover:translate-x-2 transition-transform bg-primary/10 px-8 py-4 rounded-full" href="/catalogue" target="_top">'
    )
}

function ProductPage() {
  const { productId } = useParams()
  const catalogueProduct = catalogueProducts[productId]
  const { addToCart } = useShop()
  const [quantity, setQuantity] = useState(1)

  const product = products.find((item) => item.id === Number(productId))

  const similarProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter((item) => item.id !== product.id && item.animalType === product.animalType)
      .slice(0, 3)
  }, [product])

  if (catalogueProduct) {
    return (
      <section className="embedded-home-wrapper">
        <iframe
          className="embedded-home-frame"
          srcDoc={getCatalogueProductHtml(catalogueProduct)}
          title={catalogueProduct.pageTitle}
        />
      </section>
    )
  }

  if (!product) {
    return (
      <div className="page-content">
        <p className="empty-block">Товар не найден.</p>
        <Link to="/catalogue" className="btn btn-primary">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="page-content">
      <section className="product-details">
        <div className="product-details-visual">{product.image}</div>

        <div className="product-details-info">
          <p className="product-details-meta">
            {product.animalType} · {product.category}
          </p>
          <h1>{product.name}</h1>
          <p className="product-details-rating">Рейтинг: {product.rating}</p>
          <p className="product-details-price">{product.price} ₽</p>
          <p className="product-details-description">{product.description}</p>

          <div className="quantity-control">
            <span>Количество:</span>
            <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
            <strong>{quantity}</strong>
            <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
          </div>

          <button className="btn btn-primary" onClick={() => addToCart(product, quantity)}>
            Добавить в корзину
          </button>
        </div>
      </section>

      <section>
        <SectionTitle title="Характеристики" />
        <ul className="specs-list">
          {product.specs.map((spec) => (
            <li key={spec}>{spec}</li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle title="Похожие товары" />
        <div className="products-grid">
          {similarProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductPage
