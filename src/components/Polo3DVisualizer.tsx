/// <reference types="@react-three/fiber" />
import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas, createPortal } from '@react-three/fiber';
import { OrbitControls, useFBX, Environment, ContactShadows, Center, Html, Decal, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Logo } from '../types';

interface PoloVisualizerProps {
  bodyColor: string;
  collarColor: string;
  sleeveColor: string;
  logos: Logo[];
  view?: 'front' | 'back';
  onLogoDragStart?: (logoId: string, event: React.MouseEvent) => void;
  onLogoDrag?: (event: React.MouseEvent) => void;
  onLogoDragEnd?: () => void;
}

const LogoDecal = ({ logo }: { logo: Logo }) => {
  const texture = useTexture(logo.imageUrl);
  texture.colorSpace = THREE.SRGBColorSpace; // Guarantee matching colors
  
  // Set default coordinates (0,0,0 is the center of the shirt's geometry)
  let pos: [number, number, number] = [0, 0, 20]; 
  let rot: [number, number, number] = [0, 0, 0];
  
  // Map pixel size to 3D scale (tune division factor to make it look right)
  let scaleNum = (logo.size?.width || 50) / 4; 
  let ratio = logo.size?.width ? logo.size.height / logo.size.width : 1;

  // Approximate 3D coordinates based on typical shirt placement
  // We apply slight rotations to match the curved fabric of the shirt
  switch(logo.position.placement) {
    case 'left-chest': 
      pos = [11, 14, 19]; 
      rot = [0, 0.2, 0]; 
      break;
    case 'right-chest': 
      pos = [-11, 14, 19]; 
      rot = [0, -0.2, 0];
      break;
    case 'center-chest': 
      pos = [0, 12, 17]; 
      break;
    case 'back': 
      pos = [0, 15, -16]; 
      rot = [0, Math.PI, 0]; 
      break;
    case 'back-center':
      pos = [0, 8, -17];
      rot = [0, Math.PI, 0];
      break;
    case 'sleeve-left': 
      pos = [27, 5, 0]; 
      rot = [0, Math.PI / 2, 0];
      break;
    case 'sleeve-right': 
      pos = [-27, 5, 0]; 
      rot = [0, -Math.PI / 2, 0];
      break;
  }

  return (
    <mesh position={pos} rotation={rot}>
      <planeGeometry args={[scaleNum, scaleNum * ratio]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        depthTest 
        depthWrite={false} 
        toneMapped={false}
        polygonOffset 
        polygonOffsetFactor={-4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const LogoPatch = ({ mesh, logo }: { mesh: THREE.Mesh, logo: Logo }) => {
  const texture = useTexture(logo.imageUrl);
  
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // Using an Unlit Basic Material entirely bypasses Unity/Three irradiance multiplication,
    // ensuring the logo color matches the native uploaded image pixels exactly.
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      side: THREE.DoubleSide
    });
    mesh.material = mat;
    mesh.visible = true;
    
    return () => {
      mesh.visible = false;
      mat.dispose();
    };
  }, [mesh, texture]);
  
  return null;
};

const Model = ({ bodyColor, collarColor, sleeveColor, view, logos }: PoloVisualizerProps) => {
  const fbx = useFBX('/models/fbx/fbx.fbx');
  const cloned = useMemo(() => fbx.clone(true), [fbx]);

  const bumpMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Base mid-gray
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 16, 16);
      
      // Raised bumps simulating knit dimples
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(4, 4, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(12, 12, 3, 0, Math.PI * 2); ctx.fill();
      
      // Deep woven gaps
      ctx.fillStyle = '#404040';
      ctx.beginPath(); ctx.arc(4, 12, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(12, 4, 2, 0, Math.PI * 2); ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(120, 120); // Densely tile it across the shirt
    return texture;
  }, []);

  useEffect(() => {
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        
        const applyColor = (mat: THREE.Material) => {
          if (!mat || !mat.name) return;
          const matName = mat.name.toLowerCase();
          
          // Force all main fabric materials to be fully opaque to fix Blender export bugs
          mat.transparent = false;
          mat.depthWrite = true;
          mat.opacity = 1;
          
          // Do not overwrite logo materials from LogoPatch
          if (matName.includes('left-chest') || matName.includes('right-chest') || matName.includes('back')) return;
          
          if ('roughness' in mat) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.roughness = 1.0;
            stdMat.metalness = 0.0;
            stdMat.roughnessMap = null; 
            stdMat.metalnessMap = null;
            
            // Apply the procedural fabric bump map
            stdMat.bumpMap = bumpMap;
            stdMat.bumpScale = 0.03; // Subtle physical thread shadow depth
          }
          
          if ('shininess' in mat) {
            const phongMat = mat as THREE.MeshPhongMaterial;
            phongMat.shininess = 0;
            phongMat.specular = new THREE.Color(0x000000);
            
            // Apply the procedural fabric bump map
            phongMat.bumpMap = bumpMap;
            phongMat.bumpScale = 0.03;
          }

          if (matName.includes('collar') || matName.includes('neck') || matName.includes('rib') || matName.includes('cuff') || matName.includes('edge')) {
            (mat as any).color.set(collarColor);
          } else {
            (mat as any).color.set(bodyColor);
          }
        };

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => applyColor(mat as THREE.Material));
        } else {
          applyColor(mesh.material as THREE.Material);
        }
      }
    });
  }, [cloned, bodyColor, collarColor, sleeveColor, bumpMap]);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    cloned.position.x -= center.x;
    cloned.position.y -= center.y;
    cloned.position.z -= center.z;
  }, [cloned]);

  const logoMeshes = useMemo(() => {
    const meshes: Record<string, THREE.Mesh> = {};
    const exportedNames: string[] = [];
    
    cloned.traverse(c => {
      if ((c as THREE.Mesh).isMesh) {
        exportedNames.push(c.name);
        const name = c.name.toLowerCase();
        
        const isPatch = name.includes('logo') || 
                        name.includes('patch') || 
                        name === 'back center' || 
                        name === 'left chest' || 
                        name === 'right chest' || 
                        name === 'center chest';

        if (isPatch) {
          c.visible = false; // Hide logo patches by default
          
          let placement = '';
          if (name.includes('chest')) {
            if (name.includes('left')) placement = 'left-chest';
            else if (name.includes('right')) placement = 'right-chest';
            else placement = 'center-chest';
          } else if (name.includes('back')) {
            if (name.includes('center') || name.includes('mid') || name.includes('lower')) placement = 'back-center';
            else placement = 'back';
          } else if (name.includes('sleeve')) {
            if (name.includes('left')) placement = 'sleeve-left';
            else if (name.includes('right')) placement = 'sleeve-right';
          }
          
          if (placement) meshes[placement] = c as THREE.Mesh;
        }
      }
    });
    
    console.log("📦 All Blender Meshes Imported:", exportedNames);
    console.log("🎯 Successfully Mapped Logo Patches:", Object.keys(meshes));
    
    return meshes;
  }, [cloned]);

  const rotationY = view === 'front' ? 0 : Math.PI;

  return (
    <group rotation={[0, rotationY, 0]}>
      <primitive object={cloned} />
      {logos && logos.length > 0 && logos.map(logo => {
        const nativeMesh = logoMeshes[logo.position.placement];
        if (nativeMesh) {
           return <LogoPatch key={logo.id} mesh={nativeMesh} logo={logo} />;
        }
        // Graceful fallback to floating planes if the user missed a patch in Blender
        return <LogoDecal key={`fallback-${logo.id}`} logo={logo} />;
      })}
    </group>
  );
};

const FallbackLoader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3 p-4 bg-white/80 backdrop-blur rounded-xl shadow-lg">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-600 whitespace-nowrap">Loading 3D Model...</p>
    </div>
  </Html>
);

const Polo3DVisualizer: React.FC<PoloVisualizerProps> = (props) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center p-4">
      <Canvas style={{ width: '100%', height: '100%', minHeight: '500px' }} camera={{ position: [0, 0, 120], fov: 45 }}>
        <Suspense fallback={<FallbackLoader />}>
          <ambientLight intensity={0.6} />
          {/* Lowered front light intensity to accurately preserve logo colors without blowing them out */}
          <directionalLight position={[0, 20, 50]} intensity={0.8} castShadow />
          {/* Gentle fill lights from sides to eliminate harsh core shadows */}
          <directionalLight position={[-30, 0, 30]} intensity={0.4} />
          <directionalLight position={[30, 0, 30]} intensity={0.4} />
          <Environment preset="studio" />
          
          <group position={[0, -10, 0]} scale={0.8}>
            <Model {...props} />
          </group>

          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
          <ContactShadows position={[0, -55, 0]} opacity={0.5} scale={150} blur={2} far={100} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Polo3DVisualizer;
