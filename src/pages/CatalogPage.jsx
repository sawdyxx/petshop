import catalogueHtml from '../../catalogue?raw'

function CatalogPage() {
  return (
    <section className="embedded-home-wrapper">
      <iframe className="embedded-home-frame" srcDoc={catalogueHtml} title="Shop Catalogue Page" />
    </section>
  )
}

export default CatalogPage
