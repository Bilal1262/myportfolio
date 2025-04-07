'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { IPersonalInfo } from '../models/PersonalInfo'

// Dynamically import Three.js components with no SSR
const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false })

interface HeroProps {
  personalInfo: Partial<IPersonalInfo>
}

export default function Hero({ personalInfo }: HeroProps) {
  return (
    <section className="h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="w-full h-full bg-gradient-to-b from-blue-500/20 to-purple-500/20 animate-pulse">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 bg-blue-500/30 rounded-lg animate-spin"></div>
            </div>
          </div>
        }>
          <ThreeScene />
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
        >
          {personalInfo.name || 'Bilal Ahmed Qaimkhani'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8"
        >
          {personalInfo.title || 'Robotics Engineer & AI Enthusiast'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#projects"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
          >
            Contact Me
          </a>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400"
        >
          <span>📍 {personalInfo.location || 'Girona, Spain'}</span>
          <span>📧 {personalInfo.email || 'bk632723@gmail.com'}</span>
          <span>🎓 {personalInfo.title || 'Erasmus Mundus Joint Master'}</span>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  )
} 