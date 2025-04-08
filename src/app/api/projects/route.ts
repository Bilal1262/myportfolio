import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import path from 'path'
import { readDataFromFile, writeDataToFile } from '@/app/lib/fileSystem'

// File path for storing projects data
const dataFilePath = path.join(process.cwd(), 'data', 'projects.json')

// Fallback data for projects
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
    console.log('Fetching projects from file')
    const projects = readDataFromFile(dataFilePath, fallbackProjects)
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
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
    
    const data = await request.json()
    console.log('Project data:', data)
    
    // Read current projects
    const projects = readDataFromFile(dataFilePath, fallbackProjects)
    
    // Generate a new ID
    const newId = (projects.length + 1).toString()
    const newProject = { ...data, _id: newId }
    
    // Add to projects
    projects.push(newProject)
    
    // Write to file
    const success = writeDataToFile(dataFilePath, projects)
    if (!success) {
      throw new Error('Failed to save project to file')
    }
    
    console.log('Project created:', newProject)
    return NextResponse.json(newProject, { status: 201 })
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
    
    console.log('Attempting to delete project:', id)
    
    // Read current projects
    const projects = readDataFromFile(dataFilePath, fallbackProjects)
    console.log('Current projects:', projects)
    
    // Find the project index
    const projectIndex = projects.findIndex(project => project._id === id)
    console.log('Project index:', projectIndex)
    
    if (projectIndex === -1) {
      console.log('Project not found:', id)
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Remove the project
    const updatedProjects = projects.filter(project => project._id !== id)
    console.log('Updated projects:', updatedProjects)
    
    // Write to file
    const success = writeDataToFile(dataFilePath, updatedProjects)
    if (!success) {
      throw new Error('Failed to write to projects file')
    }
    
    console.log('Project deleted successfully:', id)
    return NextResponse.json({ 
      message: 'Project deleted successfully',
      deletedProjectId: id
    })
  } catch (error) {
    console.error('Error in DELETE handler:', error)
    return NextResponse.json({ 
      error: 'Failed to delete project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 