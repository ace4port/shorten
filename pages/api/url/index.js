import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import Url from '../../../server/schema/URLSchema'
import User from '../../../server/schema/User'
import dbConnect from '../../../server/lib/dbConntect'

import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 10)

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

          const isAlreadyShortened = await Url.findOne({ originalUrl: url, user: user._id })
          if (isAlreadyShortened) return res.status(200).json({ urlCode: isAlreadyShortened.urlCode })

          if (customUrl) {
            const isCustomUrlTaken = await Url.findOne({ urlCode: customUrl, user: user._id })
            if (isCustomUrlTaken) return res.status(400).json({ success: false, error: 'Custom URL is already taken' })
          }

          const count = await Url.countDocuments()
          if (count > 50) return res.status(400).json({ error: 'You have reached the limit of 50 urls' })

          const code = customUrl || nanoid(7)
          const newUrl = await Url.create({ originalUrl: url, urlCode: code, user: user._id })
          res.status(201).json({ success: true, urlCode: newUrl.urlCode })
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

  res.status(401).json({ success: false, message: 'Unauthorized' })
}

const isUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}
