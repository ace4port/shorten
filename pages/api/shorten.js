import Url from '../../server/schema/URLSchema'
import dbConnect from '../../server/lib/dbConntect'
import { nanoid } from 'nanoid'

export default async function shorten(req, res) {
  const { method } = req
  await dbConnect()

  // Process a POST request
  if (method === 'POST') {
    const { url } = req.body
    // check if the url is valid
    const isValid = isUrl(url)

    // check if the url is already in the database
    if (isValid) {
      const isAlreadyShortened = await Url.findOne({ originalUrl: url })
      if (isAlreadyShortened) {
        // if so, return the shortened url
        res.status(200).json({ shortUrl: isAlreadyShortened.shortUrl, urlCode: isAlreadyShortened.urlCode })
      } else {
        // if not, create a new shortened url
        const urlCode = nanoid(6)
        const shortenedUrl = `${process.env.BASE_URL}/${urlCode}`
        const newUrl = new Url({
          originalUrl: url,
          shortUrl: shortenedUrl,
          urlCode: urlCode,
        })
        // save to database
        await newUrl.save()
        // return the shortened url
        res.status(201).json({ shortUrl: shortenedUrl, urlCode: urlCode })
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
