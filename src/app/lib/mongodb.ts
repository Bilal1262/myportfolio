import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let isConnected = false
let connectionPromise: Promise<typeof mongoose> | null = null

export async function connectToDatabase() {
  if (isConnected) {
    console.log('Using existing MongoDB connection')
    return
  }

  if (connectionPromise) {
    console.log('Connection already in progress, waiting...')
    return connectionPromise
  }

  try {
    console.log('Attempting to connect to MongoDB...')
    // Mask sensitive information in logs
    const maskedUri = MONGODB_URI.replace(/(mongodb\+srv:\/\/)([^:]+):([^@]+)@/, '$1****:****@')
    console.log('Connection URI (masked):', maskedUri)

    connectionPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Increase socket timeout
      connectTimeoutMS: 30000, // Increase connection timeout
      maxPoolSize: 10, // Limit connection pool size
      minPoolSize: 5, // Maintain minimum connections
      retryWrites: true,
      retryReads: true,
    })

    const connection = await connectionPromise

    isConnected = connection.connection.readyState === 1
    console.log('MongoDB connection state:', connection.connection.readyState)
    console.log('MongoDB connected successfully')
    
    // Log connection details
    const db = connection.connection.db
    console.log('Database name:', db.databaseName)
    console.log('Host:', connection.connection.host)
    console.log('Port:', connection.connection.port)

    connection.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
      isConnected = false
    })

    connection.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
      isConnected = false
    })

    connection.connection.on('reconnected', () => {
      console.log('MongoDB reconnected')
      isConnected = true
    })

    return connection
  } catch (error) {
    console.error('MongoDB connection error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName,
      stack: error.stack
    })
    isConnected = false
    connectionPromise = null
    throw error
  }
}

export function checkConnectionStatus() {
  if (!mongoose.connection) {
    return {
      isConnected: false,
      readyState: 'not initialized',
      host: null,
      databaseName: null,
      port: null
    }
  }

  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }

  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: states[mongoose.connection.readyState],
    host: mongoose.connection.host,
    databaseName: mongoose.connection.name,
    port: mongoose.connection.port
  }
}

export default connectToDatabase 