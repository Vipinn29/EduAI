"use client";

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import { useAuthCheck } from '@/lib/hooks/useAuth';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SavePDFButtonProps {
  content: string;
  metadata?: Record<string, any>;
  featureType: 'lesson' | 'homework' | 'activity' | 'comment' | 'analysis';
  className?: string;
}

export default function SavePDFButton({ 
  content, 
  metadata, 
  featureType, 
  className = '' 
}: SavePDFButtonProps) {
  const [saving, setSaving] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { requireAuth } = useAuthCheck();

  const handleSavePDF = async () => {
    if (!content) return;

    setSaving(true);
    
    try {
      // Auto-save to history if logged in
      if (session?.user?.id) {
        const res = await fetch('/api/save-lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            content, 
            metadata: { 
              ...metadata, 
              type: featureType,
              savedAt: new Date().toISOString()
            } 
          }),
        });
        if (!res.ok) console.error('Auto-save failed');
      } else {
        // Show login note and redirect
        if (confirm('Log in to save your history?')) {
          router.push('/auth/login');
        }
        return;
      }

      // Generate PDF
      if (printableRef.current) {
        const canvas = await html2canvas(printableRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`EduAI-${featureType}-${new Date().toISOString().split('T')[0]}.pdf`);
      }
    } catch (error) {
      console.error('PDF save error:', error);
      alert('PDF generation failed. Try copying the content manually.');
      // Avoid clipboard here - alert steals focus causing NotAllowedError
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleSavePDF}
        variant="pdf"
        size="sm"
        disabled={saving || !content}
        className={className}
      >
        {saving ? 'Generating PDF...' : `💾 Save as PDF`}
      </Button>
      {content && (
        <div 
          ref={printableRef} 
          className="printable-content hidden print:block print-max-w-full"
          dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
        />
      )}
    </>
  );
}
