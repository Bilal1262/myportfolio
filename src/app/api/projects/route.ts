import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { connectToDatabase, checkConnectionStatus } from '@/app/lib/mongodb'
import Project, { IProject } from '@/app/models/Project'

// Fallback data for when MongoDB is not available
const fallbackProjects = [
  {
    title: "Robotic Arm Control System",
    description: "A 6-DOF robotic arm control system with inverse kinematics and real-time trajectory planning. Implemented using ROS2 and Python.",
    technologies: ["ROS2", "Python", "C++", "OpenCV"],
    image: "/projects/robotic-arm.jpg",
    githubLink: "https://github.com/yourusername/robotic-arm",
    category: "robotics",
    _id: "1"
  },
  {
    title: "Differential Drive Robot Navigation",
    description: "Autonomous navigation system for a differential drive robot with LIDAR-based SLAM and obstacle avoidance.",
    technologies: ["ROS", "Navigation2", "SLAM", "Python"],
    image: "/projects/diff-drive.jpg",
    githubLink: "https://github.com/yourusername/diff-drive-robot",
    category: "robotics",
    _id: "2"
  },
  {
    title: "AI-Powered Object Detection",
    description: "Real-time object detection system using deep learning, optimized for robotics applications.",
    technologies: ["PyTorch", "TensorFlow", "CUDA", "Python"],
    image: "/projects/object-detection.jpg",
    githubLink: "https://github.com/yourusername/object-detection",
    category: "ai",
    _id: "3"
  },
  {
    title: "3D Robot Visualization",
    description: "Interactive 3D visualization of robotic systems using Three.js and React, featuring real-time animation and control.",
    technologies: ["React", "Three.js", "TypeScript", "WebGL"],
    image: "/projects/3d-viz.jpg",
    demoLink: "https://your-demo-link.com",
    githubLink: "https://github.com/yourusername/3d-robot-viz",
    category: "web",
    _id: "4"
  }
]

export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB...')
    await connectToDatabase()
    console.log('Connected to MongoDB, fetching projects...')
    const projects = await Project.find().sort({ createdAt: -1 }).lean()
    console.log('Projects fetched:', projects)
    return NextResponse.json(projects.length > 0 ? projects : fallbackProjects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    // Return fallback data if MongoDB is not available
    return NextResponse.json(fallbackProjects)
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
    console.log('Connected to MongoDB, creating project...')
    const data = await request.json()
    console.log('Project data:', data)
    const project = await Project.create(data as Partial<IProject>)
    console.log('Project created:', project)
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
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
      console.log('No project ID provided')
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }
    
    console.log('Connecting to MongoDB...')
    try {
      await connectToDatabase()
      console.log('Connected to MongoDB successfully')
      console.log('Connection status:', checkConnectionStatus())
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
    
    console.log('Connected to MongoDB, deleting project:', id)
    
    // First check if the project exists
    let existingProject;
    try {
      existingProject = await Project.findById(id)
      console.log('Project lookup result:', existingProject ? 'Found' : 'Not found')
    } catch (lookupError) {
      console.error('Error looking up project:', lookupError)
      if (lookupError instanceof Error && lookupError.name === 'CastError') {
        return NextResponse.json({ error: 'Invalid project ID format' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Error looking up project' }, { status: 500 })
    }
    
    if (!existingProject) {
      console.log('Project not found:', id)
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Delete the project
    try {
      await Project.findByIdAndDelete(id)
      console.log('Project deleted successfully:', id)
      return NextResponse.json({ message: 'Project deleted successfully' })
    } catch (deleteError) {
      console.error('Error deleting project:', deleteError)
      return NextResponse.json({ error: 'Error deleting project from database' }, { status: 500 })
    }
  } catch (error) {
    console.error('Unexpected error in DELETE handler:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
} 