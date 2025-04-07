import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/app/lib/mongodb'
import { PersonalInfo, IPersonalInfo } from '@/app/models/PersonalInfo'

// Fallback data for when MongoDB is not available
const fallbackPersonalInfo = {
  name: 'Bilal Ahmed Qaimkhani',
  title: 'Robotics Engineer & AI Enthusiast',
  bio: 'I am a passionate Robotics Engineer and AI enthusiast with a strong background in software development and machine learning.',
  email: 'bk632723@gmail.com',
  location: 'Girona, Spain',
  github: 'https://github.com/Bilal1262',
  linkedin: 'https://linkedin.com/in/bilal-ahmed-qaimkhani'
}

export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB...')
    await connectToDatabase()
    console.log('Connected to MongoDB, fetching personal info...')
    const personalInfo = await PersonalInfo.findOne().lean()
    console.log('Personal info fetched:', personalInfo)
    return NextResponse.json(personalInfo || fallbackPersonalInfo)
  } catch (error) {
    console.error('Error fetching personal info:', error)
    // Return fallback data if MongoDB is not available
    return NextResponse.json(fallbackPersonalInfo)
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

    const personalInfo = await PersonalInfo.findOne()
    if (personalInfo) {
      Object.assign(personalInfo, data)
      await personalInfo.save()
    } else {
      await PersonalInfo.create(data)
    }

    return NextResponse.json({ message: 'Personal information saved successfully' })
  } catch (error) {
    console.error('Error saving personal info:', error)
    return NextResponse.json({ error: 'Failed to save personal info' }, { status: 500 })
  }
} 