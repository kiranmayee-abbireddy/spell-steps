import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, Float, ContactShadows, OrbitControls, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../context/GameContext';
import { fetchWordDetails, WordDetails } from '../utils/wordValidator';

type TreeType = 'pine' | 'round' | 'bare' | 'crystal';
type ParticleType = 'fireflies' | 'leaves' | 'snow' | 'embers' | 'magic';

interface ThemeDef { water: string, waterEmissive: string, bank: string, tree1: string, tree2: string, rayleigh: number, background: string, treeType: TreeType, particleType: ParticleType }

const initialThemes: ThemeDef[] = [
    // Level 1: Summer/Grass
    { water: "#0ea5e9", waterEmissive: "#0284c7", bank: "#166534", tree1: "#22c55e", tree2: "#4ade80", rayleigh: 2, background: '#0f172a', treeType: 'pine', particleType: 'fireflies' },
    // Level 2: Autumn
    { water: "#a855f7", waterEmissive: "#9333ea", bank: "#92400e", tree1: "#ea580c", tree2: "#f59e0b", rayleigh: 4, background: '#1e1b4b', treeType: 'round', particleType: 'leaves' },
    // Level 3: Winter
    { water: "#38bdf8", waterEmissive: "#0284c7", bank: "#e2e8f0", tree1: "#94a3b8", tree2: "#cbd5e1", rayleigh: 0.5, background: '#0f172a', treeType: 'pine', particleType: 'snow' },
    // Level 4: Volcanic
    { water: "#ef4444", waterEmissive: "#dc2626", bank: "#292524", tree1: "#57534e", tree2: "#78716c", rayleigh: 8, background: '#450a0a', treeType: 'bare', particleType: 'embers' },
    // Level 5: Magic
    { water: "#ec4899", waterEmissive: "#db2777", bank: "#312e81", tree1: "#8b5cf6", tree2: "#d946ef", rayleigh: 3, background: '#172554', treeType: 'crystal', particleType: 'magic' },
];

const themeComponents = {
    waters: [
        { water: "#0ea5e9", waterEmissive: "#0284c7", background: '#0f172a' }, // Blue -> Navy
        { water: "#a855f7", waterEmissive: "#9333ea", background: '#1e1b4b' }, // Purple -> Dark Indigo
        { water: "#38bdf8", waterEmissive: "#0284c7", background: '#082f49' }, // Light Blue -> Dark Sky
        { water: "#ef4444", waterEmissive: "#dc2626", background: '#450a0a' }, // Red -> Dark Red
        { water: "#ec4899", waterEmissive: "#db2777", background: '#4c1d95' }, // Pink -> Dark Violet
        { water: "#22c55e", waterEmissive: "#16a34a", background: '#022c22' }, // Green -> Dark Emerald
        { water: "#f59e0b", waterEmissive: "#d97706", background: '#451a03' }  // Orange -> Dark Brown
    ],
    banks: ["#166534", "#92400e", "#e2e8f0", "#292524", "#312e81", "#1e3a8a", "#064e3b"],
    trees: [
        { tree1: "#22c55e", tree2: "#4ade80" },
        { tree1: "#ea580c", tree2: "#f59e0b" },
        { tree1: "#94a3b8", tree2: "#cbd5e1" },
        { tree1: "#57534e", tree2: "#78716c" },
        { tree1: "#8b5cf6", tree2: "#d946ef" },
        { tree1: "#14b8a6", tree2: "#2dd4bf" },
        { tree1: "#f43f5e", tree2: "#fb7185" }
    ],
    treeTypes: ['pine', 'round', 'bare', 'crystal'] as TreeType[],
    particleTypes: ['fireflies', 'leaves', 'snow', 'embers', 'magic'] as ParticleType[]
};

const getThemeForLevel = (level: number): ThemeDef => {
    if (level <= 5) return initialThemes[level - 1];

    // Procedural generation using a seed based on level so it's consistent for that level
    const pseudoRandom = (seed: number) => {
        let x = Math.sin(seed * 9999) * 10000;
        return x - Math.floor(x);
    };

    const s = level * 1337;

    return {
        ...themeComponents.waters[Math.floor(pseudoRandom(s) * themeComponents.waters.length)],
        bank: themeComponents.banks[Math.floor(pseudoRandom(s + 1) * themeComponents.banks.length)],
        ...themeComponents.trees[Math.floor(pseudoRandom(s + 2) * themeComponents.trees.length)],
        rayleigh: 0.5 + pseudoRandom(s + 3) * 7.5,
        treeType: themeComponents.treeTypes[Math.floor(pseudoRandom(s + 5) * themeComponents.treeTypes.length)],
        particleType: themeComponents.particleTypes[Math.floor(pseudoRandom(s + 6) * themeComponents.particleTypes.length)]
    };
};

const River = ({ waterColor, emissiveColor }: { waterColor: string, emissiveColor: string }) => {
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
                color={waterColor}
                roughness={0.0}
                metalness={0.8}
                transparent
                opacity={0.9}
                emissive={emissiveColor}
            />
        </mesh>
    );
};

const Tree = ({ position, scale = 1, color1, color2, type }: { position: [number, number, number], scale?: number, color1: string, color2: string, type: TreeType }) => {
    return (
        <group position={position} scale={scale}>
            {/* Trunk */}
            {type !== 'crystal' && (
                <mesh position={[0, 0.5, 0]} castShadow>
                    <cylinderGeometry args={[0.2, 0.3, 1]} />
                    <meshStandardMaterial color={type === 'bare' ? "#292524" : "#5c4033"} roughness={0.9} />
                </mesh>
            )}

            {type === 'pine' && (
                <>
                    {/* Leaves - Bottom */}
                    <mesh position={[0, 1.2, 0]} castShadow>
                        <coneGeometry args={[1, 1.5, 8]} />
                        <meshStandardMaterial color={color1} roughness={0.7} />
                    </mesh>
                    {/* Leaves - Top */}
                    <mesh position={[0, 1.8, 0]} castShadow>
                        <coneGeometry args={[0.8, 1.2, 8]} />
                        <meshStandardMaterial color={color2} roughness={0.7} />
                    </mesh>
                </>
            )}

            {type === 'round' && (
                <>
                    <mesh position={[0, 1.5, 0]} castShadow>
                        <sphereGeometry args={[1.2, 16, 16]} />
                        <meshStandardMaterial color={color1} roughness={0.8} />
                    </mesh>
                    <mesh position={[0.5, 1.8, 0.5]} castShadow scale={0.6}>
                        <sphereGeometry args={[1, 16, 16]} />
                        <meshStandardMaterial color={color2} roughness={0.8} />
                    </mesh>
                    <mesh position={[-0.5, 1.6, -0.4]} castShadow scale={0.7}>
                        <sphereGeometry args={[1, 16, 16]} />
                        <meshStandardMaterial color={color2} roughness={0.8} />
                    </mesh>
                </>
            )}

            {type === 'bare' && (
                <>
                    <mesh position={[0.3, 1.2, 0.2]} rotation={[0, 0, -0.5]} castShadow>
                        <cylinderGeometry args={[0.05, 0.1, 1]} />
                        <meshStandardMaterial color="#292524" roughness={0.9} />
                    </mesh>
                    <mesh position={[-0.3, 1.4, -0.1]} rotation={[0.2, 0, 0.6]} castShadow>
                        <cylinderGeometry args={[0.04, 0.08, 0.8]} />
                        <meshStandardMaterial color="#292524" roughness={0.9} />
                    </mesh>
                </>
            )}

            {type === 'crystal' && (
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh position={[0, 1.5, 0]} castShadow>
                        <octahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial color={color1} roughness={0.2} metalness={0.8} emissive={color1} emissiveIntensity={0.2} />
                    </mesh>
                    <mesh position={[0, 0.5, 0]} castShadow scale={0.5}>
                        <octahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial color={color2} roughness={0.2} metalness={0.8} emissive={color2} emissiveIntensity={0.4} />
                    </mesh>
                </Float>
            )}
        </group>
    );
};

const Bank = ({ position, color, side, tree1, tree2, treeType }: { position: [number, number, number], color: string, side: 'left' | 'right', tree1: string, tree2: string, treeType: TreeType }) => {
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
            <Tree position={[side === 'left' ? 2 : -2, 0.5, -5]} scale={1.2} color1={tree1} color2={tree2} type={treeType} />
            <Tree position={[side === 'left' ? 0 : 0, 0.5, -2]} scale={0.8} color1={tree1} color2={tree2} type={treeType} />
            <Tree position={[side === 'left' ? 3 : -3, 0.5, 4]} scale={1.5} color1={tree1} color2={tree2} type={treeType} />
            <Tree position={[side === 'left' ? 1 : -1, 0.5, 8]} scale={1.1} color1={tree1} color2={tree2} type={treeType} />

            {/* Additional background trees */}
            <Tree position={[side === 'left' ? 5 : -5, 0.5, -15]} scale={1.6} color1={tree1} color2={tree2} type={treeType} />
            <Tree position={[side === 'left' ? 2 : -2, 0.5, -25]} scale={1.3} color1={tree1} color2={tree2} type={treeType} />
            <Tree position={[side === 'left' ? 8 : -8, 0.5, 15]} scale={1.8} color1={tree1} color2={tree2} type={treeType} />
            <Tree position={[side === 'left' ? 4 : -4, 0.5, 30]} scale={1.4} color1={tree1} color2={tree2} type={treeType} />
            <Tree position={[side === 'left' ? -5 : 5, 0.5, 40]} scale={1.5} color1={tree1} color2={tree2} type={treeType} />
            <Tree position={[side === 'left' ? 2 : -2, 0.5, 50]} scale={1.2} color1={tree1} color2={tree2} type={treeType} />
        </group>
    );
};

const SteppingStone = ({ position, width, isSpecial, word }: { position: [number, number, number], width: number, isSpecial: boolean, word: string }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [details, setDetails] = useState<WordDetails | null>(null);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (!showTooltip) {
            setShowTooltip(true);
            if (!details) {
                setLoading(true);
                const fetchedDetails = await fetchWordDetails(word);
                setDetails(fetchedDetails);
                setLoading(false);
            }
        } else {
            setShowTooltip(false);
        }
    };

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
                    <div className="relative pointer-events-auto">
                        <div
                            onClick={handleClick}
                            className="bg-white/90 px-3 py-1 rounded-lg text-sm font-bold text-sky-900 shadow-md cursor-pointer hover:bg-white hover:scale-110 active:scale-95 transition-all outline-none"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            {word}
                        </div>
                        {showTooltip && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] text-left border-2 border-sky-300 pointer-events-none z-[9999]">
                                {loading ? (
                                    <div className="text-xs text-sky-600 animate-pulse text-center font-bold">Unlocking magic... ✨</div>
                                ) : details ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="font-extrabold text-sky-900 text-lg capitalize border-b-2 border-sky-100 pb-1">{details.word}</div>
                                        <div className="text-sm text-gray-700 italic leading-snug font-medium">"{details.meaning}"</div>
                                        {details.synonyms.length > 0 && (
                                            <div className="text-xs text-green-700 bg-green-50 p-1.5 rounded-md mt-1">
                                                <span className="font-black">SYN:</span> {details.synonyms.join(', ')}
                                            </div>
                                        )}
                                        {details.antonyms.length > 0 && (
                                            <div className="text-xs text-red-700 bg-red-50 p-1.5 rounded-md mt-1">
                                                <span className="font-black">ANT:</span> {details.antonyms.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-xs font-bold text-gray-500 text-center">Uncharted magic. No details found!</div>
                                )}
                                {/* Triangle pointer */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-8 border-transparent border-t-sky-300"></div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[7px] border-transparent border-t-white"></div>
                            </div>
                        )}
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
    const { stones, targetPosition, currentPosition, character, gameStatus, level } = state;

    const theme = getThemeForLevel(level);

    // Map Game Coordinates (0-100) to 3D Space (-10 to 10 on X axis)
    const mapPosition = (p: number) => -10 + (p / targetPosition) * 20;

    return (
        <>
            <color attach="background" args={[theme.background]} />
            <fog attach="fog" args={[theme.background, 15, 45]} />

            {/* Magical Environment */}
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

            {/* Particles / Weather effects */}
            {theme.particleType === 'leaves' && <Sparkles count={150} scale={40} size={8} speed={0.8} opacity={0.8} color="#ea580c" position={[0, 5, 0]} />}
            {theme.particleType === 'snow' && <Sparkles count={400} scale={50} size={5} speed={0.5} opacity={0.6} color="#ffffff" position={[0, 10, 0]} />}
            {theme.particleType === 'embers' && <Sparkles count={200} scale={30} size={7} speed={1.5} opacity={0.9} color="#ef4444" position={[0, 2, 0]} />}
            {theme.particleType === 'magic' && <Sparkles count={200} scale={35} size={10} speed={0.3} opacity={0.6} color="#ec4899" position={[0, 5, 0]} />}
            {theme.particleType === 'fireflies' && <Sparkles count={150} scale={25} size={6} speed={0.4} opacity={0.6} color="#fde047" position={[0, 2, 0]} />}

            {/* Environment for nice reflections */}
            <Environment preset="night" />

            {/* River */}
            <River waterColor={theme.water} emissiveColor={theme.waterEmissive} />

            {/* Starting and Ending Banks */}
            <Bank position={[-15, -0.5, 0]} color={theme.bank} side="left" tree1={theme.tree1} tree2={theme.tree2} treeType={theme.treeType} />
            <Bank position={[15, -0.5, 0]} color={theme.bank} side="right" tree1={theme.tree1} tree2={theme.tree2} treeType={theme.treeType} />

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
        <div className="absolute inset-0">
            <Canvas shadows camera={{ position: [0, 6, 14], fov: 45 }}>
                <Scene />
            </Canvas>
        </div>
    );
};

export default GameScene3D;
