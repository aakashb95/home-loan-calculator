"use client"

import React from 'react';
import HomeBuyingCalculator from '../components/HomeBuyingCalculator';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-center">
        <HomeBuyingCalculator />
      </div>
    </main>
  );
}