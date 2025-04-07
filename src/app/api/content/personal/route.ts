import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/app/lib/mongodb'
import { PersonalInfo, IPersonalInfo } from '@/app/models/PersonalInfo'

export async function GET() {
  try {
    await connectToDatabase()
    const personalInfo = await PersonalInfo.findOne().lean()
    return NextResponse.json(personalInfo || {})
  } catch (error) {
    console.error('Error fetching personal info:', error)
    return NextResponse.json({ error: 'Failed to fetch personal info' }, { status: 500 })
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