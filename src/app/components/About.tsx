'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { IPersonalInfo } from '../models/PersonalInfo'
import { IEducation } from '../models/Education'

interface AboutProps {
  personalInfo: Partial<IPersonalInfo>
  education: IEducation[]
}

export default function About({ personalInfo, education }: AboutProps) {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {personalInfo.bio || 'I am a passionate Robotics Engineer and AI enthusiast with a strong background in software development and machine learning.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Education</h3>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu._id.toString()} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{edu.school}</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{edu.degree} in {edu.field}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{edu.startDate} - {edu.endDate}</p>
                  <p className="text-gray-600 dark:text-gray-300">{edu.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Programming</h4>
                <ul className="text-gray-600 dark:text-gray-300">
                  <li>Python</li>
                  <li>JavaScript/TypeScript</li>
                  <li>C++</li>
                  <li>MATLAB</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Technologies</h4>
                <ul className="text-gray-600 dark:text-gray-300">
                  <li>ROS</li>
                  <li>TensorFlow</li>
                  <li>PyTorch</li>
                  <li>OpenCV</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tools</h4>
                <ul className="text-gray-600 dark:text-gray-300">
                  <li>Git</li>
                  <li>Docker</li>
                  <li>Linux</li>
                  <li>LaTeX</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Soft Skills</h4>
                <ul className="text-gray-600 dark:text-gray-300">
                  <li>Problem Solving</li>
                  <li>Team Collaboration</li>
                  <li>Project Management</li>
                  <li>Technical Writing</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 