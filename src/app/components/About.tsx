'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function About() {
  const skills = [
    "Robotics",
    "ROS",
    "Computer Vision",
    "Machine Learning",
    "Control Systems",
    "Python",
    "C++",
    "Arduino",
    "3D Printing",
    "CAD Design"
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">
            About Me
          </h2>
          
          <div className="prose dark:prose-invert max-w-none mb-12">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              I am a passionate robotics engineer with a focus on developing innovative solutions 
              that bridge the gap between hardware and software. My experience spans across various 
              domains of robotics, from control systems to artificial intelligence.
            </p>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-6 dark:text-white">Skills & Technologies</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center"
                >
                  <span className="text-gray-800 dark:text-gray-200">{skill}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 