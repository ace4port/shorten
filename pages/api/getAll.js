import Url from '../../server/schema/URLSchema'
import dbConnect from '../../server/lib/dbConntect'

export default async function shorten(req, res) {
  await dbConnect()

  const { method } = req

  // Process a GET request
  if (method === 'GET') {
    try {
      const urls = await Url.find({})
      res.status(200).json({ urls })
    } catch (error) {
      res.status(404).json({ message: 'No URLs found' })
    }
  }
}
