import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

let isConnected = false
let connectionPromise: Promise<typeof mongoose> | null = null

export async function connectToDatabase() {
  if (isConnected) {
    console.log('Using existing MongoDB connection')
    return mongoose
  }

  if (connectionPromise) {
    console.log('Connection already in progress, waiting...')
    return connectionPromise
  }

  try {
    console.log('Connecting to MongoDB with URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'))
    connectionPromise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
    })

    const mongooseInstance = await connectionPromise
    isConnected = true
    console.log('MongoDB connected successfully')
    connectionPromise = null
    return mongooseInstance
  } catch (error) {
    console.error('MongoDB connection error:', error)
    isConnected = false
    connectionPromise = null
    throw error
  }
}

// Handle connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
  isConnected = false
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
  isConnected = false
})

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected')
  isConnected = true
})

// Add a function to check connection status
export function checkConnectionStatus() {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    port: mongoose.connection.port
  }
}

export default connectToDatabase 