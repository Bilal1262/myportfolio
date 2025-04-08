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
    school: "University of Engineering and Technology",
    degree: "Bachelor of Science in Electrical Engineering",
    fieldOfStudy: "Robotics and Control Systems",
    startDate: "2018-09",
    endDate: "2022-06",
    location: "Lahore, Pakistan",
    description: "Specialized in robotics and control systems. Graduated with honors.",
    _id: "1"
  },
  {
    school: "Stanford University",
    degree: "Master of Science",
    fieldOfStudy: "Computer Science",
    startDate: "2022-09",
    endDate: "2024-06",
    location: "Stanford, CA",
    description: "Focus on artificial intelligence and machine learning.",
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
    
    // Read current education entries
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
    
    console.log('Education entry created:', newEducation)
    return NextResponse.json(newEducation, { status: 201 })
  } catch (error) {
    console.error('Error creating education entry:', error)
    return NextResponse.json({ error: 'Failed to create education entry' }, { status: 500 })
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
      console.log('No education entry ID provided')
      return NextResponse.json({ error: 'Education entry ID is required' }, { status: 400 })
    }
    
    console.log('Attempting to delete education entry:', id)
    
    // Read current education entries
    const education = readEducationFromFile()
    
    // Find the education entry index
    const educationIndex = education.findIndex(entry => entry._id === id)
    
    if (educationIndex === -1) {
      console.log('Education entry not found:', id)
      return NextResponse.json({ error: 'Education entry not found' }, { status: 404 })
    }
    
    // Remove the education entry
    const updatedEducation = education.filter(entry => entry._id !== id)
    
    // Write to file
    const success = writeEducationToFile(updatedEducation)
    if (!success) {
      throw new Error('Failed to save education entries to file')
    }
    
    console.log('Education entry deleted successfully:', id)
    return NextResponse.json({ message: 'Education entry deleted successfully' })
  } catch (error) {
    console.error('Error deleting education entry:', error)
    return NextResponse.json({ error: 'Failed to delete education entry' }, { status: 500 })
  }
} 