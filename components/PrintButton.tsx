"use client";

import React from 'react';
import Button from './Button';

interface PrintButtonProps {
  className?: string;
  disabled?: boolean;
}

export default function PrintButton({ 
  className = '', 
  disabled = false 
}: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      onClick={handlePrint}
      variant="secondary"
      size="sm"
      disabled={disabled}
      className={className}
    >
      🖨️ Print
    </Button>
  );
}
