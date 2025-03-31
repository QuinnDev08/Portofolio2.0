import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useFBX, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import "./main_title.css";

const basketballPath = "../../../../public/Basketball_ball.fbx";


// Verbeterde 3D-modelcomponent die FBX-loader gebruikt
function Model({ url }: { url: string }) {
  try {
    const fbx = useFBX(url);
    const modelRef = useRef<THREE.Group>(null);

    // Apply orange material to the basketball
    fbx.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        
        // Create a new orange material
        const orangeMaterial = new THREE.MeshStandardMaterial({
          color: "#FF6600", // Orange color
          roughness: 0.7,
          metalness: 0.2,
        });
        
        // Apply the orange material to the mesh
        child.material = orangeMaterial;
      }
    });

    useFrame((_, delta) => {
      if (modelRef.current) {
        modelRef.current.rotation.y += delta * 1.5;
      }
    });

    return (
      <primitive
        ref={modelRef}
        object={fbx}
        scale={0.01}
        position={[0, -1, 0]}
      />
    );
  } catch (err) {
    console.error("Fout bij het laden van FBX-model:", err);
    return null;
  }
}

// Laadschermcomponent
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Draaiende animatie voor laadscherm
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#ff7e5f" wireframe />
      <Html center>
        <div
          style={{
            color: "white",
            background: "rgba(0,0,0,0.5)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Model laden...
        </div>
      </Html>
    </mesh>
  );
}

// Hoofdcomponent voor de titel en 3D-weergave
function Main_title() {
  return (
    <div id="main-title-containerS">
      <h1 id="main-title-text">
        Ik ben Quinn Otto en ik ben een Web Developer! En ik maak interactieve
        websites!
      </h1>

      {/* 3D Canvas-container */}
      <div
        style={{
          height: "400px",
          width: "100%",
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={Math.PI / 2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
            castShadow={false}
            shadow-mapSize-width={0}
            shadow-mapSize-height={0}
          />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

          {/* Omgevingsverlichting voor betere visuals */}
          <Environment preset="sunset" background={false} />

          <Suspense fallback={<LoadingFallback />}>
            <Model url={basketballPath} />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
            />
          </Suspense>
        </Canvas>

        {/* Gebruikersinteractie-instructies */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            color: "white",
            fontSize: "12px",
            background: "rgba(0,0,0,0.5)",
            padding: "5px 10px",
            borderRadius: "4px",
          }}
        >
          Sleep om te roteren • Scroll om te zoomen • Klik met rechtermuisknop
          om te pannen
        </div>
      </div>
    </div>
  );
}

export default Main_title;