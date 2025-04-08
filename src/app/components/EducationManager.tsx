'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

interface Education {
  _id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  location: string
  description: string
}

export default function EducationManager() {
  const { data: session } = useSession()
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newEducation, setNewEducation] = useState({
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    location: '',
    description: ''
  })

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/content/education')
      const data = await response.json()
      setEducation(data)
    } catch (error) {
      console.error('Error fetching education:', error)
      toast.error('Failed to fetch education data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/content/education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEducation),
      })

      if (!response.ok) {
        throw new Error('Failed to add education')
      }

      toast.success('Education added successfully')
      setIsAdding(false)
      setNewEducation({
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        location: '',
        description: ''
      })
      fetchEducation()
    } catch (error) {
      console.error('Error adding education:', error)
      toast.error('Failed to add education')
    }
  }

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) {
      return
    }

    try {
      const response = await fetch(`/api/content/education?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete education')
      }

      toast.success('Education deleted successfully')
      fetchEducation()
    } catch (error) {
      console.error('Error deleting education:', error)
      toast.error('Failed to delete education')
    }
  }

  if (!session?.user || session.user.role !== 'admin') {
    return null
  }

  if (loading) {
    return <div>Loading education data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Education</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isAdding ? 'Cancel' : 'Add Education'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddEducation} className="space-y-4 bg-gray-50 p-4 rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">School</label>
              <input
                type="text"
                value={newEducation.school}
                onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Degree</label>
              <input
                type="text"
                value={newEducation.degree}
                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Field</label>
              <input
                type="text"
                value={newEducation.field}
                onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={newEducation.location}
                onChange={(e) => setNewEducation({ ...newEducation, location: e.target.value })}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="month"
                value={newEducation.startDate}
                onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="month"
                value={newEducation.endDate}
                onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newEducation.description}
              onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Education
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{edu.school}</h3>
                <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                <p className="text-sm text-gray-500">{edu.location}</p>
                <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                <p className="mt-2">{edu.description}</p>
              </div>
              <button
                onClick={() => handleDeleteEducation(edu._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 