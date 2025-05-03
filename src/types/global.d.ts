// Type definitions for three.js related libraries
declare module '@react-three/fiber';
declare module '@react-three/drei';
declare module 'framer-motion';

// Define JSX custom elements for React Three Fiber
declare namespace JSX {
  interface IntrinsicElements {
    group: any;
    mesh: any;
    ambientLight: any;
    pointLight: any;
    spotLight: any;
    sphereGeometry: any;
    boxGeometry: any;
    octahedronGeometry: any;
    dodecahedronGeometry: any;
    torusGeometry: any;
    meshStandardMaterial: any;
  }
} 