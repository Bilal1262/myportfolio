'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'

export default function Home() {
  const education = [
    {
      degree: "Erasmus Mundus Joint Master",
      field: "Intelligent Field Robotics of System",
      institution: "Girona, Spain",
      date: "10/09/2024 – CURRENT",
      grade: "9.26 / 10.0",
      link: "https://ifrosmaster.org/"
    },
    {
      degree: "Bachelor of Mechatronics Engineering",
      field: "Robotics",
      institution: "Mehran University of Engineering and Technology Jamshoro",
      date: "20/10/2018 – 20/10/2022",
      grade: "3.9/4",
      modules: "Machine Intelligence, Robotics, Microcontroller and Embedded Systems, Control System, Digital Signal and Image Processing and Mechatronics Systems Design"
    }
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Education Section */}
      <section id="education" className="section-padding bg-gray-50 dark:bg-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Education</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg card-hover"
              >
                <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                <p className="text-blue-600 dark:text-blue-400 mb-4">{edu.institution}</p>
                <p className="text-gray-600 dark:text-gray-300">{edu.field}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{edu.date}</p>
                <p className="text-sm font-semibold mt-2">Grade: {edu.grade}</p>
                {edu.modules && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Modules: {edu.modules}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <Projects />
    </main>
  )
} 