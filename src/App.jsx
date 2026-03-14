import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Features from "./components/Features";

const Hero3DScene = lazy(() => import("./components/Hero3DScene"));
const SupplyChainAnimation = lazy(() => import("./components/SupplyChainAnimation"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const CTA = lazy(() => import("./components/CTA"));

function SceneFallback({ compact = false }) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${
        compact ? "py-14" : "py-10"
      }`}
    >
      <div
        className={`section-shell overflow-hidden rounded-[32px] border border-[#255849]/12 bg-white/70 ${
          compact ? "h-[380px]" : "h-[620px]"
        }`}
      >
        <div className="h-full w-full animate-pulse bg-[radial-gradient(circle_at_20%_20%,rgba(229,216,199,0.4),transparent_38%),radial-gradient(circle_at_78%_18%,rgba(31,92,74,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,241,232,0.72))]" />
      </div>
    </div>
  );
}

const brands = ["Flow Density", "Nova Retail", "Astra Foods", "Gridline", "Terminal 8"];

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.62),transparent_26%),radial-gradient(circle_at_10%_16%,rgba(37,88,73,0.16),transparent_20%),radial-gradient(circle_at_80%_10%,rgba(229,216,199,0.58),transparent_22%),linear-gradient(180deg,#f8f2e9_0%,#efe7da_55%,#ece2d4_100%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(rgba(37,88,73,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(37,88,73,0.04)_1px,transparent_1px)] bg-[size:104px_104px] opacity-40 [mask-image:radial-gradient(circle_at_center,black_35%,transparent_85%)]" />

      <header className="relative z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="glass-panel flex items-center gap-3 rounded-full px-4 py-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#255849] shadow-[0_0_20px_rgba(37,88,73,0.28)]" />
            <span className="font-display text-sm uppercase tracking-[0.38em] text-[#25483c]/80">
              Nasou Hive
            </span>
          </div>
          <nav className="glass-panel hidden items-center gap-6 rounded-full px-5 py-2.5 text-sm text-[#25483c]/78 md:flex">
            <a href="#story" className="transition hover:text-[#1f5c4a]">
              Workflow
            </a>
            <a href="#features" className="transition hover:text-[#1f5c4a]">
              Platform
            </a>
            <a href="#dashboard" className="transition hover:text-[#1f5c4a]">
              Visibility
            </a>
            <a href="#cta" className="transition hover:text-[#1f5c4a]">
              Launch
            </a>
          </nav>
        </div>
      </header>

      <main className="relative pb-12">
        <Suspense fallback={<SceneFallback />}>
          <Hero3DScene />
        </Suspense>

        <section className="mx-auto -mt-3 max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="section-shell rounded-[28px] border border-[#255849]/12 bg-white/70 px-6 py-5 backdrop-blur-2xl sm:px-8"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="section-label mb-4">Network Velocity</p>
                <h2 className="font-display text-2xl text-[#25483c] sm:text-3xl">
                  Every handoff becomes visible before it becomes expensive.
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {brands.map((brand, index) => (
                  <motion.span
                    key={brand}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="rounded-full border border-[#255849]/10 bg-white/72 px-4 py-2 text-sm font-medium text-[#25483c]/76"
                  >
                    {brand}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <Suspense fallback={<SceneFallback />}>
          <SupplyChainAnimation />
        </Suspense>

        <Features />

        <Suspense fallback={<SceneFallback compact />}>
          <Dashboard />
        </Suspense>

        <Suspense fallback={<SceneFallback compact />}>
          <CTA />
        </Suspense>
      </main>
    </div>
  );
}
