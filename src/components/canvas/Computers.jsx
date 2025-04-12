import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import * as THREE from 'three';

import CanvasLoader from "../Loader";

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

const Flamingo = () => {
  const flamingo = useGLTF("./flamingo/Flamingo.glb");
  const mixer = useRef();
  const group = useRef();
  const clock = new THREE.Clock();
  const pathRadius = 30; // Radius of the circular flying path
  const heightOffset = 15; // Height of the initial position
  const rotationSpeed = 0.5; // Speed of the rotation along the circular path
  const verticalSpeed = 2; // Speed of the vertical bobbing motion

  useEffect(() => {
    if (flamingo.animations.length) {
      mixer.current = new THREE.AnimationMixer(flamingo.scene);
      const action = mixer.current.clipAction(flamingo.animations[0]);
      action.setDuration(1).play();
    }
  }, [flamingo]);

  useFrame((state, delta) => {
    if (mixer.current) mixer.current.update(delta);
    const time = clock.getElapsedTime();

    // Create a circular path for the flamingo's horizontal movement
    const angle = time * rotationSpeed;
    const x = Math.cos(angle) * pathRadius + 50; // Move the flamingo to the right by adding to 'x'
    const z = Math.sin(angle) * pathRadius;

    // Add vertical bobbing motion for a flying effect
    const y = heightOffset + Math.sin(time * verticalSpeed) * 3; // Increased bobbing height

    // Update the flamingo's position, fixing it at the defined path
    flamingo.scene.position.set(x, y, z);

    // Calculate rotation to face the direction of movement
    const tangentAngle = angle + Math.PI / 2;
    flamingo.scene.rotation.y = tangentAngle;

    // Add slight banking effect while turning to simulate flight
    flamingo.scene.rotation.z = Math.sin(time * 2) * 0.1;
  });

  return (
    <group ref={group}>
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
      <primitive
        object={flamingo.scene}
        scale={0.35}
        position={[0, 15, 0]}
        rotation={[0, -1, 0]}
        castShadow
        receiveShadow
      />
    </group>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    !isMobile && (
      <Canvas
        frameloop="demand"
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 250], fov: 30 }} // Fixed camera position
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Flamingo />
        </Suspense>
        <Preload all />
      </Canvas>
    )
  );
};

export default ComputersCanvas;
