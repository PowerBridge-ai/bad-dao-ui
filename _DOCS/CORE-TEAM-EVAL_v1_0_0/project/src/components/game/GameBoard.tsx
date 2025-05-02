import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, useTexture, Sky, Stars } from '@react-three/drei';
import { useGameState } from '../../context/GameContext';
import PlayerToken from './PlayerToken';
import PathNode from './PathNode';
import { Group, Vector3, TubeGeometry, CatmullRomCurve3, TextureLoader } from 'three';
import GameTile from './GameTile';

type ValueType = 'innovation' | 'integrity' | 'collaboration' | 'excellence' | 'userFocus';

// Helper function to generate board paths
const generatePath = (
  start: { x: number; y: number; z: number },
  nodes: [number, number, number][],
  type: string
) => {
  return nodes.map((node: [number, number, number], index: number) => ({
    id: `${type}-${index}`,
    position: new Vector3(
      start.x + node[0], 
      start.y + node[1], 
      start.z + node[2]
    ),
    type: type,
    connections: index < nodes.length - 1 ? [`${type}-${index + 1}`] : []
  }));
};

// Environment component for visual enhancement
const Environment = () => {
  return (
    <>
      {/* Modern gradient skybox */}
      <Sky distance={450000} sunPosition={[0.3, 1, 0.2]} inclination={0.45} azimuth={0.25} turbidity={8} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.8} />
      {/* Subtle stars for depth */}
      <Stars radius={120} depth={40} count={3000} factor={3} saturation={0.1} fade speed={0.5} />
      {/* Ambient and spot lighting for AR/VR feel */}
      <ambientLight intensity={0.5} color="#b0c4de" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        color="#e0e6ed"
      />
      <spotLight position={[-10, 30, -10]} angle={0.3} penumbra={0.5} intensity={0.7} castShadow color="#a3bffa" />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#5EDFFF" />
    </>
  );
};

// Calendar visualization component
const CalendarSystem = ({ currentDay, totalDays }: { currentDay: number; totalDays: number }) => {
  const group = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });
  
  return (
    <group ref={group} position={[0, 8, -15]}>
      <Text
        position={[0, 2, 0]}
        fontSize={1.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        PROJECT TIMELINE
      </Text>
      
      <Text
        position={[0, 0.5, 0]}
        fontSize={1}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
      >
        DAY {currentDay} of {totalDays}
      </Text>
      
      {/* Calendar visualization */}
      <group position={[0, -1, 0]}>
        {Array.from({ length: totalDays }).map((_, index) => (
          <mesh 
            key={index}
            position={[(index - totalDays / 2) * 1.2, 0, 0]}
            scale={[1, 1.5, 0.1]}
          >
            <boxGeometry />
            <meshStandardMaterial 
              color={index < currentDay ? "#4ade80" : index === currentDay ? "#60a5fa" : "#6b7280"} 
              emissive={index === currentDay ? "#60a5fa" : "#000000"}
              emissiveIntensity={index === currentDay ? 0.5 : 0}
              metalness={0.5}
              roughness={0.2}
            />
            <Text
              position={[0, 0, 0.06]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {index + 1}
            </Text>
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Use a reliable Unsplash marble texture
const MARBLE_TEXTURE_URL = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
const CITYSCAPE_TEXTURE_URL = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80';

// Board elements component to organize the 3D elements
const BoardElements = () => {
  const { gameState, selectTile } = useGameState();
  // Load textures with fallback
  let marbleTexture: any = null;
  let cityTexture: any = null;
  try {
    marbleTexture = useLoader(TextureLoader, MARBLE_TEXTURE_URL);
    cityTexture = useLoader(TextureLoader, CITYSCAPE_TEXTURE_URL);
  } catch (e) {
    marbleTexture = null;
    cityTexture = null;
  }
  
  // Value paths configuration
  const valueColors: Record<ValueType, string> = {
    innovation: '#9F7AEA', // Purple
    integrity: '#3E64FF', // Blue
    collaboration: '#38B2AC', // Teal
    excellence: '#FFD166', // Gold
    userFocus: '#FF6B6B', // Coral
  };
  
  // Generate game board paths
  const startPosition = new Vector3(-6, 0, 0);
  
  // Create paths for each value branch
  const paths = {
    start: [{ id: 'start', position: startPosition, type: 'start', connections: ['innovation-0', 'integrity-0'] }],
    innovation: generatePath(
      startPosition, 
      [[-2, 0, -2], [-1, 0, -4], [1, 0, -5], [3, 0, -4], [4, 0, -2]], 
      'innovation'
    ),
    integrity: generatePath(
      startPosition, 
      [[-2, 0, 2], [-1, 0, 4], [1, 0, 5], [3, 0, 4], [5, 0, 2]], 
      'integrity'
    ),
    collaboration: generatePath(
      new Vector3(4, 0, -2), 
      [[2, 0, 0], [4, 0, 2], [6, 0, 3]], 
      'collaboration'
    ),
    excellence: generatePath(
      new Vector3(5, 0, 2), 
      [[1, 0, 0], [0, 0, -2], [-2, 0, -3]], 
      'excellence'
    ),
    userFocus: generatePath(
      new Vector3(-2, 0, -3), 
      [[-2, 0, -1], [-4, 0, 0], [-6, 0, 0]], 
      'userFocus'
    ),
  };
  
  // All nodes combined
  const allNodes = [
    ...paths.start,
    ...paths.innovation,
    ...paths.integrity,
    ...paths.collaboration,
    ...paths.excellence,
    ...paths.userFocus
  ];
  
  // Handle node click
  const handleNodeClick = (node: { type: string; position: { x: number; y: number; z: number } }) => {
    selectTile(node.type, [node.position.x, node.position.y, node.position.z]);
  };
  
  return (
    <>
      {/* Cityscape background as a large curved mesh */}
      {cityTexture ? (
        <mesh position={[0, 10, -30]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[60, 60, 30, 64, 1, true, Math.PI / 2, Math.PI]} />
          <meshBasicMaterial map={cityTexture} side={2} transparent opacity={0.85} />
        </mesh>
      ) : null}
      {/* Lobby floor with marble texture or fallback color */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 36, 1, 1]} />
        {marbleTexture ? (
          <meshStandardMaterial map={marbleTexture} metalness={0.4} roughness={0.2} />
        ) : (
          <meshStandardMaterial color="#e0e0e0" metalness={0.4} roughness={0.2} />
        )}
      </mesh>
      {/* Grid overlay for the floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 36, 18, 18]} />
        <meshBasicMaterial color="#ffffff" opacity={0.07} transparent wireframe />
      </mesh>
      {/* 3D lobby props: reception desk, plants, elevator */}
      {/* Reception desk */}
      <mesh position={[0, 0.5, -14]}>
        <boxGeometry args={[6, 1, 1.5]} />
        <meshStandardMaterial color="#bfc9d1" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Plants */}
      <mesh position={[-10, 0.7, -14]}>
        <cylinderGeometry args={[0.5, 0.5, 1.4, 16]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
      <mesh position={[10, 0.7, -14]}>
        <cylinderGeometry args={[0.5, 0.5, 1.4, 16]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
      {/* Elevator */}
      <mesh position={[0, 1.2, 14]}>
        <boxGeometry args={[3, 2.4, 1.5]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Glass wall (back) */}
      <mesh position={[0, 2.5, -18]} rotation={[0, 0, 0]}>
        <boxGeometry args={[36, 5, 0.2]} />
        <meshPhysicalMaterial color="#b3e5fc" opacity={0.25} transparent transmission={0.7} />
      </mesh>
      {/* Raised, beveled board with glass/metal look */}
      <mesh
        receiveShadow
        castShadow
        position={[0, -0.05, 0]}
      >
        <boxGeometry args={[38, 1, 38]} />
        <meshPhysicalMaterial
          color="#232a34"
          metalness={0.7}
          roughness={0.15}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
          transmission={0.25}
          thickness={0.8}
          reflectivity={0.5}
        />
      </mesh>
      {/* Subtle grid overlay */}
      <mesh position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 36, 18, 18]} />
        <meshBasicMaterial color="#ffffff" opacity={0.07} transparent wireframe />
      </mesh>
      
      {/* Calendar system */}
      <CalendarSystem currentDay={gameState.currentDay} totalDays={gameState.totalDays} />
      
      {/* Game paths and nodes */}
      <group>
        {/* Draw connections between nodes */}
        {allNodes.map(node => (
          node.connections.map(targetId => {
            const target = allNodes.find(n => n.id === targetId);
            if (target) {
              return (
                <PathConnection 
                  key={`${node.id}-${targetId}`}
                  start={node.position}
                  end={target.position}
                  color={valueColors[(node.type as ValueType)] || "#4A5568"}
                />
              );
            }
            return null;
          })
        ))}
        
        {/* Draw nodes */}
        {allNodes.map(node => (
          node.id === 'start' ? (
            <GameTile
              key={node.id}
              position={[node.position.x, node.position.y, node.position.z]}
              color="#4ade80"
              type="start"
              onClick={() => handleNodeClick(node)}
            />
          ) : (
            <PathNode
              key={node.id}
              position={node.position}
              color={valueColors[(node.type as ValueType)] || "#4A5568"}
              type={node.type}
              onClick={() => handleNodeClick(node)}
              id={node.id}
              connections={node.connections}
            />
          )
        ))}
      </group>
      
      {/* Value zone labels */}
      <Text
        position={[-1, 0.2, -5]}
        rotation={[0, 0, 0]}
        fontSize={1.2}
        color={valueColors.innovation}
        anchorX="center"
        anchorY="middle"
      >
        Innovation
      </Text>
      
      <Text
        position={[-1, 0.2, 5]}
        rotation={[0, 0, 0]}
        fontSize={1.2}
        color={valueColors.integrity}
        anchorX="center"
        anchorY="middle"
      >
        Integrity
      </Text>
      
      <Text
        position={[6, 0.2, 1]}
        rotation={[0, 0, 0]}
        fontSize={1.2}
        color={valueColors.collaboration}
        anchorX="center"
        anchorY="middle"
      >
        Collaboration
      </Text>
      
      <Text
        position={[0, 0.2, -2]}
        rotation={[0, 0, 0]}
        fontSize={1.2}
        color={valueColors.excellence}
        anchorX="center"
        anchorY="middle"
      >
        Excellence
      </Text>
      
      <Text
        position={[-5, 0.2, -1]}
        rotation={[0, 0, 0]}
        fontSize={1.2}
        color={valueColors.userFocus}
        anchorX="center"
        anchorY="middle"
      >
        User Focus
      </Text>
      
      <Text
        position={[-6, 0.2, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.8}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        START
      </Text>
      
      {/* Player tokens */}
      {gameState.players.map((player, index) => (
        <PlayerToken
          key={player.id}
          player={player}
        />
      ))}
    </>
  );
};

// Path connection component (now using TubeGeometry for 3D tubes)
const PathConnection = ({ start, end, color }: { start: { x: number; y: number; z: number }; end: { x: number; y: number; z: number }; color: string; }) => {
  // Create a smooth curve between start and end
  const curve = new CatmullRomCurve3([
    new Vector3(start.x, start.y + 0.05, start.z),
    new Vector3((start.x + end.x) / 2, Math.max(start.y, end.y) + 0.5, (start.z + end.z) / 2),
    new Vector3(end.x, end.y + 0.05, end.z)
  ]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 20, 0.15, 16, false]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} transparent opacity={0.8} />
    </mesh>
  );
};

// Main GameBoard component
const GameBoard: React.FC = () => {
  const { gameState } = useGameState();
  const controlsRef = useRef(null);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([8, 10, 8]);
  
  return (
    <div className="w-full h-full">
      <Canvas shadows className="w-full h-full">
        <color attach="background" args={['#1a2030']} />
        
        <PerspectiveCamera
          makeDefault
          position={cameraPosition}
          fov={50}
        />
        
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
        />
        
        <Environment />
        <BoardElements />
      </Canvas>
    </div>
  );
};

export default GameBoard;