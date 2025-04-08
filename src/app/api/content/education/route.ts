import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import fs from 'fs'
import path from 'path'

// File path for storing education data
const dataFilePath = path.join(process.cwd(), 'data', 'education.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Fallback data for education
const fallbackEducation = [
  {
    school: "University of Girona",
    degree: "Master in Robotics and Computer Vision",
    field: "Robotics and Computer Vision",
    startDate: "2022-09",
    endDate: "2024-06",
    location: "Girona, Spain",
    description: "Specialized in robotics, computer vision, and AI. Focused on developing autonomous systems and machine learning applications.",
    _id: "1"
  },
  {
    school: "NED University of Engineering and Technology",
    degree: "Bachelor in Electrical Engineering",
    field: "Electrical Engineering",
    startDate: "2018-09",
    endDate: "2022-06",
    location: "Karachi, Pakistan",
    description: "Specialized in control systems, electronics, and embedded systems. Developed strong foundation in hardware and software integration.",
    _id: "2"
  }
]

// Read education from file
const readEducationFromFile = () => {
  try {
    ensureDataDir()
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8')
      return JSON.parse(data)
    }
    return fallbackEducation
  } catch (error) {
    console.error('Error reading education from file:', error)
    return fallbackEducation
  }
}

// Write education to file
const writeEducationToFile = (education: any[]) => {
  try {
    ensureDataDir()
    fs.writeFileSync(dataFilePath, JSON.stringify(education, null, 2))
    return true
  } catch (error) {
    console.error('Error writing education to file:', error)
    return false
  }
}

export async function GET() {
  try {
    console.log('Fetching education from file')
    const education = readEducationFromFile()
    return NextResponse.json(education)
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json(fallbackEducation)
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
    console.log('Education data:', data)
    
    // Read current education
    const education = readEducationFromFile()
    
    // Generate a new ID
    const newId = (education.length + 1).toString()
    const newEducation = { ...data, _id: newId }
    
    // Add to education
    education.push(newEducation)
    
    // Write to file
    const success = writeEducationToFile(education)
    if (!success) {
      throw new Error('Failed to save education to file')
    }
    
    console.log('Education created:', newEducation)
    return NextResponse.json(newEducation, { status: 201 })
  } catch (error) {
    console.error('Error creating education:', error)
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    console.log('Checking authentication...')
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      console.log('Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      console.log('No education ID provided')
      return NextResponse.json({ error: 'Education ID is required' }, { status: 400 })
    }
    
    console.log('Attempting to delete education:', id)
    
    // Read current education
    let education
    try {
      education = readEducationFromFile()
      console.log('Current education:', education)
    } catch (error) {
      console.error('Error reading education file:', error)
      return NextResponse.json({ error: 'Failed to read education data' }, { status: 500 })
    }
    
    // Find the education index
    const educationIndex = education.findIndex(edu => edu._id === id)
    console.log('Education index:', educationIndex)
    
    if (educationIndex === -1) {
      console.log('Education not found:', id)
      return NextResponse.json({ error: 'Education not found' }, { status: 404 })
    }
    
    // Remove the education
    const updatedEducation = education.filter(edu => edu._id !== id)
    console.log('Updated education:', updatedEducation)
    
    // Write to file
    try {
      const success = writeEducationToFile(updatedEducation)
      if (!success) {
        throw new Error('Failed to write to education file')
      }
      console.log('Education file updated successfully')
    } catch (error) {
      console.error('Error writing to education file:', error)
      return NextResponse.json({ error: 'Failed to update education data' }, { status: 500 })
    }
    
    console.log('Education deleted successfully:', id)
    return NextResponse.json({ 
      message: 'Education deleted successfully',
      deletedEducationId: id
    })
  } catch (error) {
    console.error('Error in DELETE handler:', error)
    return NextResponse.json({ 
      error: 'Failed to delete education',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 