import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, Float, ContactShadows, OrbitControls, Sky, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../context/GameContext';

const River = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);

    useFrame((state) => {
        if (materialRef.current) {
            const time = state.clock.getElapsedTime();
            materialRef.current.emissiveIntensity = Math.sin(time * 2) * 0.2 + 0.3;
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial
                ref={materialRef}
                color="#0ea5e9"
                roughness={0.0}
                metalness={0.8}
                transparent
                opacity={0.9}
                emissive="#0284c7"
            />
        </mesh>
    );
};

const Tree = ({ position, scale = 1 }: { position: [number, number, number], scale?: number }) => (
    <group position={position} scale={scale}>
        {/* Trunk */}
        <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 1]} />
            <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        {/* Leaves - Bottom */}
        <mesh position={[0, 1.2, 0]} castShadow>
            <coneGeometry args={[1, 1.5, 8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.7} />
        </mesh>
        {/* Leaves - Top */}
        <mesh position={[0, 1.8, 0]} castShadow>
            <coneGeometry args={[0.8, 1.2, 8]} />
            <meshStandardMaterial color="#4ade80" roughness={0.7} />
        </mesh>
    </group>
);

const Bank = ({ position, color, side }: { position: [number, number, number], color: string, side: 'left' | 'right' }) => {
    const depth = 500;
    const width = 250;
    const meshX = side === 'left' ? 5 - width / 2 : -5 + width / 2;

    return (
        <group position={position}>
            <mesh receiveShadow castShadow position={[meshX, -0.5, 0]}>
                <boxGeometry args={[width, 2, depth]} />
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>

            {/* Add some random trees */}
            <Tree position={[side === 'left' ? 2 : -2, 0.5, -5]} scale={1.2} />
            <Tree position={[side === 'left' ? 0 : 0, 0.5, -2]} scale={0.8} />
            <Tree position={[side === 'left' ? 3 : -3, 0.5, 4]} scale={1.5} />
            <Tree position={[side === 'left' ? 1 : -1, 0.5, 8]} scale={1.1} />

            {/* Additional background trees */}
            <Tree position={[side === 'left' ? 5 : -5, 0.5, -15]} scale={1.6} />
            <Tree position={[side === 'left' ? 2 : -2, 0.5, -25]} scale={1.3} />
            <Tree position={[side === 'left' ? 8 : -8, 0.5, 15]} scale={1.8} />
            <Tree position={[side === 'left' ? 4 : -4, 0.5, 30]} scale={1.4} />
            <Tree position={[side === 'left' ? -5 : 5, 0.5, 40]} scale={1.5} />
            <Tree position={[side === 'left' ? 2 : -2, 0.5, 50]} scale={1.2} />
        </group>
    );
};

const SteppingStone = ({ position, width, isSpecial, word }: { position: [number, number, number], width: number, isSpecial: boolean, word: string }) => {
    return (
        <group position={position}>
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.05, 0.05]}>
                <mesh receiveShadow castShadow position={[0, 0, 0]}>
                    <cylinderGeometry args={[width, width, 0.4, 32]} />
                    <meshStandardMaterial
                        color={isSpecial ? '#f59e0b' : '#78716c'}
                        roughness={0.6}
                        metalness={isSpecial ? 0.3 : 0.1}
                        emissive={isSpecial ? '#f59e0b' : '#000000'}
                        emissiveIntensity={isSpecial ? 0.4 : 0}
                    />
                </mesh>
                <Html position={[0, 0.6, 0]} center zIndexRange={[100, 0]}>
                    <div className="bg-white/90 px-2 py-0.5 rounded text-xs font-semibold text-gray-800 shadow-sm whitespace-nowrap pointer-events-none">
                        {word}
                    </div>
                </Html>
            </Float>
        </group>
    );
};

const Character3D = ({ position, sprite, name, isPlaying }: { position: [number, number, number], sprite: string, name: string, isPlaying: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Smooth movement towards the target position
            groupRef.current.position.lerp(new THREE.Vector3(...position), 0.1);

            if (isPlaying) {
                // Simple breathing/walking animation
                const time = state.clock.getElapsedTime();
                groupRef.current.position.y = position[1] + Math.abs(Math.sin(time * 5)) * 0.2;
            }
        }
    });

    return (
        <group ref={groupRef} position={position}>
            <Html position={[0, 0.5, 0]} center zIndexRange={[100, 0]}>
                <div className="flex flex-col items-center pointer-events-none transform -translate-y-4">
                    <div className="bg-white/90 px-2 py-0.5 rounded-full text-xs font-bold text-gray-800 shadow-md mb-1 whitespace-nowrap">
                        {name}
                    </div>
                    <div className="text-5xl filter drop-shadow-md">
                        {sprite}
                    </div>
                </div>
            </Html>
        </group>
    );
};

const Scene = () => {
    const { state } = useGame();
    const { stones, targetPosition, currentPosition, character, gameStatus } = state;

    // Map Game Coordinates (0-100) to 3D Space (-10 to 10 on X axis)
    const mapPosition = (p: number) => -10 + (p / targetPosition) * 20;

    return (
        <>
            <color attach="background" args={['#0f172a']} />

            {/* Magical Sky & Environment */}
            <Sky sunPosition={[10, -2, -10]} turbidity={10} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.8} />
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

            {/* Lighting */}
            <ambientLight intensity={0.4} color="#38bdf8" />
            <directionalLight
                position={[10, 20, 10]}
                intensity={1.2}
                color="#fef08a"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
            />
            <pointLight position={[-10, 10, -10]} intensity={1} color="#a855f7" />

            {/* Fireflies / Magic Sparkles */}
            <Sparkles count={150} scale={25} size={6} speed={0.4} opacity={0.6} color="#fde047" position={[0, 2, 0]} />

            {/* Environment for nice reflections */}
            <Environment preset="night" />

            {/* River */}
            <River />

            {/* Starting and Ending Banks */}
            <Bank position={[-15, -0.5, 0]} color="#166534" side="left" />
            <Bank position={[15, -0.5, 0]} color="#166534" side="right" />

            {/* Stepping Stones */}
            {stones.map((stone) => {
                const xPos = mapPosition(stone.position);
                // Stone size corresponds to difficulty/length - let's map size 4-8 to radius 0.6-1.2
                const radius = Math.max(0.6, Math.min(1.2, stone.size * 0.15));

                return (
                    <SteppingStone
                        key={stone.id}
                        position={[xPos, -0.2, 0]}
                        width={radius}
                        isSpecial={stone.special || false}
                        word={stone.word}
                    />
                );
            })}

            {/* Character */}
            <Character3D
                position={[mapPosition(currentPosition), 0.5, 0]}
                sprite={character.sprite}
                name={character.name}
                isPlaying={gameStatus === 'playing'}
            />

            {/* Water reflection/shadows */}
            <ContactShadows position={[0, -0.49, 0]} opacity={0.6} scale={40} blur={1.5} far={10} />

            {/* Camera controls */}
            <OrbitControls
                enableZoom={true}
                minDistance={5}
                maxDistance={25}
                enablePan={false}
                maxPolarAngle={Math.PI / 2 - 0.1} // Prevent looking from below
                minPolarAngle={Math.PI / 6}     // Prevent looking top-down
                minAzimuthAngle={-Math.PI / 4}  // Restrict rotation left
                maxAzimuthAngle={Math.PI / 4}   // Restrict rotation right
                target={[mapPosition(currentPosition), 0, 0]} // Camera follows character slightly
            />
        </>
    );
};

const GameScene3D = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas shadows camera={{ position: [0, 6, 14], fov: 45 }}>
                <Scene />
            </Canvas>
        </div>
    );
};

export default GameScene3D;
