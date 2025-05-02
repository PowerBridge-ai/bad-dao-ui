import React from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import { Vector3 } from 'three';

interface PathNodeProps {
  id: string;
  position: Vector3;
  connections: string[];
  type: string;
  color: string;
  onClick: () => void;
}

const PathNode: React.FC<PathNodeProps> = ({ 
  id, 
  position, 
  connections,
  type,
  color,
  onClick
}) => {
  return (
    <mesh position={position} onClick={onClick} userData={{ id, type }}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.5} />
      
      {/* Node label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {type}
      </Text>
    </mesh>
  );
};

export default PathNode; 