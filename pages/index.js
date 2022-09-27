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
          console.log(data)
          setError(data.error || data.message)
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

        <form onSubmit={handleSubmit} className='flex flex-col'>
          <input
            type='text'
            name='url'
            placeholder='Enter long URL'
            className='p-2 rounded w-full bg-slate-600 block'
            required
          />

          <div className='my-2 w-full flex  gap-4 justify-between'>
            <input type='text' name='customUrl' placeholder='Custom URL' className='p-2 rounded bg-slate-600' />

            <button
              className='bg-slate-700 px-4 rounded uppercase font-semibold text-blue-200 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer'
              type='submit'
              disabled={loading}>
              {loading && <SpinningLoader />}
              Shorten
            </button>
          </div>
        </form>

        {!loading && result && (
          <div className='mt-10'>
            <p className='text-sm'>
              Your shortened URL is: &nbsp;
              <a href={result} target='_blank' rel='noreferrer' className='text-md text-blue-400'>
                {result}
              </a>
            </p>
          </div>
        )}

        {error && <p className='text-red-500'>{error}</p>}
      </main>
    </div>
  )
}

const SpinningLoader = () => {
  return (
    <svg
      className='animate-spin h-4 w-4 text-blue-400'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'>
      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
    </svg>
  )
}

export const Nav = () => {
  const { data: session, status } = useSession()

  return (
    <nav className='flex items-center justify-between py-2 border-b border-gray-700'>
      <Link href='/'>
        <span className='text-2xl cursor-pointer'>Shorten</span>
      </Link>

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
