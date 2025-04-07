'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import RobotModel from './components/RobotModel'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from './lib/mongodb'
import { PersonalInfo } from './models/PersonalInfo'
import { Education } from './models/Education'

async function getData() {
  try {
    await connectToDatabase()
    const [personalInfo, education] = await Promise.all([
      PersonalInfo.findOne(),
      Education.find().sort({ startDate: -1 })
    ])
    return { personalInfo: personalInfo || {}, education: education || [] }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { personalInfo: {}, education: [] }
  }
}

export default async function Home() {
  const { personalInfo, education } = await getData()
  const session = await getServerSession()

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {personalInfo.name || 'Your Name'}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                {personalInfo.title || 'Your Title'}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {personalInfo.bio || 'Your Bio'}
              </p>
              <div className="flex space-x-4">
                <a
                  href={personalInfo.github || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  GitHub
                </a>
                <a
                  href={personalInfo.linkedin || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  LinkedIn
                </a>
                <a
                  href={`mailto:${personalInfo.email || ''}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Email
                </a>
              </div>
            </div>
            <div className="md:w-1/2 h-[400px]">
              <Suspense fallback={<div>Loading...</div>}>
                <RobotModel />
              </Suspense>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Education</h2>
            <div className="space-y-6">
              {education.map(edu => (
                <div
                  key={edu._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {edu.school}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {edu.startDate} - {edu.endDate}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Projects</h2>
            <Projects />
          </div>
        </div>
      </div>
    </main>
  )
} 