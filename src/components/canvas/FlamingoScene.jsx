import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import SimpleFlamingo from './SimpleFlamingo';

const vertexShader = `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  uniform float offset;
  uniform float exponent;

  varying vec3 vWorldPosition;

  void main() {
    float h = normalize(vWorldPosition + offset).y;
    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
  }
`;

const Sky = () => {
  const uniforms = {
    topColor: { value: new THREE.Color(0x0077ff) },
    bottomColor: { value: new THREE.Color(0xffffff) },
    offset: { value: 33 },
    exponent: { value: 0.6 }
  };

  return (
    <mesh>
      <sphereGeometry args={[4000, 32, 15]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -33, 0]} receiveShadow>
      <planeGeometry args={[10000, 10000]} />
      <meshLambertMaterial color={new THREE.Color().setHSL(0.095, 1, 0.75)} />
    </mesh>
  );
};

const Lights = () => {
  return (
    <>
      <hemisphereLight
        intensity={2}
        color={new THREE.Color().setHSL(0.6, 1, 0.6)}
        groundColor={new THREE.Color().setHSL(0.095, 1, 0.75)}
        position={[0, 50, 0]}
      />
      <directionalLight
        intensity={3}
        color={new THREE.Color().setHSL(0.1, 1, 0.95)}
        position={[-30, 52.5, 30]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-far={3500}
        shadow-bias={-0.0001}
      />
    </>
  );
};

const AnimatedFlamingo = () => {
  const flamingoRef = useRef();
  const clock = new THREE.Clock();
  const pathRadius = 30;
  const heightOffset = 15;
  const rotationSpeed = 0.5;
  const verticalSpeed = 2;

  useFrame(() => {
    const time = clock.getElapsedTime();

    // Create a circular path for the flamingo's horizontal movement
    const angle = time * rotationSpeed;
    const x = Math.cos(angle) * pathRadius;
    const z = Math.sin(angle) * pathRadius;

    // Add vertical bobbing motion for a flying effect
    const y = heightOffset + Math.sin(time * verticalSpeed) * 3;  // Increased bobbing height

    // Update the flamingo's position
    flamingoRef.current.position.set(x, y, z);

    // Calculate rotation to face the direction of movement
    const tangentAngle = angle + Math.PI / 2;
    flamingoRef.current.rotation.y = tangentAngle;

    // Add slight banking effect while turning to simulate flight
    flamingoRef.current.rotation.z = Math.sin(time * 2) * 0.1;  // Added banking effect for realism
  });

  return (
    <group ref={flamingoRef}>
      <SimpleFlamingo />
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <Sky />
      <Ground />
      <Lights />
      <AnimatedFlamingo /> {/* Make sure AnimatedFlamingo is inside the scene */}
      <Environment preset="sunset" />
      <fog attach="fog" args={[new THREE.Color(0xffffff), 1, 5000]} />
    </>
  );
};

const FlamingoScene = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [50, 30, 100], fov: 35 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Scene /> {/* Ensure AnimatedFlamingo is part of the scene */}
      <OrbitControls
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        enablePan={false}  // Disable panning (no mouse movement control)
        enableRotate={false}  // Disable rotation (no mouse movement control)
      />
    </Canvas>
  );
};

export default FlamingoScene;
