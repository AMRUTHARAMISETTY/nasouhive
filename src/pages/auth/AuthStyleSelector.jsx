import React from 'react';
import { Link } from 'react-router-dom';

const variants = [
  ['v1', 'Minimal Centered'],
  ['v2', 'Split Screen'],
  ['v3', 'Glassmorphism'],
  ['v4', 'Dark Futuristic'],
  ['v5', 'Mobile First'],
  ['v6', 'Illustration'],
  ['v7', 'Stepper'],
  ['v8', 'Tabbed'],
  ['v9', 'Social'],
  ['v10', 'Animated 3D'],
  ['v11', 'SVG Mockup'],
];

export default function AuthStyleSelector() {
  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-primary mb-2">Choose Auth Style</h1>
        <p className="text-gray-600 mb-6">10 interactive authentication page variants</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map(([path, label]) => (
            <Link key={path} to={`/app/auth/${path}`} className="glass-card p-5 block">
              <h2 className="text-lg font-semibold text-primary">{label}</h2>
              <p className="text-sm text-gray-600 mt-1">Open {path.toUpperCase()}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
