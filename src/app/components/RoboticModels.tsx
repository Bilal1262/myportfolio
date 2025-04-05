'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group, Vector3, Color, MathUtils } from 'three'
import { Html } from '@react-three/drei'

function RoboticArm() {
  const armRef = useRef<Group>(null)
  const joint1Ref = useRef<Group>(null)
  const joint2Ref = useRef<Group>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isWorking, setIsWorking] = useState(true)
  const [currentColor, setCurrentColor] = useState(new Color("#2563EB"))

  useEffect(() => {
    const targetColor = isHovered ? new Color("#60A5FA") : new Color("#2563EB")
    setCurrentColor(targetColor)
  }, [isHovered])

  return (
    <group ref={armRef} position={[3, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
      {/* Base with details */}
      <group>
        {/* Main base */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 1, 0.5, 32]} />
          <meshStandardMaterial color="#1E40AF" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Base ring */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.1, 32]} />
          <meshStandardMaterial color="#60A5FA" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Control panel */}
        <mesh position={[0.4, 0.3, 0.4]} rotation={[0, -Math.PI / 6, 0]} castShadow>
          <boxGeometry args={[0.4, 0.2, 0.1]} />
          <meshStandardMaterial color="#0F172A" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>

      {/* Main arm structure */}
      <group ref={joint1Ref} position={[0, 0.75, 0]}>
        {/* First joint housing */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
          <meshStandardMaterial color="#1E40AF" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Joint bearing */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.1, 32]} />
          <meshStandardMaterial color="#60A5FA" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* First arm segment with details */}
        <group position={[0, 0.75, 0]}>
          {/* Main arm segment */}
          <mesh
            position={[0, 0.5, 0]}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
            onClick={() => setIsWorking(!isWorking)}
            castShadow
          >
            <boxGeometry args={[0.3, 1.5, 0.3]} />
            <meshStandardMaterial 
              color={currentColor}
              metalness={0.6} 
              roughness={0.3} 
            />
          </mesh>
          
          {/* Hydraulic pistons */}
          <mesh position={[0.2, 0.5, 0.2]} rotation={[0, 0, Math.PI / 6]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1, 12]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.2, 0.5, 0.2]} rotation={[0, 0, -Math.PI / 6]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1, 12]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Second arm segment */}
      <group ref={joint2Ref} position={[0, 2.25, 0]}>
        {/* Second joint housing */}
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
          <meshStandardMaterial color="#1E40AF" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Joint bearing */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
          <meshStandardMaterial color="#60A5FA" metalness={0.7} roughness={0.3} />
        </mesh>
        
        <group position={[0.5, 0, 0]}>
          {/* Second arm segment */}
          <mesh position={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[1, 0.25, 0.25]} />
            <meshStandardMaterial 
              color={currentColor}
              metalness={0.6} 
              roughness={0.3} 
            />
          </mesh>
          
          {/* Cable management */}
          <mesh position={[0.3, 0.15, 0]} scale={[0.9, 0.08, 0.08]} castShadow>
            <boxGeometry />
            <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* End effector with tools */}
      <group position={[1.3, 2.25, 0]}>
        {/* Main gripper mount */}
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.3, 16]} />
          <meshStandardMaterial color="#1E40AF" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Gripper mechanism */}
        <group>
          <mesh position={[0.15, 0.1, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <boxGeometry args={[0.4, 0.08, 0.08]} />
            <meshStandardMaterial color="#312E81" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.15, -0.1, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
            <boxGeometry args={[0.4, 0.08, 0.08]} />
            <meshStandardMaterial color="#312E81" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* Status indicator */}
        <Html position={[0.3, 0.3, 0]} style={{ pointerEvents: 'none' }}>
          <div className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md whitespace-nowrap">
            {isWorking ? "Ready" : "Standby"}
          </div>
        </Html>
      </group>
    </group>
  )
}

function DifferentialDriveRobot() {
  const robotRef = useRef<Group>(null)
  const wheelsRef = useRef<Group>(null)
  const [isScanning, setIsScanning] = useState(true)
  const [targetPosition] = useState(new Vector3(0, 0, 0))
  const [currentVelocity] = useState(new Vector3(0, 0, 0))
  const [lidarRotation, setLidarRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsScanning(prev => !prev)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useFrame((state, delta) => {
    if (robotRef.current && wheelsRef.current) {
      // Calculate target position based on a figure-8 pattern
      const time = state.clock.elapsedTime * 0.3
      targetPosition.x = Math.sin(time) * 3
      targetPosition.z = Math.sin(time * 2) * 2

      // Smooth movement using velocity
      if (robotRef.current.position.distanceTo(targetPosition) > 0.01) {
        // Calculate direction to target
        const direction = targetPosition.clone().sub(robotRef.current.position)
        const distance = direction.length()
        direction.normalize()

        // Update velocity with smooth acceleration
        currentVelocity.x = MathUtils.lerp(currentVelocity.x, direction.x * Math.min(distance, 1.5), delta * 2)
        currentVelocity.z = MathUtils.lerp(currentVelocity.z, direction.z * Math.min(distance, 1.5), delta * 2)

        // Update position
        robotRef.current.position.add(currentVelocity.multiplyScalar(delta))

        // Update rotation to face movement direction
        const targetRotation = Math.atan2(currentVelocity.x, currentVelocity.z)
        robotRef.current.rotation.y = MathUtils.lerp(
          robotRef.current.rotation.y,
          targetRotation,
          delta * 5
        )

        // Wheel rotation based on movement speed
        const wheelSpeed = currentVelocity.length() * 5
        wheelsRef.current.children.forEach((child) => {
          if (child instanceof Group) {
            const wheel = child.children[0]
            if (wheel instanceof Mesh) {
              wheel.rotation.x += wheelSpeed * delta
            }
          }
        })

        // Rotate lidar
        setLidarRotation(prev => (prev + delta * 5) % (Math.PI * 2))
      }
    }
  })

  return (
    <group ref={robotRef} position={[-2, 0, 0]}>
      {/* Main body with details */}
      <group>
        {/* Base plate */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.1, 1.7]} />
          <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Main body */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.4, 1.5]} />
          <meshStandardMaterial color="#4F46E5" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Top cover with vents */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[1.1, 0.1, 1.4]} />
          <meshStandardMaterial color="#312E81" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Computer module */}
        <mesh position={[0, 0.75, -0.2]} castShadow>
          <boxGeometry args={[0.6, 0.2, 0.4]} />
          <meshStandardMaterial color="#1E1B4B" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Wheels with suspension */}
      <group ref={wheelsRef} position={[0, 0.3, 0]}>
        {/* Wheel assemblies */}
        {[[-0.7, 0, 0], [0.7, 0, 0]].map((position, index) => (
          <group key={index} position={new Vector3(...position)}>
            {/* Wheel */}
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
              <meshStandardMaterial color="#312E81" metalness={0.7} roughness={0.2} />
            </mesh>
            {/* Hub cap */}
            <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.01, 16]} />
              <meshStandardMaterial color="#818CF8" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Suspension */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Lidar sensor array */}
      <group position={[0, 0.8, 0]} rotation={[0, lidarRotation, 0]}>
        {/* Main lidar housing */}
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.15, 32]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Rotating lidar element */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
          <meshStandardMaterial 
            color={isScanning ? "#22C55E" : "#EF4444"}
            emissive={isScanning ? "#22C55E" : "#EF4444"}
            emissiveIntensity={0.5}
            metalness={0.5} 
            roughness={0.1} 
          />
        </mesh>

        {/* Lidar beam indicators */}
        {[0, Math.PI/2, Math.PI, Math.PI*3/2].map((angle, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(angle) * 0.18,
              0.1,
              Math.sin(angle) * 0.18
            ]} 
            castShadow
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial 
              color={isScanning ? "#22C55E" : "#EF4444"}
              emissive={isScanning ? "#22C55E" : "#EF4444"}
              emissiveIntensity={0.5}
              metalness={0.5} 
              roughness={0.1} 
            />
          </mesh>
        ))}
      </group>

      {/* Status display */}
      <Html position={[0, 1.2, 0]} style={{ pointerEvents: 'none' }}>
        <div className="px-2 py-1 text-xs bg-indigo-500 text-white rounded-md whitespace-nowrap">
          {isScanning ? "Scanning" : "Processing"}
        </div>
      </Html>
    </group>
  )
}

export { RoboticArm, DifferentialDriveRobot } 