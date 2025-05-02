import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Vector3 } from 'three';

interface Player {
  id: string;
  name: string;
  color: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

interface PlayerTokenProps {
  player: Player;
}

const PlayerToken: React.FC<PlayerTokenProps> = ({ player }) => {
  const group = useRef<THREE.Group>(null);
  
  // Animation for floating effect
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.y = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
      group.current.rotation.y += 0.01;
    }
  });
  
  return (
    <group
      position={[player.position.x, player.position.y, player.position.z]}
      ref={group}
    >
      {/* Player avatar/token */}
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.5, 4, 8]} />
        <meshStandardMaterial 
          color={player.color} 
          emissive={player.color}
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      
      {/* Player name */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
      >
        {player.name}
      </Text>
    </group>
  );
};

export default PlayerToken;