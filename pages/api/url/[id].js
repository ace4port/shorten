import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import dbConnect from '../../../server/lib/dbConntect'
import Url from '../../../server/schema/URLSchema'
import User from '../../../server/schema/User'

export default async function shorten(req, res) {
  const { method, query } = req
  let { urlCode, id } = query
  await dbConnect()

  const session = await unstable_getServerSession(req, res, authOptions)

  if (session) {
    const user = await User.findOne({ email: session.user.email })

    switch (method) {
      case 'GET' /* Get a model by its ID */:
        try {
          const url = await Url.findOne({ user: user._id, urlCode })
          if (!url) return res.status(404).json({ success: false, message: 'No url found' })
          res.redirect(url.originalUrl)
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break

      case 'PUT' /* Edit a model by its ID */:
        try {
          const url = await Url.findOneAndUpdate({ user: user._id, urlCode }, req.body, {
            new: true,
            runValidators: true,
          })
          if (!url) return res.status(404).json({ success: false, message: 'No url found' })

          res.status(200).json({ success: true, data: url })
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break

      case 'DELETE' /* Delete a model by its ID */:
        try {
          const deletedUrl = await Url.findByIdAndDelete(id)
          if (!deletedUrl) return res.status(400).json({ success: false })

          res.status(200).json({ success: true })
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break

      default:
        res.status(400).json({ success: false })
        break
    }
  }
}
