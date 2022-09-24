import { useEffect, useState } from 'react'

import Url from '../server/schema/URLSchema'
import dbConnect from '../server/dbConnect'

const Redirect = ({ message }) => {
  const [timer, setTimer] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((timer) => timer - 1)
    }, 1000)

    setTimeout(() => {
      window.location.href = '/'
    }, 3500)

    return () => clearInterval(interval)
  }, [message])

  return (
    <div>
      Redirecting to home page in {timer}s - {message}
    </div>
  )
}

export default Redirect

// get the urlCode from the query string
// const { urlCode } = req.query
// // check if the urlCode is in the database
// const url = await Url.findOne({ urlCode: urlCode })
// if (url) {
//   // if so, redirect to the original url
//   res.redirect(url.originalUrl)
// } else {
//   // if not, return an error
//   res.status(404).json({ message: 'No URL found' })
// }
//    clicks: { type: Number, default: 0 },
// lastClicked: { type: Date, default: Date.now },
// country: String,
// region: String,
// city: String,
// device: String,
// browser: String,

export async function getServerSideProps(context) {
  await dbConnect()
  const { id } = context.query
  let urlCode = id

  const browser = context.req.headers['user-agent']
  const update = {
    $inc: { 'analytics.clicks': 1 },
    $set: {
      'analytics.lastClicked': Date.now(),
      // 'analytics.country': context.req.headers['cf-ipcountry'],
      // 'analytics.region': context.req.headers['cf-ipregion'],
      // 'analytics.city': context.req.headers['cf-ipcity'],
      'analytics.device': browser.includes('Mobile') ? 'Mobile' : 'Desktop',
      'analytics.browser': browser.includes('Chrome')
        ? 'Chrome'
        : browser.includes('Firefox')
        ? 'Firefox'
        : browser.includes('Safari')
        ? 'Safari'
        : browser.includes('Opera')
        ? 'Opera'
        : browser.includes('Edge')
        ? 'Edge'
        : 'Other',
    },
  }
  const url = await Url.findOneAndUpdate({ urlCode: urlCode }, update, { new: true })

  if (url) {
    return {
      redirect: {
        destination: url.originalUrl,
        permanent: false,
      },
    }
  } else {
    return {
      props: {
        message: 'No URL found',
      },
    }
  }
}
