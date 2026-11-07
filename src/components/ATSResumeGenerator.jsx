import React from 'react';
import { jsPDF } from 'jspdf';
import { Download, FileText, Sparkles } from 'lucide-react';

export const ATSResumeGenerator = ({ profile }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(profile.name || profile.personal?.name || 'Your Name', margin, y);

    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const contact = [profile.email, profile.personal?.phone, profile.personal?.location, profile.personal?.linkedin]
      .filter(Boolean).join(' | ');
    if (contact) doc.text(contact, margin, y);

    y += 15;
    // Summary
    if (profile.personal?.bio) {
      doc.setFont('helvetica', 'bold');
      doc.text('PROFESSIONAL SUMMARY', margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(profile.personal?.bio || '', 170);
      doc.text(lines, margin, y);
      y += (lines.length * 5) + 5;
    }

    // Experience
    if (profile.experience && profile.experience.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('EXPERIENCE', margin, y);
      y += 7;
      profile.experience.forEach(exp => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${exp.company}`, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${exp.role}`, margin + 60, y);
        y += 5;
        if (exp.startDate || exp.endDate) {
          doc.setFontSize(9);
          doc.text(`${exp.startDate} - ${exp.endDate}`, margin, y);
          y += 5;
        }
        doc.setFontSize(10);
        const desc = doc.splitTextToSize(exp.description, 170);
        doc.text(desc, margin, y);
        y += (desc.length * 5) + 5;
      });
    }

    // Skills
    if (profile.skills && profile.skills.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('SKILLS', margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      const skills = profile.skills.map(s => `${s.name} (${s.proficiency})`).join(', ');
      const skillLines = doc.splitTextToSize(skills, 170);
      doc.text(skillLines, margin, y);
      y += (skillLines.length * 5) + 10;
    }

    // Education
    if (profile.education && profile.education.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('EDUCATION', margin, y);
      y += 7;
      profile.education.forEach(edu => {
        doc.setFont('helvetica', 'normal');
        doc.text(`${edu.qualification} | ${edu.institute}`, margin, y);
        if (edu.endYear) {
            doc.text(`Graduated ${edu.endYear}`, 150, y);
        }
        y += 5;
        if (edu.field) {
            doc.setFontSize(9);
            doc.text(`${edu.field} | Score: ${edu.score || 'N/A'}`, margin, y);
            y += 5;
        }
        doc.setFontSize(10);
      });
    }

    doc.save(`${profile.name || profile.personal?.name || 'Resume'}_CareerVault_ATS.pdf`);
  };

  return (
    <div className="ats-tool glass animate-fade-in">
      <div className="ats-header">
        <h3><Sparkles size={20} color="var(--primary)" /> ATS Resume Generator</h3>
        <p>Generate a clean, high-score resume from your profile data</p>
      </div>
      <div className="ats-actions">
        <button className="gen-btn" onClick={generatePDF}>
          <Download size={18} /> Download ATS PDF
        </button>
        <button className="preview-btn">
          <FileText size={18} /> Live Preview
        </button>
      </div>

      <style>{`
        .ats-tool {
          background: linear-gradient(to bottom right, rgba(79, 70, 229, 0.05), rgba(79, 70, 229, 0.02));
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          margin-top: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ats-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .ats-header p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .ats-actions {
          display: flex;
          gap: 1rem;
        }
        .gen-btn {
          background: var(--bg-dark);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .gen-btn:hover {
          background: black;
          transform: translateY(-2px);
        }
        .preview-btn {
          border: 1px solid var(--border);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
};
