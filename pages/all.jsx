import React from 'react'

const AllUrls = ({ urls }) => {
  console.log(urls)
  return (
    <div>
      <h1>AllUrls {urls.urls.length}</h1>
      <ul>
        {urls.urls &&
          urls.urls.map((url) => (
            <li key={url.id}>
              <a href={url.url}>
                {url.originalUrl} | {url.urlCode} | {url.analytics.clicks} | {url.analytics.lastClicked}
              </a>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default AllUrls

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/getAll')
  const urls = await res.json()

  return {
    props: { urls },
  }
}
