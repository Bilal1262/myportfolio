import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

let isConnected = false

export async function connectToDatabase() {
  if (isConnected) {
    console.log('Using existing MongoDB connection')
    return mongoose
  }

  try {
    console.log('Connecting to MongoDB...')
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    await mongoose.connect(MONGODB_URI, opts)
    isConnected = true
    console.log('MongoDB connected successfully')
    return mongoose
  } catch (error) {
    console.error('MongoDB connection error:', error)
    isConnected = false
    throw error
  }
}

export default connectToDatabase 