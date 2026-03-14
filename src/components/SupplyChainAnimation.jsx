import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Float,
  Line,
  PerspectiveCamera,
  Preload,
  Sparkles,
  Text,
} from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CatmullRomCurve3, MathUtils, TubeGeometry, Vector3 } from "three";
import { AnimatePresence, motion } from "framer-motion";
import SceneCanvas from "./SceneCanvas";

gsap.registerPlugin(ScrollTrigger);

function StoryScene({ storyState }) {
  const rigRef = useRef(null);
  const packageRef = useRef(null);
  const pulseRef = useRef(null);
  const ringRefs = useRef([]);

  const curve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(-7.5, 0.2, 2.2),
        new Vector3(-3.6, 0.6, -0.5),
        new Vector3(-0.2, 0.45, -1.8),
        new Vector3(3, 0.6, 0.2),
        new Vector3(7.4, 0.35, -1.2),
      ]),
    [],
  );
  const tubeGeometry = useMemo(() => new TubeGeometry(curve, 180, 0.11, 18, false), [curve]);

  useFrame(({ camera, clock }, delta) => {
    storyState.current.progress = MathUtils.damp(
      storyState.current.progress,
      storyState.current.targetProgress,
      4.2,
      delta,
    );
    storyState.current.glow = MathUtils.damp(
      storyState.current.glow,
      storyState.current.targetGlow,
      4.2,
      delta,
    );

    const progress = storyState.current.progress;
    const glow = storyState.current.glow;
    const cameraStops = [
      new Vector3(-7.2, 2.7, 10.8),
      new Vector3(-2.4, 2.05, 8.8),
      new Vector3(3.8, 1.9, 8.4),
      new Vector3(7.4, 2.5, 9.5),
    ];

    const stageProgress = progress * (cameraStops.length - 1);
    const index = Math.floor(stageProgress);
    const blend = stageProgress - index;
    const from = cameraStops[index];
    const to = cameraStops[Math.min(index + 1, cameraStops.length - 1)];

    camera.position.x = MathUtils.damp(camera.position.x, MathUtils.lerp(from.x, to.x, blend), 3.5, delta);
    camera.position.y = MathUtils.damp(camera.position.y, MathUtils.lerp(from.y, to.y, blend), 3.5, delta);
    camera.position.z = MathUtils.damp(camera.position.z, MathUtils.lerp(from.z, to.z, blend), 3.5, delta);

    const focusPoint = curve.getPointAt(MathUtils.clamp(progress * 0.92 + 0.04, 0.04, 0.98));
    camera.lookAt(focusPoint.x, focusPoint.y + 0.8, focusPoint.z);

    if (rigRef.current) {
      rigRef.current.rotation.y = MathUtils.damp(
        rigRef.current.rotation.y,
        Math.sin(clock.elapsedTime * 0.14) * 0.05,
        2.4,
        delta,
      );
      rigRef.current.position.y = MathUtils.damp(
        rigRef.current.position.y,
        -0.8 + Math.sin(clock.elapsedTime * 0.42) * 0.08,
        2.4,
        delta,
      );
    }

    if (packageRef.current) {
      const point = curve.getPointAt(Math.min(progress * 0.92 + 0.04, 0.98));
      const tangent = curve.getTangentAt(Math.min(progress * 0.92 + 0.04, 0.98));
      packageRef.current.position.copy(point);
      packageRef.current.position.y += 0.2 + Math.sin(clock.elapsedTime * 3.4) * 0.05;
      packageRef.current.lookAt(point.clone().add(tangent));
      packageRef.current.rotation.z += delta * 0.38;
    }

    if (pulseRef.current) {
      const point = curve.getPointAt((progress * 0.92 + 0.12) % 1);
      pulseRef.current.position.copy(point);
      pulseRef.current.position.y += 0.08;
      pulseRef.current.scale.setScalar(0.3 + glow * 0.22);
      pulseRef.current.material.opacity = 0.26 + glow * 0.2;
    }

    ringRefs.current.forEach((ring, idx) => {
      if (!ring) {
        return;
      }
      const targets = [0.14, 0.5, 0.9];
      const distance = Math.min(
        Math.abs(progress - targets[idx]),
        1 - Math.abs(progress - targets[idx]),
      );
      const intensity = Math.max(0, 1 - distance / 0.18);
      ring.material.emissiveIntensity = MathUtils.damp(
        ring.material.emissiveIntensity,
        0.5 + intensity * 2.2,
        4.2,
        delta,
      );
      const scale = 1 + intensity * 0.12;
      ring.scale.setScalar(MathUtils.damp(ring.scale.x, scale, 4.4, delta));
    });
  });

  return (
    <>
      <color attach="background" args={["#03120e"]} />
      <fog attach="fog" args={["#03120e", 10, 22]} />
      <PerspectiveCamera makeDefault position={[-7.2, 2.7, 10.8]} fov={32} />
      <ambientLight intensity={0.44} />
      <hemisphereLight args={["#ecfff6", "#081813", 0.72]} />
      <directionalLight intensity={1.4} position={[6, 7, 4]} color="#fff7eb" />
      <spotLight intensity={2.3} position={[-4, 6, 6]} angle={0.34} penumbra={0.8} color="#82e8bb" />
      <Sparkles count={72} scale={[16, 8, 14]} size={4} speed={0.28} color="#d7fff0" />

      <group ref={rigRef} position={[0, -0.8, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
          <circleGeometry args={[10.5, 72]} />
          <meshStandardMaterial color="#071a15" roughness={0.88} metalness={0.12} />
        </mesh>

        <mesh geometry={tubeGeometry}>
          <meshStandardMaterial
            color="#0e1d19"
            metalness={0.48}
            roughness={0.2}
            emissive="#67eab6"
            emissiveIntensity={0.62}
          />
        </mesh>

        {[
          { label: "Industry", position: [-7.7, 0.2, 2.4], color: "#9ce9c9" },
          { label: "Retailer", position: [-0.1, 0.2, -1.7], color: "#e6ecea" },
          { label: "Customer", position: [7.6, 0.2, -1.3], color: "#e5d8c7" },
        ].map((node, index) => (
          <Float key={node.label} speed={1 + index * 0.18} floatIntensity={0.12}>
            <group position={node.position}>
              <mesh
                ref={(element) => {
                  ringRefs.current[index] = element;
                }}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.08, 0]}
              >
                <torusGeometry args={[1.1, 0.06, 16, 80]} />
                <meshStandardMaterial
                  color={node.color}
                  emissive={node.color}
                  emissiveIntensity={0.5}
                />
              </mesh>
              <mesh castShadow>
                <boxGeometry args={[0.9, 0.7, 0.9]} />
                <meshStandardMaterial color="#dce7e0" metalness={0.4} roughness={0.25} />
              </mesh>
              <Text position={[0, 1.18, 0]} fontSize={0.2} color="#effaf4">
                {node.label}
              </Text>
            </group>
          </Float>
        ))}

        <mesh ref={packageRef} castShadow>
          <boxGeometry args={[0.46, 0.28, 0.3]} />
          <meshStandardMaterial
            color="#efe7da"
            metalness={0.75}
            roughness={0.14}
            emissive="#7ae8b8"
            emissiveIntensity={0.5}
          />
        </mesh>

        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshBasicMaterial color="#9bf0cb" transparent opacity={0.4} />
        </mesh>
      </group>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Preload all />
    </>
  );
}

function FlowParticle({ start, end, speed, offset, highlight }) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }

    const t = (clock.elapsedTime * speed + offset) % 1;
    ref.current.position.set(
      MathUtils.lerp(start[0], end[0], t),
      MathUtils.lerp(start[1], end[1], t),
      MathUtils.lerp(start[2], end[2], t),
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[highlight ? 0.08 : 0.055, 18, 18]} />
      <meshBasicMaterial color={highlight ? "#9cf3cb" : "#e5d8c7"} transparent opacity={0.95} />
    </mesh>
  );
}

function NetworkScene({ activeNode, setActiveNode }) {
  const groupRef = useRef(null);

  const nodes = useMemo(
    () => [
      { id: "industry-a", label: "Industries", position: [-3.6, 1.25, -1.2], tint: "#7fe5be" },
      { id: "industry-b", label: "Plants", position: [-3.1, -0.65, 1.05], tint: "#7fe5be" },
      { id: "retail-a", label: "Retail", position: [-0.5, 0.95, 0.15], tint: "#e6ecea" },
      { id: "retail-b", label: "Stores", position: [0.2, -0.85, 1.25], tint: "#e6ecea" },
      { id: "retail-c", label: "Hubs", position: [0.55, -0.1, -1.4], tint: "#e6ecea" },
      { id: "customer-a", label: "Customers", position: [3.1, 1.2, -0.7], tint: "#e5d8c7" },
      { id: "customer-b", label: "Homes", position: [3.6, -0.5, 1.2], tint: "#e5d8c7" },
      { id: "customer-c", label: "Routes", position: [2.5, -1.2, -1.4], tint: "#e5d8c7" },
    ],
    [],
  );

  const connections = useMemo(
    () => [
      ["industry-a", "retail-a"],
      ["industry-a", "retail-c"],
      ["industry-b", "retail-a"],
      ["industry-b", "retail-b"],
      ["retail-a", "customer-a"],
      ["retail-a", "customer-c"],
      ["retail-b", "customer-b"],
      ["retail-c", "customer-a"],
      ["retail-c", "customer-c"],
    ],
    [],
  );

  const nodeMap = useMemo(
    () =>
      Object.fromEntries(
        nodes.map((node) => [
          node.id,
          { ...node, vector: new Vector3(node.position[0], node.position[1], node.position[2]) },
        ]),
      ),
    [nodes],
  );

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = MathUtils.damp(
        groupRef.current.rotation.y,
        Math.sin(clock.elapsedTime * 0.18) * 0.22,
        2,
        delta,
      );
      groupRef.current.position.y = MathUtils.damp(
        groupRef.current.position.y,
        Math.sin(clock.elapsedTime * 0.45) * 0.12,
        2.4,
        delta,
      );
    }
  });

  return (
    <>
      <color attach="background" args={["#02110d"]} />
      <fog attach="fog" args={["#02110d", 10, 18]} />
      <PerspectiveCamera makeDefault position={[0, 0.8, 9]} fov={34} />
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 3.5, 4]} intensity={2.1} color="#daf5e8" />
      <spotLight position={[-4.5, 5.5, 4]} intensity={2.2} angle={0.38} penumbra={0.9} color="#80e5ba" />
      <Sparkles count={46} scale={[10, 6, 7]} size={4} speed={0.2} color="#f5fff9" />

      <group ref={groupRef}>
        {connections.map(([fromId, toId], index) => {
          const from = nodeMap[fromId];
          const to = nodeMap[toId];
          const highlighted = activeNode && (fromId === activeNode || toId === activeNode);

          return (
            <group key={`${fromId}-${toId}`}>
              <Line
                points={[from.vector, to.vector]}
                color={highlighted ? "#93f1c8" : "#335a4b"}
                transparent
                opacity={highlighted ? 0.95 : 0.45}
                lineWidth={highlighted ? 1.6 : 1}
              />
              <FlowParticle
                start={from.position}
                end={to.position}
                speed={0.16 + index * 0.012}
                offset={(index * 0.17) % 1}
                highlight={Boolean(highlighted)}
              />
            </group>
          );
        })}

        {nodes.map((node, index) => {
          const isActive = activeNode === node.id;

          return (
            <Float key={node.id} speed={1.1 + index * 0.06} floatIntensity={0.14}>
              <group
                position={node.position}
                onPointerOver={() => setActiveNode(node.id)}
                onPointerOut={() => setActiveNode(null)}
              >
                <mesh castShadow>
                  <sphereGeometry args={[isActive ? 0.24 : 0.18, 28, 28]} />
                  <meshStandardMaterial
                    color={node.tint}
                    emissive={node.tint}
                    emissiveIntensity={isActive ? 2.4 : 1.1}
                    metalness={0.65}
                    roughness={0.08}
                  />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]}>
                  <ringGeometry args={[0.34, 0.42, 50]} />
                  <meshBasicMaterial
                    color={node.tint}
                    transparent
                    opacity={isActive ? 0.85 : 0.38}
                  />
                </mesh>
                <Text
                  position={[0, 0.5, 0]}
                  fontSize={0.18}
                  color={isActive ? "#ffffff" : "#d4e6dd"}
                  anchorX="center"
                  anchorY="middle"
                >
                  {node.label}
                </Text>
              </group>
            </Float>
          );
        })}
      </group>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Preload all />
    </>
  );
}

const storyPanels = [
  {
    title: "Industry ignition",
    copy:
      "Inbound materials, production readiness, and departure windows get surfaced as a single live state instead of isolated updates.",
  },
  {
    title: "Retail orchestration",
    copy:
      "Replenishment decisions react to sell-through, route risk, and margin signals while stock keeps moving through the same flow graph.",
  },
  {
    title: "Customer promise",
    copy:
      "Delivery confidence, order ETA, and service health reach the customer layer with the same signal fidelity used upstream.",
  },
];

function StorySceneFallback() {
  const cards = [
    { left: "12%", label: "Industry" },
    { left: "48%", label: "Retailer" },
    { left: "82%", label: "Customer" },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(229,216,199,0.18),transparent_22%),radial-gradient(circle_at_84%_16%,rgba(31,92,74,0.42),transparent_24%),linear-gradient(180deg,#041511_0%,#081d17_100%)]">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute left-[10%] right-[10%] top-[58%] h-px bg-gradient-to-r from-transparent via-[#e5d8c7] to-transparent" />
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          className="absolute top-[58%] z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: card.left }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-xl">
            <div className="h-9 w-9 rounded-xl bg-[linear-gradient(180deg,#e6ecea_0%,#255849_100%)]" />
          </div>
          <div className="mt-3 text-center text-xs uppercase tracking-[0.24em] text-white/70">
            {card.label}
          </div>
        </motion.div>
      ))}
      {[0, 1, 2].map((item) => (
        <motion.div
          key={item}
          className="absolute top-[58%] h-4 w-6 -translate-y-1/2 rounded-[6px] bg-[#efe7da] shadow-[0_0_22px_rgba(229,216,199,0.45)]"
          style={{ left: "12%" }}
          animate={{ left: ["12%", "80%"], y: [0, -6, 0] }}
          transition={{ duration: 6.2, delay: item * 1.15, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-x-5 bottom-5 rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/62 backdrop-blur-xl">
        WebGL is unavailable, showing the fallback flow animation.
      </div>
    </div>
  );
}

function NetworkSceneFallback() {
  const nodes = [
    { x: "18%", y: "28%" },
    { x: "22%", y: "70%" },
    { x: "46%", y: "35%" },
    { x: "55%", y: "68%" },
    { x: "76%", y: "32%" },
    { x: "80%", y: "72%" },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(127,229,190,0.16),transparent_20%),radial-gradient(circle_at_80%_18%,rgba(229,216,199,0.16),transparent_22%),linear-gradient(180deg,#03130f_0%,#091f18_100%)]">
      {[
        ["18%", "28%", "46%", "35%"],
        ["22%", "70%", "46%", "35%"],
        ["46%", "35%", "76%", "32%"],
        ["55%", "68%", "80%", "72%"],
        ["46%", "35%", "55%", "68%"],
      ].map(([x1, y1, x2, y2], index) => (
        <div
          key={`${x1}-${x2}`}
          className="absolute h-px origin-left bg-gradient-to-r from-[#2d5a49] via-[#7fe5be] to-transparent opacity-70"
          style={{
            left: x1,
            top: y1,
            width: `${Math.hypot(parseFloat(x2) - parseFloat(x1), parseFloat(y2) - parseFloat(y1))}%`,
            transform: `rotate(${Math.atan2(parseFloat(y2) - parseFloat(y1), parseFloat(x2) - parseFloat(x1))}rad)`,
          }}
        />
      ))}
      {nodes.map((node, index) => (
        <motion.div
          key={`${node.x}-${node.y}`}
          className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6ecea] shadow-[0_0_28px_rgba(127,229,190,0.45)]"
          style={{ left: node.x, top: node.y }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4 + index * 0.15, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function SupplyChainAnimation() {
  const sectionRef = useRef(null);
  const sectionShellRef = useRef(null);
  const storyState = useRef({
    progress: 0.02,
    targetProgress: 0.02,
    glow: 0.2,
    targetGlow: 0.2,
  });
  const [activeNode, setActiveNode] = useState(null);
  const [activeStage, setActiveStage] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      let lastStage = 0;

      media.add("(min-width: 1024px)", () => {
        storyState.current.progress = 0.02;
        storyState.current.targetProgress = 0.02;
        storyState.current.glow = 0.2;
        storyState.current.targetGlow = 0.2;
        lastStage = 0;
        setActiveStage(0);

        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top+=24",
          end: () => `+=${Math.round(window.innerHeight * 1.35)}`,
          pin: sectionShellRef.current,
          pinSpacing: true,
          scrub: 1.15,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            storyState.current.targetProgress = gsap.utils.interpolate(0.08, 0.92, self.progress);
            storyState.current.targetGlow = gsap.utils.interpolate(0.24, 1, self.progress);

            const nextStage = self.progress < 0.34 ? 0 : self.progress < 0.68 ? 1 : 2;
            if (nextStage !== lastStage) {
              lastStage = nextStage;
              setActiveStage(nextStage);
            }
          },
        });

        return () => trigger.kill();
      });

      media.add("(max-width: 1023px)", () => {
        storyState.current.progress = 0.08;
        storyState.current.targetProgress = 0.08;
        storyState.current.glow = 0.24;
        storyState.current.targetGlow = 0.24;
        lastStage = 0;
        setActiveStage(0);

        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 30%",
          scrub: 1.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            storyState.current.targetProgress = gsap.utils.interpolate(0.08, 0.92, self.progress);
            storyState.current.targetGlow = gsap.utils.interpolate(0.24, 1, self.progress);

            const nextStage = self.progress < 0.34 ? 0 : self.progress < 0.68 ? 1 : 2;
            if (nextStage !== lastStage) {
              lastStage = nextStage;
              setActiveStage(nextStage);
            }
          },
        });

        return () => trigger.kill();
      });

      return () => media.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        id="story"
        ref={sectionRef}
        className="relative z-20 mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="lg:min-h-screen">
          <div
            ref={sectionShellRef}
            className="section-shell rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(4,18,14,0.96),rgba(7,24,19,0.92))] lg:h-screen"
          >
            <div className="grid h-full grid-cols-1 lg:grid-cols-[1.18fr_0.82fr]">
              <div className="relative h-[360px] sm:h-[460px] lg:h-full">
                <SceneCanvas
                  fallback={<StorySceneFallback />}
                  className="!h-full !w-full"
                  style={{ width: "100%", height: "100%" }}
                  shadows="percentage"
                  dpr={[1, 1.25]}
                  gl={{ antialias: false, alpha: true }}
                  camera={{ position: [-7.2, 2.7, 10.8], fov: 32 }}
                >
                  <StoryScene storyState={storyState} />
                </SceneCanvas>
              </div>

              <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 lg:flex lg:h-full lg:flex-col lg:justify-center lg:px-12 lg:py-12">
                <div className="max-w-xl">
                  <p className="section-label mb-5">Scroll Storytelling</p>
                  <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl">
                    The product journey turns into a camera-led narrative.
                  </h2>
                  <p className="mt-4 text-base leading-7 text-white/66">
                    Scroll through the operating path and the scene advances from supplier pulse to
                    replenishment logic to the final customer promise.
                  </p>
                </div>

                <div className="mt-7 hidden lg:block">
                  <div className="mb-4 flex flex-wrap gap-3">
                    {storyPanels.map((panel, index) => (
                      <motion.div
                        key={panel.title}
                        animate={{
                          opacity: activeStage === index ? 1 : 0.58,
                          y: activeStage === index ? 0 : 4,
                        }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className={`rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
                          activeStage === index
                            ? "border-[#7fe5be]/35 bg-white/[0.08] text-white shadow-[0_0_24px_rgba(127,229,190,0.1)]"
                            : "border-white/10 bg-white/[0.03] text-white/62"
                        }`}
                      >
                        <span className="font-medium">0{index + 1}</span>
                        <span className="ml-2">{panel.title}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="relative min-h-[250px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] px-7 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={storyPanels[activeStage].title}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -18 }}
                        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 px-7 py-7"
                      >
                        <div className="mb-4 flex items-center gap-3 text-sm text-white/64">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] font-semibold text-white">
                            0{activeStage + 1}
                          </span>
                          <span className="section-label !mb-0 !gap-2 !text-[0.62rem] before:w-7">
                            Live stage
                          </span>
                        </div>
                        <h3 className="font-display text-2xl text-white">
                          {storyPanels[activeStage].title}
                        </h3>
                        <p className="mt-4 max-w-md text-base leading-7 text-white/68">
                          {storyPanels[activeStage].copy}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-6 space-y-4 lg:hidden">
                  {storyPanels.map((panel, index) => (
                    <motion.div
                      key={panel.title}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.65, delay: index * 0.08 }}
                      className="story-card rounded-[26px] px-6 py-6"
                    >
                      <div className="mb-3 flex items-center gap-3 text-sm text-white/64">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] font-semibold text-white">
                          0{index + 1}
                        </span>
                        <span className="section-label !mb-0 !gap-2 !text-[0.62rem] before:w-7">
                          Live stage
                        </span>
                      </div>
                      <h3 className="font-display text-xl text-white">{panel.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-white/68">{panel.copy}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="section-shell rounded-[34px] border border-white/10 bg-white/[0.03] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="max-w-xl">
              <p className="section-label mb-5">Interactive Network</p>
              <h2 className="font-display text-3xl text-white sm:text-4xl">
                A floating graph of industries, retailers, and customers.
              </h2>
              <p className="mt-4 text-base leading-7 text-white/68">
                Hover the network to illuminate the exact relationship path. Data particles move
                through the graph to suggest lead times, order signal, and route continuity.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  ["1.4M", "daily events reconciled"],
                  ["42%", "faster incident context"],
                  ["360°", "network visibility layer"],
                  ["14 ms", "signal propagation"],
                ].map(([value, label]) => (
                  <div key={label} className="glass-panel rounded-[22px] px-4 py-4">
                    <div className="font-display text-2xl text-white">{value}</div>
                    <div className="mt-1 text-sm text-white/62">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[460px] sm:h-[560px] overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]">
              <SceneCanvas
                fallback={<NetworkSceneFallback />}
                className="!h-full !w-full"
                style={{ width: "100%", height: "100%" }}
                dpr={[1, 1.2]}
                gl={{ antialias: false, alpha: true }}
                onPointerMissed={() => setActiveNode(null)}
              >
                <NetworkScene activeNode={activeNode} setActiveNode={setActiveNode} />
              </SceneCanvas>

              <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
                Hover a node to isolate the path
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
