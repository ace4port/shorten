import Url from '../../server/schema/URLSchema'
import User from '../../server/schema/User'
import dbConnect from '../../server/lib/dbConntect'
import { nanoid } from 'nanoid'

import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function shorten(req, res) {
  const { method } = req
  await dbConnect()

  const session = await unstable_getServerSession(req, res, authOptions)

  if (session) {
    const user = await User.findOne({ email: session.user.email })
    switch (method) {
      case 'GET':
        try {
          const { urlCode } = req.query
          const urls = await Url.find({ user: user._id, urlCode })
          res.status(200).json({ success: true, data: urls })
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break
      case 'POST':
        try {
          const { url, customUrl } = req.body
          if (!isUrl(url)) {
            return res.status(400).json({ success: false, error: 'Invalid URL' })
          }

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
  // Process a POST request
  if (method === 'POST') {
    const { url, customUrl } = req.body
    // check if the url is valid
    const isValid = isUrl(url)

    // check if the url is already in the database
    if (isValid) {
      const isAlreadyShortened = await Url.findOne({ originalUrl: url })
      if (isAlreadyShortened) {
        // if so, return the shortened url
        return res.status(200).json({ shortUrl: isAlreadyShortened.shortUrl, urlCode: isAlreadyShortened.urlCode })
      } else {
        // if not, create a new shortened url
        const count = await Url.countDocuments()
        if (count > 18) {
          // if the count is greater than 18, delete the first one
          // await Url.findOneAndDelete({}).exec()
          // if count > 18 throw error
          return res.status(400).json({ error: 'You have reached the limit of 20 urls' })
        }

        const urlCode = customUrl ?? nanoid(6)

        if (customUrl) {
          const isCustomUrlTaken = await Url.findOne({ urlCode: customUrl })
          if (isCustomUrlTaken) {
            return res.status(400).json({ error: 'Custom URL is already taken' })
          }
        }

        const shortenedUrl = `${process.env.BASE_URL}/${urlCode}`
        const newUrl = new Url({
          originalUrl: url,
          shortUrl: shortenedUrl,
          urlCode: urlCode,
        })
        // save to database
        await newUrl.save()
        // return the shortened url
        return res.status(201).json({ shortUrl: shortenedUrl, urlCode: urlCode })
      }
    } else {
      res.status(400).json({ message: 'Invalid URL' })
    }
  }

  // Process a GET request
  if (method === 'GET') {
    const { urlCode } = req.query
    // check if the urlCode is in the database
    // const url = await Url.findOneAndUpdate({ urlCode: urlCode }, { $inc: { 'analytics.clicks': 1 } }, { new: true })
    const url = await Url.findOne({ urlCode: urlCode })

    if (url) {
      // if so, redirect to the original url
      res.redirect(url.originalUrl)
    } else {
      // if not, return an error
      res.status(404).json({ message: 'No URL found' })
    }
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
