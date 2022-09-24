import Head from 'next/head'
import styles from '../styles/Home.module.css'

const submit = (e) => {
  e.preventDefault()
  const url = e.target.url.value
  const data = { url }
  fetch('/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      const result = document.getElementById('result')
      // result.innerHTML = `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`
      result.innerHTML = `<p>${data.shortUrl}</p>`
    })
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Shorten URL</title>
        <meta name='description' content='Create minified versions of URL' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href='/'>Shorten!</a>
        </h1>

        <p className={styles.description}>
          Get started by entering <code className={styles.code}>url</code>
        </p>

        <form onSubmit={submit}>
          <input type='text' name='url' placeholder='Enter URL' />
          <button>Shorten</button>
        </form>

        <div id='result'></div>
      </main>
    </div>
  )
}
