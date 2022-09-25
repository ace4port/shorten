import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

async function createShortUrl(body) {
  return fetch('/api/url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then((res) => res.json())
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = e.target.url.value
    const data = { url, customUrl: e.target.customUrl.value }
    setLoading(true)
    setError('')

    createShortUrl(data)
      .then((data) => {
        console.log(data)
        if (data.urlCode) {
          const shortURL = `${process.env.BASE_URL ?? 'http://localhost:3000'}/${data.urlCode}`
          setResult(shortURL)
          setLoading(false)
        } else {
          setResult('')
          setError(data.error)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log(err)
        setError(err.message)
        setLoading(false)
      })
  }

  return (
    <div className='min-h-screen min-w-screen bg-black bg-opacity-90 text-white flex flex-col px-10'>
      <Head>
        <title>Shorten URL</title>
        <meta name='description' content='Create minified versions of URL' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Nav />
      <main className='flex flex-col items-center'>
        <h1 className='text-4xl mt-40 mb-5'>
          Welcome to <b href='/'>Shorten!</b>
        </h1>
        <p className='text-2xl mb-20'>
          Get started by entering <code className='font-mono'>url</code>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            name='url'
            placeholder='Enter long URL'
            className='p-2 rounded w-96 mx-2 bg-slate-600'
            required
          />
          <input type='text' name='customUrl' placeholder='Custom URL' className='p-2 rounded mx-2 bg-slate-600' />
          <button
            className='bg-gray-600 p-2 rounded uppercase text-sm font-semibold text-blue-200 tracking-widest'
            type='submit'>
            Shorten
          </button>
        </form>

        {!loading && result && (
          <div className='mt-10'>
            <p className='text-sm'>
              Your shortened URL is: &nbsp;
              <a href={result} target='_blank' className='text-md text-blue-400'>
                {result}
              </a>
            </p>
          </div>
        )}

        {loading && (
          <div className='flex items-center justify-center my-2'>
            <div className='loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6'></div>
          </div>
        )}

        {error && <p className='text-red-500'>{error}</p>}
      </main>
    </div>
  )
}

export const Nav = () => {
  const { data: session, status } = useSession()

  return (
    <nav className='flex items-center justify-between py-2 border-b border-gray-700'>
      <h4 className='text-2xl '>Shorten</h4>

      <div className='self-end'>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'unauthenticated' && <button onClick={() => signIn()}>Sign in</button>}
        {status === 'authenticated' && (
          <div className='flex gap-2 items-center'>
            <Link href={'/all'}> All Links</Link>
            <Image className='rounded-full' src={session.user.image} width={20} height={20} alt='user image' />
            <p>{session.user.name} </p>
            <button className='bg-gray-600 py-1 px-2 rounded' onClick={() => signOut()}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
