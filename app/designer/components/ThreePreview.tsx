"use client";

import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Text,
} from "@react-three/drei";
import * as THREE from "three";
import { canvasManager } from "../lib/canvas-manager";
import {
  useDesignerStore,
  GARMENT_NAMES,
  GARMENT_TEMPLATES,
} from "../store/designer-store";

function GarmentMesh({
  textureURL,
  garmentType,
}: {
  textureURL: string | null;
  garmentType: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => {
    if (!textureURL) return null;
    const tex = new THREE.TextureLoader().load(textureURL);
    tex.flipY = true;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [textureURL]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  const getGeometry = () => {
    switch (garmentType) {
      case "tshirt":
      case "hoodie":
      case "tanktop":
        return <planeGeometry args={[3.2, 3.8, 32, 32]} />;
      case "pants":
        return <planeGeometry args={[2.5, 4.2, 32, 32]} />;
      case "cap":
        return <sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />;
      default:
        return <planeGeometry args={[3.2, 3.8, 32, 32]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={[0, 0.3, 0]}>
      {getGeometry()}
      <meshStandardMaterial
        map={texture}
        color={texture ? undefined : "#666"}
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

function SceneContent({ garmentType }: { garmentType: string }) {
  const [textureURL, setTextureURL] = useState<string | null>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 1, 5);
  }, [camera]);

  useEffect(() => {
    const url = canvasManager.getCanvasDataURL();
    setTextureURL(url);
  }, []);

  // Refresh texture periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const url = canvasManager.getCanvasDataURL();
      setTextureURL(url);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />

      <GarmentMesh textureURL={textureURL} garmentType={garmentType} />

      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.4}
        scale={8}
        blur={2}
        far={4}
      />

      <Text
        position={[0, -2.3, 0]}
        fontSize={0.15}
        color="#666"
        anchorX="center"
        anchorY="middle"
      >
        {GARMENT_NAMES[garmentType as keyof typeof GARMENT_NAMES] ?? "Preview"}
      </Text>

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.5}
      />
      <Environment preset="city" />
    </>
  );
}

export default function ThreePreview() {
  const garmentType = useDesignerStore((s) => s.garmentType);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[#0d0d0d]">
      <div className="h-full w-full">
        <Canvas
          shadows
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          camera={{ fov: 45 }}
        >
          <Suspense fallback={null}>
            <SceneContent garmentType={garmentType} />
          </Suspense>
        </Canvas>
      </div>
      <div className="py-2 text-center text-xs text-[var(--text-dim)]">
        Arrastra para rotar • Scroll para zoom
      </div>
    </div>
  );
}
