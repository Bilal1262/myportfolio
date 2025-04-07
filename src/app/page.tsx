'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import { getServerSession } from 'next-auth'
import { IPersonalInfo } from './models/PersonalInfo'
import { IEducation } from './models/Education'

export default async function Home() {
  const session = await getServerSession()
  const isAdmin = session?.user?.role === 'admin'

  let personalInfo: Partial<IPersonalInfo> = {}
  let education: IEducation[] = []

  try {
    const [personalInfoRes, educationRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/content/personal`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/content/education`, { cache: 'no-store' })
    ])

    if (personalInfoRes.ok) {
      personalInfo = await personalInfoRes.json()
    }
    if (educationRes.ok) {
      education = await educationRes.json()
    }
  } catch (error) {
    console.error('Error fetching content:', error)
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  )
} 