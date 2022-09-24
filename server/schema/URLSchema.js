import mongoose from 'mongoose'

const UrlSchema = new mongoose.Schema(
  {
    urlCode: String,
    originalUrl: {
      type: String,
      required: [true, 'Please add a long url'],
      maxlength: [200, 'Long url cannot be more than 200 characters'],
    },
    shortUrl: String,

    analytics: {
      clicks: { type: Number, default: 0 },
      lastClicked: { type: Date, default: Date.now },
      country: String,
      region: String,
      city: String,
      device: String,
      browser: String,
    },
  },
  {
    timestamps: true,
    expires: 60 * 60 * 24 * 30 * 6, // 6 months
  }
)

export default mongoose.models.UrlSchema || mongoose.model('UrlSchema', UrlSchema)
