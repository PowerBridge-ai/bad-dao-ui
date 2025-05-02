import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Vector3 } from 'three';

interface GameTileProps {
  position: [number, number, number];
  color: string;
  type: string;
  onClick: () => void;
}

const GameTile: React.FC<GameTileProps> = ({ position, color, type, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (mesh.current) {
      // Simple hover effect
      if (hovered) {
        mesh.current.scale.setScalar(1.1 + Math.sin(clock.getElapsedTime() * 2) * 0.05);
      } else {
        mesh.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime()) * 0.02);
      }
    }
  });

  // Determine shape based on tile type
  const getTileGeometry = () => {
    switch (type) {
      case 'innovation':
        return <boxGeometry args={[1, 0.2, 1]} />;
      case 'integrity':
        return <cylinderGeometry args={[0.7, 0.7, 0.2, 6]} />;
      case 'collaboration':
        return <cylinderGeometry args={[0.7, 0.7, 0.2, 32]} />;
      case 'excellence': 
        return <boxGeometry args={[1, 0.2, 1]} />;
      case 'userFocus':
        return <boxGeometry args={[1, 0.2, 1]} />;
      default:
        return <boxGeometry args={[1, 0.2, 1]} />;
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        receiveShadow
        castShadow
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {getTileGeometry()}
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {type}
      </Text>
    </group>
  );
};

export default GameTile;