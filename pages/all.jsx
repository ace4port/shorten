import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'

import { Nav } from './index'
import { getUrlLink } from '../src/utils/getUrlLink'

import Url from '../server/schema/URLSchema'
import User from '../server/schema/User'
import dbConnect from '../server/lib/dbConntect'

const AllUrls = ({ urls }) => {
  return (
    <div className='min-h-screen min-w-screen bg-black text-white px-10'>
      <Nav />
      <div className='flex items-center justify-between'>
        <h1 className='text-4xl py-4'>AllUrls</h1>
        <span className='text-2xl text-gray-400'>{urls.length}</span>
      </div>

      <div>
        {!urls.length && <div className='text-2xl text-gray-400'>No Urls Found or You are not logged in.</div>}

        <div className='flex justify-between font-bold'>
          <p className=''>Original Url</p>

          <p className=''>Shortned Link</p>

          <p>Clicks </p>
          <p>Date</p>
        </div>

        {urls &&
          urls.map((url) => (
            <div className='flex justify-between' key={url.urlCode}>
              <a className='' href={url.originalUrl} target='_blank'>
                <span className=' max-w-[350px] text-ellipsis clear-both inline-block overflow-hidden whitespace-nowrap'>
                  {url.originalUrl}
                </span>
              </a>
              <a className='text-gray-400 mx-4' href={getUrlLink(url.urlCode)} target='_blank'>
                {url.urlCode}
              </a>
              <p>{url.analytics.clicks} </p>
              {new Date(url.analytics.lastClicked).toLocaleDateString()}
            </div>
          ))}
      </div>
    </div>
  )
}

export default AllUrls

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
