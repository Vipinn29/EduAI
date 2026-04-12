"use client";

import React from 'react';

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-2xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
    >
      🖨️ Print
    </button>
  );
}
