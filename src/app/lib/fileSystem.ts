import fs from 'fs'
import path from 'path'

// Ensure data directory exists with proper permissions
export const ensureDataDir = (dirName: string = 'data') => {
  try {
    const dataDir = path.join(process.cwd(), dirName)
    console.log('Checking data directory:', dataDir)
    
    if (!fs.existsSync(dataDir)) {
      console.log('Data directory does not exist, creating it...')
      fs.mkdirSync(dataDir, { recursive: true })
      console.log('Data directory created successfully')
    } else {
      console.log('Data directory already exists')
    }
    
    // Check if directory is writable
    try {
      const testFile = path.join(dataDir, '.test')
      fs.writeFileSync(testFile, 'test')
      fs.unlinkSync(testFile)
      console.log('Data directory is writable')
      return true
    } catch (error) {
      console.error('Data directory is not writable:', error)
      return false
    }
  } catch (error) {
    console.error('Error ensuring data directory:', error)
    return false
  }
}

// Initialize file with data if it doesn't exist
export const initializeFile = (filePath: string, initialData: any) => {
  try {
    const dirPath = path.dirname(filePath)
    if (!ensureDataDir(path.basename(dirPath))) {
      console.error('Cannot initialize file, directory is not writable')
      return false
    }
    
    if (!fs.existsSync(filePath)) {
      console.log('File does not exist, initializing with data:', filePath)
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2))
      console.log('File initialized successfully')
    } else {
      console.log('File already exists:', filePath)
    }
    return true
  } catch (error) {
    console.error('Error initializing file:', error)
    return false
  }
}

// Read data from file with proper error handling
export const readDataFromFile = (filePath: string, fallbackData: any) => {
  try {
    const dirPath = path.dirname(filePath)
    if (!ensureDataDir(path.basename(dirPath))) {
      console.error('Cannot read from file, directory is not writable')
      return fallbackData
    }
    
    // Initialize file if it doesn't exist
    if (!fs.existsSync(filePath)) {
      console.log('File does not exist, initializing with fallback data')
      initializeFile(filePath, fallbackData)
    }
    
    console.log('Reading data from file:', filePath)
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading data from file:', error)
    return fallbackData
  }
}

// Write data to file with proper error handling
export const writeDataToFile = (filePath: string, data: any) => {
  try {
    const dirPath = path.dirname(filePath)
    if (!ensureDataDir(path.basename(dirPath))) {
      console.error('Cannot write to file, directory is not writable')
      return false
    }
    
    console.log('Writing data to file:', filePath)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    console.log('Data written successfully')
    return true
  } catch (error) {
    console.error('Error writing data to file:', error)
    return false
  }
} 