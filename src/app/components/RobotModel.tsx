'use client'
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion-3d'
import { Mesh, Euler } from 'three'
import { ThreeElements } from '@react-three/fiber'

export default function RobotModel() {
  const robotRef = useRef<ThreeElements['mesh']>(null)

  useFrame((state) => {
    if (robotRef.current) {
      const rotation = robotRef.current.rotation as Euler
      rotation.y += 0.01
    }
  })

  return (
    <group>
      {/* Robot Head */}
      <motion.mesh
        ref={robotRef}
        position={[0, 2, 0]}
        animate={{
          y: [2, 2.2, 2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4B5563" />
      </motion.mesh>

      {/* Robot Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 2, 1]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>

      {/* Robot Arms */}
      <motion.group
        animate={{
          rotateZ: [-0.2, 0.2, -0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Left Arm */}
        <mesh position={[-1, 0.5, 0]}>
          <boxGeometry args={[0.4, 2, 0.4]} />
          <meshStandardMaterial color="#4B5563" />
        </mesh>

        {/* Right Arm */}
        <mesh position={[1, 0.5, 0]}>
          <boxGeometry args={[0.4, 2, 0.4]} />
          <meshStandardMaterial color="#4B5563" />
        </mesh>
      </motion.group>

      {/* Robot Legs */}
      <motion.group
        animate={{
          rotateX: [-0.1, 0.1, -0.1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Left Leg */}
        <mesh position={[-0.5, -1.5, 0]}>
          <boxGeometry args={[0.4, 2, 0.4]} />
          <meshStandardMaterial color="#374151" />
        </mesh>

        {/* Right Leg */}
        <mesh position={[0.5, -1.5, 0]}>
          <boxGeometry args={[0.4, 2, 0.4]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      </motion.group>
    </group>
  )
} 