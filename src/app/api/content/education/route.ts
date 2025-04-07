import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
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
    const session = await getServerSession()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    await connectToDatabase()
    const education = await Education.create(data)
    return NextResponse.json(education)
  } catch (error) {
    console.error('Error creating education:', error)
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Education ID is required' }, { status: 400 })
    }

    await connectToDatabase()
    await Education.findByIdAndDelete(id)
    return NextResponse.json({ message: 'Education deleted successfully' })
  } catch (error) {
    console.error('Error deleting education:', error)
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 })
  }
} 