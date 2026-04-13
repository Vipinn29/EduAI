"use client"

import { useState } from 'react';
import Button from './Button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SavePDFButtonProps {
  content: string;
  metadata?: Record<string, any>;
  featureType: 'lesson';
  className?: string;
}

export default function SavePDFButton({ 
  content, 
  metadata, 
  featureType, 
  className = '' 
}: SavePDFButtonProps) {
  const [saving, setSaving] = useState(false);

  const handleSavePDF = async () => {
    if (!content) return;

    setSaving(true);
    
    try {
      const pdfContent = document.getElementById('pdf-content') as HTMLElement;
      if (!pdfContent) {
        throw new Error('PDF content not found');
      }

      const ignoreElements = document.querySelectorAll('.pdf-ignore');
      ignoreElements.forEach((el) => (el as HTMLElement).style.visibility = 'hidden');

      const canvas = await html2canvas(pdfContent, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: pdfContent.scrollWidth,
        height: pdfContent.scrollHeight,
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

      const title = metadata?.title?.replace(/[^a-z0-9]/gi, '_')?.substring(0, 50) || 'EduAI_Lesson';
      const date = new Date().toISOString().split('T')[0];
      pdf.save(title + '_lesson_' + date + '.pdf');

    } catch (error: any) {
      console.error('PDF generation failed:', error);
      alert('PDF Error: ' + (error.message || 'Unknown') + '. Copy content manually.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button
      onClick={handleSavePDF}
      variant='pdf'
      size='sm'
      disabled={saving || !content}
      className={className}
    >
      {saving ? 'Generating PDF...' : 'Save as PDF'}
    </Button>
  );
}

