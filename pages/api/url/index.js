import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { nanoid } from 'nanoid'

import Url from '../../../server/schema/URLSchema'
import User from '../../../server/schema/User'
import dbConnect from '../../../server/lib/dbConntect'

export default async function handler(req, res) {
  const { method } = req
  await dbConnect()

  const session = await unstable_getServerSession(req, res, authOptions)

  if (session) {
    const user = await User.findOne({ email: session.user.email })
    switch (method) {
      case 'GET':
        try {
          const urls = await Url.find({ user: user._id })
          if (!urls || !urls.length) return res.status(404).json({ success: false, message: 'No urls found' })

          res.status(200).json({ success: true, data: urls })
        } catch (error) {
          res.status(400).json({ success: false, error })
        }
        break
      case 'POST':
        try {
          const { url, customUrl } = req.body

          if (!isUrl(url)) return res.status(400).json({ success: false, error: 'Invalid URL' })

          const isAlreadyShortened = await Url.findOne({ url, user: user._id })
          if (isAlreadyShortened) return res.status(200).json({ urlCode: isAlreadyShortened.urlCode })

          const count = await Url.countDocuments()
          if (count > 50) return res.status(400).json({ error: 'You have reached the limit of 50 urls' })

          const code = customUrl ?? nanoid(7)
          const newUrl = await Url.create({ originalUrl: url, urlCode: code, user: user._id })
          res.status(201).json({ success: true, data: { urlCode: newUrl.urlCode } })
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break
      default:
        res.status(400).json({ success: false, message: 'Invalid request' })
        break
    }
    return res.end()
  }
}

const isUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}
