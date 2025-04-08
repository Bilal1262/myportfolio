import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'

// Fallback data for education
const educationData = [
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

// In-memory storage for education
let educationStorage = [...educationData]

export async function GET() {
  try {
    console.log('Fetching education from memory')
    return NextResponse.json(educationStorage)
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json(educationData)
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
    
    // Generate a new ID
    const newId = (educationStorage.length + 1).toString()
    const newEducation = { ...data, _id: newId }
    
    // Add to storage
    educationStorage.push(newEducation)
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
    
    // Find the education index
    const educationIndex = educationStorage.findIndex(edu => edu._id === id)
    
    if (educationIndex === -1) {
      console.log('Education not found:', id)
      return NextResponse.json({ error: 'Education not found' }, { status: 404 })
    }
    
    // Remove the education
    educationStorage = educationStorage.filter(edu => edu._id !== id)
    console.log('Education deleted successfully:', id)
    
    return NextResponse.json({ message: 'Education deleted successfully' })
  } catch (error) {
    console.error('Error deleting education:', error)
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 })
  }
} 