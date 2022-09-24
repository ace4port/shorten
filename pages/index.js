import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

const submit = async (e, setError) => {
  e.preventDefault()
  const url = e.target.url.value
  const data = { url, customUrl: e.target.customUrl.value }
  fetch('/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      const result = document.getElementById('result')
      result.innerHTML = `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`
    })
    .catch((err) => {
      console.log(err, err.message)
      setError(err?.message)
    })
}

export default function Home() {
  const [error, setError] = useState('')

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

        <form onSubmit={(e) => submit(e, setError)}>
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
        <div id='result' className='p-4 text-green-200'></div>

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
