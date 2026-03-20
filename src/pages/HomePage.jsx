import mainPageHtml from '../../mainpage?raw'

function HomePage() {
  return (
    <section className="embedded-home-wrapper">
      <iframe className="embedded-home-frame" srcDoc={mainPageHtml} title="Shop Main Page" />
    </section>
  )
}

export default HomePage
