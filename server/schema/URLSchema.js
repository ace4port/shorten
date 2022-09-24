import mongoose from 'mongoose'

const UrlSchema = new mongoose.Schema({
  urlCode: String,
  originalUrl: {
    type: String,
    required: [true, 'Please add a long url'],
    maxlength: [200, 'Long url cannot be more than 200 characters'],
  },
  shortUrl: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.UrlSchema || mongoose.model('UrlSchema', UrlSchema)
