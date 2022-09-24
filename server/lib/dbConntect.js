import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  throw new Error('No mongo uri found. Please define the MONGO_URI environment variable inside .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }
  //    if (!cached.promise) {
  //      const opts = {
  //        bufferCommands: false,
  //      }

  //      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
  //        return mongoose
  //      })
  //    }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    console.log('error', error)
    throw error
  }

  return cached.conn
}

export default dbConnect
