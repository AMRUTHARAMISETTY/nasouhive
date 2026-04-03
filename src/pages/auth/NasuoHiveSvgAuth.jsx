import React from 'react';

export default function NasuoHiveSvgAuth() {
  return (
    <div className="min-h-screen bg-[#EFE7DA] p-4 sm:p-8">
      <div className="mx-auto max-w-[1200px] rounded-2xl shadow-[0_24px_70px_rgba(31,92,74,0.15)]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%" role="img" aria-label="Nasuo Hive authentication layout">
          <defs>
            <filter id="glass" x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.1" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F5C4A" />
              <stop offset="100%" stopColor="#255849" />
            </linearGradient>
          </defs>

          <rect width="1200" height="800" fill="#EFE7DA" />

          <rect x="0" y="0" width="600" height="800" fill="#1F5C4A" />
          <rect x="0" y="0" width="600" height="800" fill="url(#gradLeft)" opacity="0.9" />

          <text x="300" y="350" textAnchor="middle" fill="#FFFFFF" fontSize="56" fontWeight="bold" fontFamily="Arial">
            Nasuo Hive
          </text>
          <text x="300" y="410" textAnchor="middle" fill="#E6ECEA" fontSize="24" fontFamily="Arial">
            Smart Supply Chain Platform
          </text>
          <text x="300" y="460" textAnchor="middle" fill="#E5D8C7" fontSize="16" fontFamily="Arial">
            Connect, Trade, and Grow Sustainably
          </text>

          <rect x="650" y="100" width="450" height="600" rx="32" fill="#FFFFFF" fillOpacity="0.7" stroke="#E5D8C7" strokeWidth="2" filter="url(#glass)" />

          <rect x="680" y="140" width="140" height="44" rx="22" fill="#1F5C4A" />
          <text x="750" y="168" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">Login</text>
          <rect x="830" y="140" width="140" height="44" rx="22" fill="#EFEAE1" />
          <text x="900" y="168" textAnchor="middle" fill="#000000" fontSize="16">Sign Up</text>

          <rect x="680" y="210" width="110" height="36" rx="18" fill="#255849" />
          <text x="735" y="233" textAnchor="middle" fill="#FFFFFF" fontSize="14">Manufacturer</text>
          <rect x="800" y="210" width="110" height="36" rx="18" fill="#EFEAE1" />
          <text x="855" y="233" textAnchor="middle" fill="#000" fontSize="14">Retailer</text>
          <rect x="920" y="210" width="110" height="36" rx="18" fill="#EFEAE1" />
          <text x="975" y="233" textAnchor="middle" fill="#000" fontSize="14">Customer</text>

          <rect x="680" y="280" width="390" height="44" rx="12" fill="#FFFFFF" stroke="#E5D8C7" />
          <text x="700" y="307" fill="#888" fontSize="14">Email</text>

          <rect x="680" y="340" width="390" height="44" rx="12" fill="#FFFFFF" stroke="#E5D8C7" />
          <text x="700" y="367" fill="#888" fontSize="14">Password</text>

          <rect x="680" y="400" width="390" height="44" rx="12" fill="#FFFFFF" stroke="#E5D8C7" />
          <text x="700" y="427" fill="#888" fontSize="14">Confirm Password</text>

          <rect x="680" y="460" width="390" height="44" rx="12" fill="#FFFFFF" stroke="#E5D8C7" />
          <text x="700" y="487" fill="#888" fontSize="14">Company Name</text>

          <rect x="680" y="520" width="390" height="44" rx="12" fill="#FFFFFF" stroke="#E5D8C7" />
          <text x="700" y="547" fill="#888" fontSize="14">GST Number</text>

          <rect x="680" y="580" width="390" height="44" rx="12" fill="#FFFFFF" stroke="#E5D8C7" />
          <text x="700" y="607" fill="#888" fontSize="14">Phone</text>

          <rect x="680" y="650" width="390" height="50" rx="25" fill="#1F5C4A" />
          <text x="875" y="680" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="bold">Create Account</text>
        </svg>
      </div>
    </div>
  );
}
