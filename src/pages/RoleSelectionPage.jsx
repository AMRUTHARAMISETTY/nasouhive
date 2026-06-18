import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MobileGlyph } from '../components/mobile/MobileAppShell';

const roles = [
  {
    key: 'manufacturer',
    title: 'Manufacturer',
    copy: 'Produce and supply goods across a connected distribution network.',
    icon: 'factory',
  },
  {
    key: 'retailer',
    title: 'Retailer',
    copy: 'Source products directly from manufacturers and grow your business.',
    icon: 'box',
  },
  {
    key: 'customer',
    title: 'Customer',
    copy: 'Browse and purchase products from trusted retailers.',
    icon: 'user',
  },
];

function RoleSelectionPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#EFEAE1] px-5 py-12 text-[#173F34]">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[850px]"
      >
        <div className="text-center">
          <span className="inline-flex min-h-7 items-center rounded-full bg-[#E4DDCA] px-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#6E806F]">
            Built for everyone
          </span>
          <h1 className="mt-5 font-display text-[36px] font-extrabold leading-none text-[#17624E] sm:text-[42px]">
            Join Us Today
          </h1>
          <p className="mt-3 text-[13px] font-medium text-[#62766F]">
            A smarter way to build, sell, and shop together.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {roles.map((role, index) => (
            <motion.div
              key={role.key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <Link
                to={`/app/auth/${role.key}`}
                className="group flex min-h-[300px] flex-col rounded-[11px] border border-[#216A58] bg-white px-6 py-6 shadow-[0_12px_28px_rgba(31,92,74,0.12)] transition duration-200 hover:shadow-[0_18px_38px_rgba(31,92,74,0.17)]"
              >
                <span className="grid h-14 w-14 place-items-center rounded-[8px] bg-[#E6ECEA] text-[#235E4E]">
                  <MobileGlyph name={role.icon} className="h-6 w-6" />
                </span>

                <div className="mt-7">
                  <h2 className="text-[17px] font-extrabold text-[#173F34]">{role.title}</h2>
                  <p className="mt-3 max-w-[190px] text-[12px] font-medium leading-[1.55] text-[#506B63]">
                    {role.copy}
                  </p>
                </div>

                <span className="mt-auto inline-flex min-h-8 w-fit items-center rounded-full bg-[#DED6BE] px-4 text-[10px] font-extrabold text-[#405E54] transition group-hover:bg-[#1F5C4A] group-hover:text-white">
                  Get started
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}

export default RoleSelectionPage;
