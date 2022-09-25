import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'

import { Nav } from './index'
import Url from '../server/schema/URLSchema'
import User from '../server/schema/User'
import dbConnect from '../server/lib/dbConntect'

const AllUrls = ({ urls }) => {
  return (
    <div className='min-h-screen min-w-screen bg-black text-white px-10'>
      <Nav />
      <h1 className='text-4xl py-4'>AllUrls</h1>
      <div className='flex items-center justify-between'>
        <span className='text-2xl text-gray-400'>({urls.length})</span>
      </div>

      <div>
        {urls &&
          urls.map((url) => (
            <div className='flex justify-between' key={url.urlCode}>
              <a className='overflow-hidden max-w-[350px]' href={url.url}>
                {url.originalUrl}
              </a>
              <p className='text-gray-400 mx-4'>{url.urlCode}</p>
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
