import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SimpleFlamingo = () => {
  const leftWingRef = useRef();
  const rightWingRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate wings
    const wingFlap = Math.sin(time * 8) * 0.5;
    if (leftWingRef.current && rightWingRef.current) {
      leftWingRef.current.rotation.z = wingFlap;
      rightWingRef.current.rotation.z = -wingFlap;
    }
  });

  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="#ff69b4" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 4, 0]} rotation={[0.3, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 8, 32]} />
        <meshStandardMaterial color="#ff69b4" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 8, 2]} castShadow receiveShadow>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#ff69b4" />
      </mesh>

      {/* Beak */}
      <mesh position={[0, 8, 3]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.5, 3, 32]} />
        <meshStandardMaterial color="#ff8c00" />
      </mesh>

      {/* Left Wing */}
      <group ref={leftWingRef} position={[-2, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5, 0.5, 4]} />
          <meshStandardMaterial color="#ff69b4" />
        </mesh>
      </group>

      {/* Right Wing */}
      <group ref={rightWingRef} position={[2, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5, 0.5, 4]} />
          <meshStandardMaterial color="#ff69b4" />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-1, -3, 0]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 6, 32]} />
        <meshStandardMaterial color="#ff69b4" />
      </mesh>
      <mesh position={[1, -3, 0]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 6, 32]} />
        <meshStandardMaterial color="#ff69b4" />
      </mesh>
    </group>
  );
};

export default SimpleFlamingo; 