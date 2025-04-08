import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import path from 'path'
import { readDataFromFile, writeDataToFile } from '@/app/lib/fileSystem'
import fs from 'fs'

// File path for storing projects data
const dataFilePath = path.join(process.cwd(), 'data', 'projects.json')

// Fallback data for projects
const fallbackProjects = [
  {
    title: "MiniGirona - Automated Underwater Vehicle",
    description: "Project focuses on underwater inspection, localization, and manipulation at the CIRS lab at the University of Girona. Developing algorithms for planning, localization, perception, and intervention. Will participate in an underwater robotics competition.",
    technologies: ["ROS2", "Python", "Underwater Robotics", "SLAM"],
    image: "/projects/minigirona.jpg",
    category: "robotics",
    _id: "1"
  },
  {
    title: "SLAM - The Turtlebot using LIDAR in ROS2",
    description: "Implementation of Simultaneous Localization and Mapping (SLAM) for the TurtleBot. Successfully completed simulation phase and working on ROS2 implementation for real robot deployment.",
    technologies: ["ROS2", "SLAM", "LIDAR", "Python"],
    image: "/projects/turtlebot.jpg",
    category: "robotics",
    _id: "2"
  },
  {
    title: "Path Planning Simulation",
    description: "Implementation of various path planning algorithms including Potential Function, Wavefront Planner, A*, RRT and RRT* for optimal robot navigation.",
    technologies: ["Python", "Path Planning", "RRT", "A*"],
    image: "/projects/path-planning.jpg",
    githubLink: "https://drive.google.com/drive/folders/11Ax14OU1zgr5tUh25LctUbYXZz0vCJmb",
    category: "robotics",
    _id: "3"
  },
  {
    title: "Robot Localization using Filters",
    description: "Implementation of Particle Filter, Kalman Filter and Extended Kalman Filter for robot localization in GPS-denied environments.",
    technologies: ["Python", "Particle Filter", "Kalman Filter", "Robot Localization"],
    image: "/projects/localization.jpg",
    githubLink: "https://drive.google.com/drive/folders/1kmpMVzvTMQfsoiBdNLg0t4_Y-YFhmRYa",
    category: "robotics",
    _id: "4"
  },
  {
    title: "3D Scanner and 3D Printer Integration",
    description: "Final Year Project - Integration of 3D printer and 3D scanner at single platform to reduce time during additive manufacturing. Achieved 70% accuracy in object replication.",
    technologies: ["CAD", "CNC Programming", "LIDAR", "3D Printing"],
    image: "/projects/3d-scanner-printer.jpg",
    category: "manufacturing",
    _id: "5"
  },
  {
    title: "6-Legged Spider Robot for Mining Inspection",
    description: "Surveillance spider robot for mines and dangerous terrains with terrain sensors, real-time data recording, and wireless communication.",
    technologies: ["Raspberry Pi", "Servo Control", "Sensor Integration", "3D Printing"],
    image: "/projects/spider-robot.jpg",
    category: "robotics",
    _id: "6"
  },
  {
    title: "One-Legged Hopper in ROS",
    description: "Development of URDF for Single legged hopper robot with kinematics and mathematical functions for movement control.",
    technologies: ["ROS", "URDF", "Linux", "Gazebo"],
    image: "/projects/hopper.jpg",
    category: "robotics",
    _id: "7"
  },
  {
    title: "Potato Plant Disease Prediction",
    description: "Deep Learning model for predicting potato plant diseases with 90% accuracy, classifying early blight, late blight, and healthy conditions.",
    technologies: ["TensorFlow", "Deep Learning", "CNN", "Python"],
    image: "/projects/plant-disease.jpg",
    category: "ai",
    _id: "8"
  }
]

// Initialize file with fallback data if it doesn't exist
const initializeProjectsFile = () => {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    const filePath = path.join(dataDir, 'projects.json')
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallbackProjects, null, 2))
      console.log('Initialized projects.json with fallback data')
    }
    return true
  } catch (error) {
    console.error('Error initializing projects file:', error)
    return false
  }
}

// Call initialization on module load
initializeProjectsFile()

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
    
    // Ensure file exists
    initializeProjectsFile()
    
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