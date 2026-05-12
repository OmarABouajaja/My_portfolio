import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

type Transaction = { id: number; title: string; amount: number; type: "income" | "expense" };
type TelemetryLog = { id: string; level: 'info' | 'warn' | 'error' | 'success'; module: string };

interface DataNexus3DProps {
  transactions: Transaction[];
  logs: TelemetryLog[];
}

const FinanceTower = ({ data, position }: { data: Transaction; position: [number, number, number] }) => {
  const height = Math.max(0.5, Math.log10(data.amount) * 1.5);
  const color = data.type === 'income' ? '#10b981' : '#ef4444'; // Success green vs Destructive red
  const yPos = position[1] + height / 2;

  return (
    <group position={[position[0], yPos, position[2]]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      {/* Wireframe overlay for cyber look */}
      <mesh>
        <boxGeometry args={[0.81, height + 0.01, 0.81]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

const TelemetryTower = ({ log, position }: { log: TelemetryLog; position: [number, number, number] }) => {
  const height = log.level === 'error' ? 3 : log.level === 'warn' ? 2 : 1;
  const color = log.level === 'error' ? '#ef4444' : log.level === 'warn' ? '#f59e0b' : log.level === 'success' ? '#10b981' : '#3b82f6';
  const yPos = position[1] + height / 2;

  return (
    <group position={[position[0], yPos, position[2]]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.4, height, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.32, 0.42, height + 0.05, 6]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

const GridFloor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
    <planeGeometry args={[50, 50, 50, 50]} />
    <meshBasicMaterial color="#00ffcc" wireframe transparent opacity={0.05} />
  </mesh>
);

export const DataNexus3D = ({ transactions, logs }: DataNexus3DProps) => {
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-border/50 relative bg-black">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-primary font-display font-bold text-lg tracking-widest uppercase">Data Hub</h3>
        <p className="text-xs text-muted-foreground font-mono">Hyper-Dimensional Topography Active</p>
      </div>
      
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-[10px] font-mono text-muted-foreground flex gap-4">
        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-success rounded-sm" /> Income</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-destructive rounded-sm" /> Expense / Error</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-warning rounded-sm" /> Warning</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-sm" /> Sys Log</span>
      </div>

      <Canvas camera={{ position: [10, 8, 10], fov: 45 }} shadows>
        <color attach="background" args={['#020202']} />
        <fog attach="fog" args={['#020202', 10, 35]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 10, 0]} intensity={1.5} color="#00ffcc" castShadow />
        
        <GridFloor />
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        {/* Render Finance Cityscape (Left Side) */}
        <group position={[-4, 0, 0]}>
          <Text position={[0, 0.1, -4]} rotation={[-Math.PI/2, 0, 0]} fontSize={1} color="#ffffff" fillOpacity={0.2}>FINANCE</Text>
          {transactions.map((tx, i) => {
            const row = Math.floor(i / 5);
            const col = i % 5;
            return <FinanceTower key={`tx-${tx.id}-${i}`} data={tx} position={[col * 1.5 - 3, 0, row * 1.5 - 2]} />;
          })}
        </group>

        {/* Render Telemetry Cityscape (Right Side) */}
        <group position={[4, 0, 0]}>
          <Text position={[0, 0.1, -4]} rotation={[-Math.PI/2, 0, 0]} fontSize={1} color="#ffffff" fillOpacity={0.2}>TELEMETRY</Text>
          {logs.slice(0, 30).map((log, i) => { // limit to 30 logs to save performance
            const row = Math.floor(i / 5);
            const col = i % 5;
            return <TelemetryTower key={`log-${log.id}-${i}`} log={log} position={[col * 1.5 - 3, 0, row * 1.5 - 2]} />;
          })}
        </group>

        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          maxPolarAngle={Math.PI / 2 - 0.05} // prevent going below ground
          minDistance={2}
          maxDistance={30}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
