import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import fs from 'fs'
import path from 'path'

// File path for storing personal info
const dataFilePath = path.join(process.cwd(), 'data', 'personal.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Fallback data for personal info
const fallbackPersonalInfo = {
  name: "Bilal Ahmed",
  title: "Full Stack Developer",
  email: "bilal.ahmed@example.com",
  location: "Lahore, Pakistan",
  bio: "Passionate about web development and creating beautiful user experiences.",
  skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
  socialLinks: {
    github: "https://github.com/Bilal1262",
    linkedin: "https://linkedin.com/in/bilal-ahmed",
    twitter: "https://twitter.com/bilal_ahmed"
  }
}

// Read personal info from file
const readPersonalInfoFromFile = () => {
  try {
    ensureDataDir()
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8')
      return JSON.parse(data)
    }
    return fallbackPersonalInfo
  } catch (error) {
    console.error('Error reading personal info from file:', error)
    return fallbackPersonalInfo
  }
}

// Write personal info to file
const writePersonalInfoToFile = (personalInfo: any) => {
  try {
    ensureDataDir()
    fs.writeFileSync(dataFilePath, JSON.stringify(personalInfo, null, 2))
    return true
  } catch (error) {
    console.error('Error writing personal info to file:', error)
    return false
  }
}

export async function GET() {
  try {
    console.log('Fetching personal info from file')
    const personalInfo = readPersonalInfoFromFile()
    return NextResponse.json(personalInfo)
  } catch (error) {
    console.error('Error fetching personal info:', error)
    return NextResponse.json(fallbackPersonalInfo)
  }
}

export async function POST(request: Request) {
  try {
    console.log('Checking authentication...')
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      console.log('Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const data = await request.json()
    console.log('Personal info data:', data)
    
    // Write to file
    const success = writePersonalInfoToFile(data)
    if (!success) {
      throw new Error('Failed to save personal info to file')
    }
    
    console.log('Personal info updated:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating personal info:', error)
    return NextResponse.json({ error: 'Failed to update personal info' }, { status: 500 })
  }
} 