'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Project {
  title: string
  description: string
  technologies: string[]
  image: string
  demoLink?: string
  githubLink?: string
  category: 'robotics' | 'ai' | 'web'
  _id: string
}

// Initial projects data
const initialProjects: Project[] = [
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

function AddProjectForm({ onAdd, onClose }: { onAdd: (project: Project) => void, onClose: () => void }) {
  const [formData, setFormData] = React.useState<Partial<Project>>({
    category: 'web',
    technologies: []
  })
  const [techInput, setTechInput] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || formData.technologies?.length === 0 || !formData.image) {
      alert('Please fill in all required fields and add at least one technology')
      return
    }
    onAdd(formData as Project)
    onClose()
  }

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault()
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()]
      }))
      setTechInput('')
    }
  }

  const handleTechAdd = () => {
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()]
      }))
      setTechInput('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Add New Project</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Technologies *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.technologies?.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm flex items-center"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      technologies: prev.technologies?.filter((_, i) => i !== index)
                    }))}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={handleTechKeyDown}
                placeholder="Type and press Enter to add"
                className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={handleTechAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL *</label>
            <input
              type="url"
              value={formData.image || ''}
              onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as Project['category'] }))}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            >
              <option value="web">Web</option>
              <option value="robotics">Robotics</option>
              <option value="ai">AI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Demo Link</label>
            <input
              type="url"
              value={formData.demoLink || ''}
              onChange={e => setFormData(prev => ({ ...prev, demoLink: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">GitHub Link</label>
            <input
              type="url"
              value={formData.githubLink || ''}
              onChange={e => setFormData(prev => ({ ...prev, githubLink: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Project
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function ProjectCard({ project, isAdmin, onEdit, onDelete }: { 
  project: Project, 
  isAdmin: boolean,
  onEdit?: () => void,
  onDelete?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative h-48">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Live Demo
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const { data: session } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = session?.user?.role === 'admin'

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProject = async (newProject: Project) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      })

      if (!response.ok) {
        throw new Error('Failed to add project')
      }

      const addedProject = await response.json()
      setProjects(prev => [addedProject, ...prev])
      setShowAddForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add project')
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      setProjects(prev => prev.filter(project => project._id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
        <button
          onClick={fetchProjects}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">Projects</h2>
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Project
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <ProjectCard
              key={project._id}
              project={project}
              isAdmin={isAdmin}
              onDelete={() => handleDeleteProject(project._id)}
            />
          ))}
        </div>

        {showAddForm && (
          <AddProjectForm
            onAdd={handleAddProject}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </div>
    </section>
  )
} 