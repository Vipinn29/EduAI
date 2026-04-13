"use client"

import { useState, useCallback } from 'react';
import Button from './Button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SavePDFButtonProps {
  content: string;
  ref?: React.RefObject<HTMLElement>;
  metadata?: Record<string, any>;
  featureType?: string;
  className?: string;
}

export default function SavePDFButton({ 
  content, 
  ref,
  metadata, 
  featureType = 'lesson',
  className = '' 
}: SavePDFButtonProps) {
  const [saving, setSaving] = useState(false);

  const handleSavePDF = useCallback(async () => {
    if (!content) return;

    setSaving(true);
    
    try {
      // Prefer passed ref, fallback to global ID
      let pdfContent = ref?.current || document.getElementById('pdf-content') as HTMLElement;
      
      if (!pdfContent) {
        // Fallback: simple text PDF from content prop
        const pdf = new jsPDF('p', 'mm', 'a4');
        const title = metadata?.title?.replace(/[^a-z0-9]/gi, '_')?.substring(0, 50) || 'EduAI_Doc';
        const date = new Date().toISOString().split('T')[0];
        const splitContent = pdf.splitTextToSize(content, 180);
        pdf.text(splitContent, 10, 10);
        pdf.save(`${title}_${featureType}_${date}.pdf`);
        setSaving(false);
        return;
      }

      // Wait for fonts/images
      await document.fonts.ready;
      
      const ignoreElements = document.querySelectorAll('.pdf-ignore');
      ignoreElements.forEach((el) => (el as HTMLElement).style.visibility = 'hidden');

      pdfContent.scrollTop = 0;

      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: pdfContent.scrollWidth,
        height: pdfContent.scrollHeight,
        windowWidth: pdfContent.scrollWidth,
        windowHeight: pdfContent.scrollHeight,
      });

      ignoreElements.forEach((el) => (el as HTMLElement).style.visibility = '');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 277;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const title = metadata?.title?.replace(/[^a-z0-9]/gi, '_')?.substring(0, 50) || 'EduAI_Doc';
      const date = new Date().toISOString().split('T')[0];
      pdf.save(`${title}_${featureType}_${date}.pdf`);

    } catch (error: any) {
      console.error('PDF generation failed:', error);
      alert(`PDF Error: ${error.message || 'Unknown'}. Content copied to clipboard as fallback.`);
      navigator.clipboard.writeText(content);
    } finally {
      setSaving(false);
    }
  }, [ref, content, metadata, featureType]);

  return (
    <Button
      onClick={handleSavePDF}
      variant='pdf'
      size='sm'
      disabled={saving || !content}
      className={className}
    >
      {saving ? 'Generating...' : 'Save PDF'}
    </Button>
  );
}
