'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Grid,
  AccumulativeShadows,
  RandomizedLight,
  Sparkles,
  Stars,
  Preload
} from '@react-three/drei'
import { RoboticArm, DifferentialDriveRobot } from './RoboticModels'

export default function ThreeScene() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas 
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: false,
          stencil: false,
          depth: true
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, 3, 10]
        }}
      >
        <color attach="background" args={['#030712']} />
        <fog attach="fog" args={['#030712', 5, 30]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.4}
          penumbra={0.5}
          intensity={1}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize={[2048, 2048]}
        />
        <spotLight
          position={[-5, 5, -5]}
          angle={0.4}
          penumbra={0.5}
          intensity={0.8}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

        {/* Stars background */}
        <Stars 
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        {/* Ground */}
        <Grid
          position={[0, -0.01, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#6366f1"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#818cf8"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />
        
        {/* Shadows */}
        <AccumulativeShadows
          temporal
          frames={100}
          color="#9333ea"
          colorBlend={0.5}
          opacity={0.8}
          scale={10}
          position={[0, -0.01, 0]}
        >
          <RandomizedLight
            amount={8}
            radius={4}
            ambient={0.5}
            intensity={1}
            position={[5, 5, -8]}
            bias={0.001}
          />
        </AccumulativeShadows>

        {/* Particle effects */}
        <Sparkles 
          count={100}
          scale={10}
          size={2}
          speed={0.4}
          opacity={0.1}
          color="#60a5fa"
        />

        {/* Robots */}
        <RoboticArm />
        <DifferentialDriveRobot />
        
        {/* Camera controls */}
        <OrbitControls 
          makeDefault
          enableZoom={true}
          minDistance={5}
          maxDistance={15}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Preload all assets */}
        <Preload all />
      </Canvas>
    </div>
  )
} 