import React from 'react';
import { Link } from 'react-router-dom';

const roles = [
  {
    key: 'manufacturer',
    title: 'Manufacturer',
    copy: 'Produce and supply goods to retailers and distributors at scale.',
    icon: 'factory',
  },
  {
    key: 'retailer',
    title: 'Retailer',
    copy: 'Sell products directly to customers through your storefront.',
    icon: 'retail',
  },
  {
    key: 'customer',
    title: 'Customer',
    copy: 'Browse and purchase products from trusted retailers.',
    icon: 'user',
  },
];

function RoleIcon({ name }) {
  const common = {
    className: 'h-8 w-8',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#255849',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const icons = {
    factory: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V10l5 3V8l5 3V6l4 2v13" />
        <path d="M9 21v-4" />
        <path d="M13 21v-3" />
        <path d="M17 21v-5" />
      </>
    ),
    retail: (
      <>
        <path d="M4 7h16" />
        <path d="M6 7l1.2-3h9.6L18 7" />
        <path d="M6 10v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8" />
        <path d="M10 14h4" />
      </>
    ),
    user: (
      <>
        <path d="M7 7h10v13H7z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
        <path d="M10 11h4" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

function RoleSelectionPage() {
  return (
    <main className="box-border h-screen overflow-y-auto bg-[#EFEAE1] px-6 py-10 text-[#255849]">
      <section className="mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center">
        <div className="mb-9 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#E5D8C7] px-6 py-3 text-sm font-semibold tracking-[0.08em] text-[#1F5C4A]">
            <span aria-hidden="true">✣</span>
            <span>Get Started</span>
          </div>
          <h1 className="mt-8 font-display text-5xl font-extrabold tracking-[-0.05em] text-[#255849] sm:text-6xl">
            Join Us Today
          </h1>
          <p className="mt-5 text-lg font-medium tracking-[0.08em] text-[#255849]">
            Select your role to get started
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {roles.map((role) => (
              <div
                key={role.key}
                className="flex min-h-[292px] flex-col rounded-[18px] border-2 border-[#255849] bg-[#FFFFFF] p-8 text-left shadow-[0_18px_36px_rgba(37,88,73,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(37,88,73,0.12)]"
              >
                <span className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-[#E6ECEA]">
                  <RoleIcon name={role.icon} />
                </span>
                <h2 className="mt-8 text-2xl font-extrabold tracking-[-0.03em] text-[#000000]">
                  {role.title}
                </h2>
                <p className="mt-4 max-w-[14rem] text-base font-medium leading-7 tracking-[0.04em] text-[#255849]">
                  {role.copy}
                </p>
                <Link
                  to={`/app/auth/${role.key}`}
                  className="mt-auto inline-flex w-fit items-center justify-center rounded-2xl bg-[#E5D8C7] px-6 py-3 text-sm font-bold text-[#1F5C4A] transition hover:bg-[#FFFFFF]"
                >
                  Get started
                </Link>
              </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default RoleSelectionPage;
