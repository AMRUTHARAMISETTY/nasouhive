import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Float,
  PerspectiveCamera,
  Preload,
  Sparkles,
  Text,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { CatmullRomCurve3, MathUtils, TubeGeometry, Vector3 } from "three";
import SceneCanvas from "./SceneCanvas";

const stageStops = [0.09, 0.5, 0.9];
const nodeColor = ["#9fe9c8", "#d7f6e9", "#e5d8c7"];
const packageOffsets = [0, 0.23, 0.47, 0.73];

function FactoryModel(props) {
  return (
    <group {...props}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.25, 0.8, 1.2]} />
        <meshStandardMaterial color="#e6ecea" metalness={0.42} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.08, 0]} castShadow>
        <boxGeometry args={[0.9, 0.55, 0.92]} />
        <meshStandardMaterial color="#255849" metalness={0.65} roughness={0.2} />
      </mesh>
      {[-0.34, 0, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.48, 0.62]}>
          <boxGeometry args={[0.18, 0.18, 0.02]} />
          <meshBasicMaterial color="#8bf1cb" />
        </mesh>
      ))}
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[x, 1.75, -0.2]} castShadow>
          <cylinderGeometry args={[0.13, 0.18, 1.2, 18]} />
          <meshStandardMaterial color="#d9e4dd" metalness={0.5} roughness={0.2} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.08, 48]} />
        <meshStandardMaterial color="#112a23" roughness={0.7} metalness={0.25} />
      </mesh>
    </group>
  );
}

function StoreModel(props) {
  return (
    <group {...props}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.2, 0.85, 1.05]} />
        <meshStandardMaterial color="#e5d8c7" metalness={0.18} roughness={0.34} />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[1.35, 0.25, 1.15]} />
        <meshStandardMaterial color="#255849" metalness={0.58} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.62, 0.56]}>
        <boxGeometry args={[0.4, 0.48, 0.05]} />
        <meshBasicMaterial color="#97e2c2" />
      </mesh>
      {[-0.38, 0, 0.38].map((x) => (
        <mesh key={x} position={[x, 1.1, 0.6]}>
          <boxGeometry args={[0.18, 0.1, 0.03]} />
          <meshBasicMaterial color="#d9f5e7" />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <cylinderGeometry args={[1.08, 1.08, 0.08, 48]} />
        <meshStandardMaterial color="#112a23" roughness={0.7} metalness={0.25} />
      </mesh>
    </group>
  );
}

function CustomerModel(props) {
  return (
    <group {...props}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial color="#e6ecea" metalness={0.25} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.14, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshStandardMaterial color="#255849" metalness={0.6} roughness={0.16} />
      </mesh>
      <mesh position={[0, 0.6, 0.52]}>
        <boxGeometry args={[0.28, 0.42, 0.06]} />
        <meshBasicMaterial color="#93efc8" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.98, 0.98, 0.08, 48]} />
        <meshStandardMaterial color="#112a23" roughness={0.7} metalness={0.25} />
      </mesh>
    </group>
  );
}

function StageNode({ index, position, label, children, ringRef }) {
  return (
    <Float speed={1.25} rotationIntensity={0.08} floatIntensity={0.2}>
      <group position={position}>
        <mesh
          ref={ringRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.14, 0]}
        >
          <torusGeometry args={[1.58, 0.09, 22, 84]} />
          <meshStandardMaterial
            color={nodeColor[index]}
            emissive={nodeColor[index]}
            emissiveIntensity={0.55}
            transparent
            opacity={0.78}
          />
        </mesh>
        {children}
        <Text
          position={[0, 1.95, 0]}
          fontSize={0.38}
          letterSpacing={0.04}
          color="#eef6f1"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function HeroScene() {
  const rig = useRef({ sweep: 0, altitude: 0, glow: 0.45, focus: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const stageRings = useRef([]);
  const packageRefs = useRef([]);
  const pulseRefs = useRef([]);
  const tubeRef = useRef(null);
  const groupRef = useRef(null);

  const curve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(-8.4, 0.25, 2.4),
        new Vector3(-5.5, 0.7, 1.2),
        new Vector3(-2.4, 0.35, -1.45),
        new Vector3(0, 0.55, -0.4),
        new Vector3(3.15, 0.45, 1.55),
        new Vector3(6.8, 0.28, -0.2),
        new Vector3(8.3, 0.36, -1.85),
      ]),
    [],
  );

  const tubeGeometry = useMemo(() => new TubeGeometry(curve, 220, 0.11, 18, false), [curve]);
  const glowGeometry = useMemo(() => new TubeGeometry(curve, 220, 0.2, 18, false), [curve]);

  useEffect(() => {
    const onMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useLayoutEffect(() => {
    const timeline = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });

    timeline
      .to(rig.current, { sweep: 0.34, altitude: 0.28, glow: 0.9, focus: 0.32, duration: 4.5 })
      .to(rig.current, { sweep: 0.76, altitude: 0.62, glow: 1.25, focus: 0.82, duration: 4.8 })
      .to(rig.current, { sweep: 1, altitude: 0.12, glow: 0.65, focus: 1, duration: 3.8 });

    return () => timeline.kill();
  }, []);

  useFrame(({ camera, clock }, delta) => {
    const elapsed = clock.elapsedTime;
    const mouseX = mouse.current.x;
    const mouseY = mouse.current.y;
    const drift = Math.sin(elapsed * 0.62) * 0.18;

    groupRef.current.rotation.y = MathUtils.damp(groupRef.current.rotation.y, mouseX * 0.16, 4.2, delta);
    groupRef.current.rotation.x = MathUtils.damp(groupRef.current.rotation.x, -mouseY * 0.06, 4.2, delta);
    groupRef.current.position.y = MathUtils.damp(groupRef.current.position.y, -1 + drift, 3.2, delta);

    const baseX = -5.8 + rig.current.sweep * 8.4;
    const baseY = 3 + rig.current.altitude * 1.5 + mouseY * 0.3;
    const baseZ = 12.2 - rig.current.sweep * 2.5 + Math.abs(mouseX) * 0.3;
    camera.position.x = MathUtils.damp(camera.position.x, baseX + mouseX * 1.1, 3.2, delta);
    camera.position.y = MathUtils.damp(camera.position.y, baseY, 3.2, delta);
    camera.position.z = MathUtils.damp(camera.position.z, baseZ, 3.2, delta);

    const focusPoint = curve.getPointAt((rig.current.focus * 0.84 + 0.08) % 1);
    camera.lookAt(focusPoint.x + mouseX * 0.4, focusPoint.y + 1.2 + mouseY * 0.2, focusPoint.z);

    if (tubeRef.current) {
      tubeRef.current.material.emissiveIntensity = MathUtils.damp(
        tubeRef.current.material.emissiveIntensity,
        0.5 + Math.sin(elapsed * 2.6) * 0.1 + rig.current.glow * 0.55,
        3.8,
        delta,
      );
    }

    packageRefs.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      const t = (elapsed * 0.08 + rig.current.sweep * 0.18 + packageOffsets[index]) % 1;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      mesh.position.copy(point);
      mesh.position.y += 0.15 + Math.sin(elapsed * 2 + index) * 0.06;
      mesh.lookAt(point.clone().add(tangent));
      mesh.rotation.z += delta * 0.65;
    });

    stageRings.current.forEach((ring, index) => {
      if (!ring) {
        return;
      }

      const closestArrival = packageOffsets.reduce((closest, offset) => {
        const packageT = (elapsed * 0.08 + rig.current.sweep * 0.18 + offset) % 1;
        const distance = Math.min(
          Math.abs(packageT - stageStops[index]),
          1 - Math.abs(packageT - stageStops[index]),
        );
        return Math.min(closest, distance);
      }, 1);

      const intensity = Math.max(0, 1 - closestArrival / 0.12);
      ring.material.emissiveIntensity = MathUtils.damp(
        ring.material.emissiveIntensity,
        0.45 + intensity * 2.7,
        4.4,
        delta,
      );
      const scale = 1 + intensity * 0.18;
      ring.scale.setScalar(MathUtils.damp(ring.scale.x, scale, 4.2, delta));
    });

    pulseRefs.current.forEach((pulse, index) => {
      if (!pulse) {
        return;
      }

      const t = (elapsed * 0.12 + index * 0.31) % 1;
      const point = curve.getPointAt(t);
      pulse.position.copy(point);
      pulse.position.y += 0.08;
      pulse.scale.setScalar(0.3 + (Math.sin(elapsed * 2.4 + index) + 1) * 0.16);
      pulse.material.opacity = 0.28 + (Math.sin(elapsed * 3.1 + index) + 1) * 0.16;
    });
  });

  return (
    <>
      <color attach="background" args={["#051713"]} />
      <fog attach="fog" args={["#051713", 11, 28]} />
      <PerspectiveCamera makeDefault fov={34} position={[-5.8, 3, 12.2]} />
      <ambientLight intensity={0.42} />
      <hemisphereLight args={["#dff9ed", "#0a1b15", 0.72]} />
      <directionalLight
        castShadow
        intensity={1.65}
        position={[4.5, 8, 5]}
        color="#fff7ea"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight position={[-7, 8, 4]} intensity={2.4} angle={0.35} penumbra={0.8} color="#84f0c4" />
      <pointLight position={[0, 2.2, 0]} intensity={1.8} color="#7ddcb5" />
      <Sparkles count={80} size={4} scale={[20, 10, 16]} speed={0.24} color="#e9fff5" />

      <group ref={groupRef} position={[0, -1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <circleGeometry args={[13, 80]} />
          <meshStandardMaterial color="#071b16" roughness={0.86} metalness={0.08} />
        </mesh>

        <mesh geometry={glowGeometry}>
          <meshBasicMaterial color="#59d8a3" transparent opacity={0.16} />
        </mesh>
        <mesh geometry={tubeGeometry} ref={tubeRef}>
          <meshStandardMaterial
            color="#0f221d"
            metalness={0.5}
            roughness={0.18}
            emissive="#65ebb5"
            emissiveIntensity={0.7}
          />
        </mesh>

        {[0.12, 0.42, 0.68, 0.88].map((t, index) => {
          const point = curve.getPointAt(t);
          return (
            <mesh key={t} position={[point.x, point.y + 0.02, point.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.38, 0.025, 12, 60]} />
              <meshBasicMaterial
                color={index % 2 === 0 ? "#7de6bc" : "#e5d8c7"}
                transparent
                opacity={0.48}
              />
            </mesh>
          );
        })}

        <StageNode
          index={0}
          label="Industry"
          position={[-8.6, 0, 2.55]}
          ringRef={(element) => {
            stageRings.current[0] = element;
          }}
        >
          <FactoryModel />
        </StageNode>

        <StageNode
          index={1}
          label="Retailer"
          position={[0, 0, -0.2]}
          ringRef={(element) => {
            stageRings.current[1] = element;
          }}
        >
          <StoreModel />
        </StageNode>

        <StageNode
          index={2}
          label="Customer"
          position={[8.2, 0, -1.95]}
          ringRef={(element) => {
            stageRings.current[2] = element;
          }}
        >
          <CustomerModel />
        </StageNode>

        {packageOffsets.map((offset, index) => (
          <mesh
            key={offset}
            ref={(element) => {
              packageRefs.current[index] = element;
            }}
            castShadow
          >
            <boxGeometry args={[0.42, 0.28, 0.32]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#efe7da" : "#e6ecea"}
              metalness={0.7}
              roughness={0.15}
              emissive="#76edbb"
              emissiveIntensity={0.42}
            />
          </mesh>
        ))}

        {[0, 1, 2].map((index) => (
          <mesh
            key={index}
            ref={(element) => {
              pulseRefs.current[index] = element;
            }}
          >
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshBasicMaterial color="#9bf0c9" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Preload all />
    </>
  );
}

function HeroSceneFallback() {
  const packages = [0, 1, 2];
  const nodes = [
    { label: "Industry", left: "12%" },
    { label: "Retailer", left: "49%" },
    { label: "Customer", left: "84%" },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_18%_22%,rgba(229,216,199,0.18),transparent_22%),radial-gradient(circle_at_82%_18%,rgba(31,92,74,0.42),transparent_24%),linear-gradient(180deg,#041612_0%,#09201a_100%)]">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="absolute left-[12%] right-[10%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-[#7fe5be]/20 via-[#e5d8c7] to-[#7fe5be]/20" />
      <div className="absolute left-[12%] right-[10%] top-1/2 h-3 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,rgba(127,229,190,0.12),rgba(229,216,199,0.38),rgba(127,229,190,0.12))] blur-md" />

      {nodes.map((node, index) => (
        <motion.div
          key={node.label}
          animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4.2 + index * 0.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: node.left }}
        >
          <div className="absolute inset-0 rounded-full bg-[#7fe5be]/20 blur-2xl" />
          <div className="relative flex h-22 w-22 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] backdrop-blur-xl">
            <div className="h-11 w-11 rounded-[18px] bg-[linear-gradient(180deg,#e6ecea_0%,#255849_100%)] shadow-[0_0_30px_rgba(127,229,190,0.25)]" />
          </div>
          <div className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
            {node.label}
          </div>
        </motion.div>
      ))}

      {packages.map((item) => (
        <motion.div
          key={item}
          className="absolute top-1/2 z-20 h-4 w-6 -translate-y-1/2 rounded-[6px] border border-white/10 bg-[#efe7da] shadow-[0_0_24px_rgba(229,216,199,0.4)]"
          style={{ left: "14%" }}
          animate={{ left: ["14%", "80%"], y: [0, -8, 0] }}
          transition={{
            duration: 6.8,
            delay: item * 1.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-x-6 bottom-6 rounded-[22px] border border-amber-50/10 bg-black/20 px-4 py-3 text-sm text-white/64 backdrop-blur-xl">
        WebGL is unavailable, showing the fallback motion preview.
      </div>
    </div>
  );
}

export default function Hero3DScene() {
  return (
    <section id="top" className="relative pt-8 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="section-shell hero-mesh min-h-[88vh] rounded-[34px] border border-white/10 bg-white/[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(229,216,199,0.2),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(31,92,74,0.38),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0))]" />

          <div className="relative z-10 grid min-h-[88vh] grid-cols-1 gap-10 px-6 pb-8 pt-10 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:pb-12 lg:pt-14">
            <div className="flex flex-col justify-between">
              <div className="max-w-2xl pt-6 lg:pt-10">
                <p className="section-label mb-5">
                  Cinematic Supply Intelligence
                </p>

                <h1 className="font-display text-[2.8rem] leading-[0.95] tracking-[-0.04em] text-white sm:text-[4rem] lg:text-[5.4rem]">
                  Move every shipment through a{" "}
                  <span className="text-gradient">living supply chain</span>.
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
                  Nasou Hive connects industry, retailers, and customers inside one luminous
                  operating layer so inventory, route health, and order promise stay visible in
                  motion.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <motion.a
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    href="#cta"
                    className="inline-flex items-center justify-center rounded-full bg-[#e5d8c7] px-6 py-3.5 text-sm font-semibold text-[#10221c] shadow-[0_12px_40px_rgba(229,216,199,0.26)] transition"
                  >
                    Book the live walkthrough
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    href="#story"
                    className="glass-panel inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-white"
                  >
                    Explore the motion system
                  </motion.a>
                </div>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
                {[
                  ["98.2%", "Forecast-to-fill accuracy"],
                  ["27%", "Fewer reactive escalations"],
                  ["3x", "Faster retailer replenishment"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="glass-panel rounded-[24px] px-5 py-5 text-left backdrop-blur-2xl"
                  >
                    <div className="font-display text-2xl text-white">{value}</div>
                    <div className="mt-2 text-sm leading-6 text-white/62">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[460px] sm:h-[680px] lg:h-[820px] xl:h-[900px]">
              <div className="absolute inset-0 sm:bottom-[116px] lg:bottom-[124px]">
                <div className="absolute inset-0 rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] backdrop-blur-sm" />
                <SceneCanvas
                  fallback={<HeroSceneFallback />}
                  className="!h-full !w-full"
                  style={{ width: "100%", height: "100%" }}
                  shadows="percentage"
                  dpr={[1, 1.25]}
                  gl={{ antialias: false, alpha: true }}
                  camera={{ position: [-5.8, 3, 12.2], fov: 34 }}
                >
                  <HeroScene />
                </SceneCanvas>
              </div>

              <div className="pointer-events-none absolute inset-x-4 bottom-3 z-20 grid gap-3 sm:inset-x-5 sm:bottom-5 sm:grid-cols-3">
                {[
                  ["Industry", "Supplier pulse, manufacturing readiness"],
                  ["Retailer", "Shelf velocity, replenishment timing"],
                  ["Customer", "Order promise, delivery confidence"],
                ].map(([label, copy], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 + index * 0.08, duration: 0.7 }}
                    className="glass-panel rounded-[22px] px-4 py-3.5 text-left"
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#8ff2c8]" />
                      <span className="text-sm font-semibold text-white">{label}</span>
                    </div>
                    <p className="text-xs leading-5 text-white/62">{copy}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
