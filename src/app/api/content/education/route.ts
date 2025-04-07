import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { connectToDatabase } from '@/app/lib/mongodb'
import { Education, IEducation } from '@/app/models/Education'

// Fallback data for when MongoDB is not available
const fallbackEducation = [
  {
    school: 'University of Girona',
    degree: 'Master',
    field: 'Robotics and Computer Vision',
    startDate: '2022',
    endDate: '2024',
    description: 'Specializing in robotics, computer vision, and artificial intelligence.',
    _id: '1'
  },
  {
    school: 'NED University of Engineering and Technology',
    degree: 'Bachelor',
    field: 'Electrical Engineering',
    startDate: '2018',
    endDate: '2022',
    description: 'Focus on control systems, electronics, and embedded systems.',
    _id: '2'
  }
]

export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB...')
    await connectToDatabase()
    console.log('Connected to MongoDB, fetching education...')
    const education = await Education.find().sort({ startDate: -1 }).lean()
    console.log('Education fetched:', education)
    return NextResponse.json(education.length > 0 ? education : fallbackEducation)
  } catch (error) {
    console.error('Error fetching education:', error)
    // Return fallback data if MongoDB is not available
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
    
    console.log('Connecting to MongoDB...')
    await connectToDatabase()
    console.log('Connected to MongoDB, creating education entry...')
    const data = await request.json()
    console.log('Education data:', data)
    
    // Validate required fields
    if (!data.school || !data.degree || !data.field || !data.startDate || !data.endDate || !data.description) {
      console.log('Missing required fields')
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    
    const education = await Education.create(data as Partial<IEducation>)
    console.log('Education entry created:', education)
    return NextResponse.json(education, { status: 201 })
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
    
    console.log('Connecting to MongoDB...')
    await connectToDatabase()
    console.log('Connected to MongoDB, deleting education entry:', id)
    
    // First check if the education entry exists
    const existingEducation = await Education.findById(id)
    if (!existingEducation) {
      console.log('Education entry not found:', id)
      return NextResponse.json({ error: 'Education entry not found' }, { status: 404 })
    }
    
    // Delete the education entry
    await Education.findByIdAndDelete(id)
    console.log('Education entry deleted successfully:', id)
    return NextResponse.json({ message: 'Education entry deleted successfully' })
  } catch (error) {
    console.error('Error deleting education:', error)
    // Check if it's a MongoDB error
    if (error instanceof Error) {
      if (error.name === 'CastError') {
        return NextResponse.json({ error: 'Invalid education ID format' }, { status: 400 })
      }
    }
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 })
  }
} 