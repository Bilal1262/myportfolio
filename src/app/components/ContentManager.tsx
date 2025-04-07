'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

interface Education {
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
  _id: string
}

interface PersonalInfo {
  name: string
  title: string
  bio: string
  email: string
  location: string
  github: string
  linkedin: string
}

export default function ContentManager() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'personal' | 'education'>('personal')
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    title: '',
    bio: '',
    email: '',
    location: '',
    github: '',
    linkedin: ''
  })
  const [education, setEducation] = useState<Education[]>([])
  const [showAddEducation, setShowAddEducation] = useState(false)
  const [newEducation, setNewEducation] = useState<Partial<Education>>({})
  const [isLoading, setIsLoading] = useState(true)

  const isAdmin = session?.user?.role === 'admin'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personalInfoRes, educationRes] = await Promise.all([
          fetch('/api/content/personal'),
          fetch('/api/content/education')
        ])

        if (personalInfoRes.ok) {
          const personalInfoData = await personalInfoRes.json()
          setPersonalInfo(personalInfoData)
        }

        if (educationRes.ok) {
          const educationData = await educationRes.json()
          setEducation(educationData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  if (!isAdmin) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPersonalInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleSavePersonalInfo = async () => {
    try {
      const response = await fetch('/api/content/personal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personalInfo),
      })

      if (!response.ok) {
        throw new Error('Failed to save personal info')
      }

      alert('Personal information saved successfully!')
    } catch (error) {
      console.error('Error saving personal info:', error)
      alert('Failed to save personal information')
    }
  }

  const handleAddEducation = async () => {
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

      const addedEducation = await response.json()
      setEducation(prev => [...prev, addedEducation])
      setShowAddEducation(false)
      setNewEducation({})
    } catch (error) {
      console.error('Error adding education:', error)
      alert('Failed to add education')
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

      setEducation(prev => prev.filter(edu => edu._id !== id))
    } catch (error) {
      console.error('Error deleting education:', error)
      alert('Failed to delete education')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'personal'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'education'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Education
        </button>
      </div>

      {activeTab === 'personal' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={personalInfo.name}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={personalInfo.title}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={personalInfo.bio}
              onChange={handlePersonalInfoChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={personalInfo.email}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={personalInfo.location}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GitHub URL</label>
            <input
              type="url"
              name="github"
              value={personalInfo.github}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin"
              value={personalInfo.linkedin}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <button
            onClick={handleSavePersonalInfo}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Personal Information
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <button
            onClick={() => setShowAddEducation(true)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Education
          </button>

          {education.map(edu => (
            <div
              key={edu._id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{edu.school}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </p>
                  <p className="mt-2">{edu.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteEducation(edu._id)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {showAddEducation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl"
              >
                <h3 className="text-2xl font-bold mb-4">Add Education</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">School</label>
                    <input
                      type="text"
                      value={newEducation.school || ''}
                      onChange={e => setNewEducation(prev => ({ ...prev, school: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Degree</label>
                    <input
                      type="text"
                      value={newEducation.degree || ''}
                      onChange={e => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Field of Study</label>
                    <input
                      type="text"
                      value={newEducation.field || ''}
                      onChange={e => setNewEducation(prev => ({ ...prev, field: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input
                        type="date"
                        value={newEducation.startDate || ''}
                        onChange={e => setNewEducation(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input
                        type="date"
                        value={newEducation.endDate || ''}
                        onChange={e => setNewEducation(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={newEducation.description || ''}
                      onChange={e => setNewEducation(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowAddEducation(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddEducation}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Education
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
} 