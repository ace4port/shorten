import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import Head from 'next/head'

import { Nav } from './index'
import { getUrlLink } from '../src/utils/getUrlLink'

import Url from '../server/schema/URLSchema'
import User from '../server/schema/User'
import dbConnect from '../server/lib/dbConntect'
import { useState } from 'react'

export async function getServerSideProps(context) {
  await dbConnect()
  const session = await unstable_getServerSession(context.req, context?.res, authOptions)

  if (!session) return { props: { urls: [] } }

  let urls
  if (session) {
    const user = await User.findOne({ user: session.email })
    urls = await Url.find({ user: user._id })
  } else {
    urls = await Url.find()
  }

  return {
    props: { urls: JSON.parse(JSON.stringify(urls)) },
  }
}

const deleteUrl = async (id) => {
  return fetch('/api/url/' + id, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
}

const All = ({ urls }) => {
  const [filteredUrls, setFilteredUrls] = useState(urls)

  const confirmDelete = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this URL?')
    if (confirm) {
      deleteUrl(id)
        .then(() => {
          setFilteredUrls(filteredUrls.filter((url) => url._id !== id))
        })
        .catch((e) => console.log(e))
      return true
    }
    return false
  }
  return (
    <div className='min-h-screen min-w-screen bg-black text-white px-10'>
      <Head>
        <title>Shorten URL</title>
        <meta name='description' content='Create minified versions of URL' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Nav />

      <div className='flex items-center justify-between'>
        <h1 className='text-4xl py-4'>AllUrls</h1>
        <span className='text-2xl text-gray-400'>{urls.length}</span>
      </div>

      <div>
        {!urls.length && <div className='text-2xl text-gray-400'>No Urls Found or You are not logged in.</div>}

        <table className='w-full'>
          <thead>
            <tr>
              <th></th>
              <th className='w-[450px]'>Original Url</th>
              <th>Shortned Link</th>
              <th>Clicks</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUrls.map((url, i) => (
              <tr key={url._id}>
                <td className='text-center'>{i + 1}</td>

                <td className='text-center'>
                  <a className='' href={url.originalUrl} target='_blank'>
                    <span className=' max-w-[350px] text-ellipsis clear-both inline-block overflow-hidden whitespace-nowrap'>
                      {url.originalUrl}
                    </span>
                  </a>
                </td>

                <td className='text-center'>
                  <a className='text-gray-400 mx-4' href={getUrlLink(url.urlCode)} target='_blank' rel='noreferrer'>
                    {url.urlCode}
                  </a>
                </td>

                <td className='text-center'>{url.analytics.clicks}</td>

                <td className='text-center'>{new Date(url.analytics.lastClicked).toLocaleDateString()}</td>

                <td className='text-center'>
                  <button className='bg-red-500 text-white px-2 py-1 rounded-md' onClick={() => confirmDelete(url._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default All
