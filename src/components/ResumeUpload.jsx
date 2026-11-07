import React, { useState } from 'react';
import { Upload, Loader, FileText, Check, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

// Set up pdfjs worker for v5
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// ─── Comprehensive Skill Map ───
const SKILL_MAP = {
    'react': { name: 'React', category: 'Technical', level: 'Intermediate' },
    'react.js': { name: 'React', category: 'Technical', level: 'Intermediate' },
    'reactjs': { name: 'React', category: 'Technical', level: 'Intermediate' },
    'javascript': { name: 'JavaScript', category: 'Technical', level: 'Intermediate' },
    'typescript': { name: 'TypeScript', category: 'Technical', level: 'Intermediate' },
    'node.js': { name: 'Node.js', category: 'Technical', level: 'Intermediate' },
    'nodejs': { name: 'Node.js', category: 'Technical', level: 'Intermediate' },
    'express': { name: 'Express', category: 'Frameworks', level: 'Intermediate' },
    'express.js': { name: 'Express', category: 'Frameworks', level: 'Intermediate' },
    'python': { name: 'Python', category: 'Technical', level: 'Intermediate' },
    'java ': { name: 'Java', category: 'Technical', level: 'Intermediate' },
    'c++': { name: 'C++', category: 'Technical', level: 'Intermediate' },
    'c#': { name: 'C#', category: 'Technical', level: 'Intermediate' },
    'golang': { name: 'Go', category: 'Technical', level: 'Intermediate' },
    'rust': { name: 'Rust', category: 'Technical', level: 'Intermediate' },
    'php': { name: 'PHP', category: 'Technical', level: 'Intermediate' },
    'ruby': { name: 'Ruby', category: 'Technical', level: 'Intermediate' },
    'swift': { name: 'Swift', category: 'Technical', level: 'Intermediate' },
    'kotlin': { name: 'Kotlin', category: 'Technical', level: 'Intermediate' },
    'html': { name: 'HTML', category: 'Technical', level: 'Intermediate' },
    'css': { name: 'CSS', category: 'Technical', level: 'Intermediate' },
    'sass': { name: 'SASS', category: 'Technical', level: 'Intermediate' },
    'sql': { name: 'SQL', category: 'Technical', level: 'Intermediate' },
    'mysql': { name: 'MySQL', category: 'Technical', level: 'Intermediate' },
    'mongodb': { name: 'MongoDB', category: 'Technical', level: 'Intermediate' },
    'postgresql': { name: 'PostgreSQL', category: 'Technical', level: 'Intermediate' },
    'redis': { name: 'Redis', category: 'Technical', level: 'Intermediate' },
    'firebase': { name: 'Firebase', category: 'Tools', level: 'Intermediate' },
    'docker': { name: 'Docker', category: 'Tools', level: 'Intermediate' },
    'kubernetes': { name: 'Kubernetes', category: 'Tools', level: 'Intermediate' },
    'aws': { name: 'AWS', category: 'Tools', level: 'Intermediate' },
    'azure': { name: 'Azure', category: 'Tools', level: 'Intermediate' },
    'gcp': { name: 'GCP', category: 'Tools', level: 'Intermediate' },
    'git': { name: 'Git', category: 'Tools', level: 'Intermediate' },
    'github': { name: 'GitHub', category: 'Tools', level: 'Intermediate' },
    'jenkins': { name: 'Jenkins', category: 'Tools', level: 'Intermediate' },
    'terraform': { name: 'Terraform', category: 'Tools', level: 'Intermediate' },
    'figma': { name: 'Figma', category: 'Tools', level: 'Intermediate' },
    'jira': { name: 'Jira', category: 'Tools', level: 'Intermediate' },
    'next.js': { name: 'Next.js', category: 'Frameworks', level: 'Intermediate' },
    'nextjs': { name: 'Next.js', category: 'Frameworks', level: 'Intermediate' },
    'vue': { name: 'Vue.js', category: 'Frameworks', level: 'Intermediate' },
    'angular': { name: 'Angular', category: 'Frameworks', level: 'Intermediate' },
    'django': { name: 'Django', category: 'Frameworks', level: 'Intermediate' },
    'flask': { name: 'Flask', category: 'Frameworks', level: 'Intermediate' },
    'spring': { name: 'Spring', category: 'Frameworks', level: 'Intermediate' },
    'tailwind': { name: 'Tailwind CSS', category: 'Frameworks', level: 'Intermediate' },
    'bootstrap': { name: 'Bootstrap', category: 'Frameworks', level: 'Intermediate' },
    'graphql': { name: 'GraphQL', category: 'Technical', level: 'Intermediate' },
    'rest api': { name: 'REST API', category: 'Technical', level: 'Intermediate' },
    'machine learning': { name: 'Machine Learning', category: 'Technical', level: 'Intermediate' },
    'deep learning': { name: 'Deep Learning', category: 'Technical', level: 'Intermediate' },
    'tensorflow': { name: 'TensorFlow', category: 'Frameworks', level: 'Intermediate' },
    'pytorch': { name: 'PyTorch', category: 'Frameworks', level: 'Intermediate' },
    'pandas': { name: 'Pandas', category: 'Technical', level: 'Intermediate' },
    'numpy': { name: 'NumPy', category: 'Technical', level: 'Intermediate' },
    'react native': { name: 'React Native', category: 'Frameworks', level: 'Intermediate' },
    'flutter': { name: 'Flutter', category: 'Frameworks', level: 'Intermediate' },
    'linux': { name: 'Linux', category: 'Tools', level: 'Intermediate' },
    'agile': { name: 'Agile', category: 'Soft Skills', level: 'Intermediate' },
    'scrum': { name: 'Scrum', category: 'Soft Skills', level: 'Intermediate' },
    'ci/cd': { name: 'CI/CD', category: 'Tools', level: 'Intermediate' },
    'devops': { name: 'DevOps', category: 'Tools', level: 'Intermediate' },
    'penetration testing': { name: 'Penetration Testing', category: 'Technical', level: 'Intermediate' },
    'ethical hacking': { name: 'Ethical Hacking', category: 'Technical', level: 'Intermediate' },
    'network security': { name: 'Network Security', category: 'Technical', level: 'Intermediate' },
    'cyber security': { name: 'Cyber Security', category: 'Technical', level: 'Intermediate' },
    'cybersecurity': { name: 'Cyber Security', category: 'Technical', level: 'Intermediate' },
};

// ─── Education degree classifiers ───
const DEGREE_PATTERNS = [
    { pattern: /\b(Ph\.?D|Doctor(?:ate)?)\b/i, qualification: 'PhD' },
    { pattern: /\b(M\.?(?:Tech|S|Sc|A|B\.?A|Com|C\.?A)|Master(?:'?s)?|Postgraduate|PG)\b/i, qualification: 'Postgraduate' },
    { pattern: /\b(B\.?(?:Tech|E|S|Sc|A|B\.?A|Com|C\.?A)|Bachelor(?:'?s)?|Undergraduate|UG)\b/i, qualification: 'Undergraduate' },
    { pattern: /\b(Diploma)\b/i, qualification: 'Diploma' },
    { pattern: /\b(12th|XII|HSC|Higher Secondary|Intermediate|\+2)\b/i, qualification: '12th Standard' },
    { pattern: /\b(10th|X|SSC|Secondary|Matriculation)\b/i, qualification: '10th Standard' },
];

// ─── Main Parser ───
const parseResumeText = (text) => {
    const lower = text.toLowerCase();
    const lines = text.trim().split('\n').filter(l => l.trim());

    // ── 1. Extract Name (first non-empty, non-email, non-phone line) ──
    let name = '';
    for (const line of lines.slice(0, 5)) {
        const trimmed = line.trim();
        if (trimmed.length < 4 || trimmed.length > 60) continue;
        if (trimmed.includes('@') || /^\+?\d[\d\s\-().]{7,}$/.test(trimmed)) continue;
        if (/^(resume|curriculum|cv|objective|summary|profile|about)/i.test(trimmed)) continue;
        name = trimmed.replace(/[|•·—–\-:,]/g, '').trim();
        break;
    }

    // ── 2. Extract Email ──
    const emailMatch = text.match(/[a-zA-Z0-9._+%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : '';

    // ── 3. Extract Phone ──
    const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/);
    const phone = phoneMatch ? phoneMatch[0].trim() : '';

    // ── 4. Extract LinkedIn ──
    const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin:\s*)([a-zA-Z0-9_-]+)/i);
    const linkedin = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '';

    // ── 5. Extract GitHub / Portfolio ──
    const githubMatch = text.match(/(?:github\.com\/|github:\s*)([a-zA-Z0-9_-]+)/i);
    const portfolio = githubMatch ? `https://github.com/${githubMatch[1]}` : '';

    // ── 6. Extract Address ──
    let address = '';
    const addressPatterns = [
        /(?:address|location|city|based in|residing)\s*[:\-]?\s*(.+)/i,
        /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*(?:[A-Z]{2}|[A-Z][a-z]+(?:\s[A-Z][a-z]+)*))/,
    ];
    for (const pat of addressPatterns) {
        const m = text.match(pat);
        if (m) { address = m[1].trim().substring(0, 60); break; }
    }

    // ── 7. Extract Skills ──
    const skills = [];
    const seenSkills = new Set();
    Object.entries(SKILL_MAP).forEach(([keyword, skill]) => {
        if (lower.includes(keyword) && !seenSkills.has(skill.name)) {
            seenSkills.add(skill.name);
            const count = lower.split(keyword).length - 1;
            skills.push({
                ...skill,
                level: count >= 4 ? 'Expert' : count >= 3 ? 'Advanced' : count >= 2 ? 'Intermediate' : 'Intermediate'
            });
        }
    });

    // ── 8. Extract Education ──
    const education = [];
    const eduSectionMatch = text.match(/(?:EDUCATION|ACADEMIC|QUALIFICATION)S?\s*\n([\s\S]*?)(?=\n\s*(?:EXPERIENCE|WORK|SKILL|PROJECT|CERTIF|AWARD|ACHIEVE|INTEREST|HOBBY|REFERENCE|$))/i);
    if (eduSectionMatch) {
        const eduText = eduSectionMatch[1];
        const eduLines = eduText.split('\n').filter(l => l.trim());

        let currentEdu = null;
        for (const line of eduLines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Check if it's a degree line
            let foundDegree = null;
            for (const dp of DEGREE_PATTERNS) {
                if (dp.pattern.test(trimmed)) {
                    foundDegree = dp.qualification;
                    break;
                }
            }

            if (foundDegree) {
                if (currentEdu) education.push(currentEdu);
                currentEdu = {
                    degree: foundDegree,
                    school: '',
                    fieldOfStudy: trimmed.replace(DEGREE_PATTERNS.find(d => d.qualification === foundDegree).pattern, '').replace(/^[\s,\-–|in]+|[\s,\-–|]+$/g, '').trim(),
                    startYear: '',
                    endYear: '',
                    grade: ''
                };

                // Try to find year in same line
                const yearMatch = trimmed.match(/(\d{4})\s*[-–to]+\s*(\d{4}|present)/i);
                if (yearMatch) {
                    currentEdu.startYear = yearMatch[1];
                    currentEdu.endYear = yearMatch[2];
                } else {
                    const singleYear = trimmed.match(/\b(20\d{2}|19\d{2})\b/);
                    if (singleYear) currentEdu.endYear = singleYear[1];
                }

                // Try to find GPA/percentage
                const scoreMatch = trimmed.match(/(\d+\.?\d*)\s*(?:CGPA|GPA|%|percent)/i);
                if (scoreMatch) currentEdu.score = scoreMatch[1] + (trimmed.toLowerCase().includes('cgpa') || trimmed.toLowerCase().includes('gpa') ? ' CGPA' : '%');
            } else if (currentEdu) {
                // Assume it's the institution name or extra details
                if (!currentEdu.school && trimmed.length > 3 && trimmed.length < 100) {
                    // Check if an institution-like line (university, college, school, institute)
                    if (/university|college|school|institute|academy|iit|nit|iiit/i.test(trimmed) || (!currentEdu.school && !trimmed.match(/^\d/))) {
                        currentEdu.school = trimmed.replace(/\d{4}.*$/, '').trim();
                    }
                }
                // Check for year/score if not already found
                if (!currentEdu.endYear) {
                    const yearMatch = trimmed.match(/(\d{4})\s*[-–to]+\s*(\d{4}|present)/i);
                    if (yearMatch) { currentEdu.startYear = yearMatch[1]; currentEdu.endYear = yearMatch[2]; }
                    else {
                        const singleYear = trimmed.match(/\b(20\d{2}|19\d{2})\b/);
                        if (singleYear) currentEdu.endYear = singleYear[1];
                    }
                }
                if (!currentEdu.grade) {
                    const scoreMatch = trimmed.match(/(\d+\.?\d*)\s*(?:CGPA|GPA|%|percent)/i);
                    if (scoreMatch) currentEdu.grade = scoreMatch[1] + (trimmed.toLowerCase().includes('cgpa') || trimmed.toLowerCase().includes('gpa') ? ' CGPA' : '%');
                }
            }
        }
        if (currentEdu) education.push(currentEdu);
    }

    // ── 9. Extract Experience ──
    const experience = [];
    const expSectionMatch = text.match(/(?:EXPERIENCE|WORK\s*EXPERIENCE|EMPLOYMENT|WORK\s*HISTORY|PROFESSIONAL\s*EXPERIENCE)\s*\n([\s\S]*?)(?=\n\s*(?:EDUCATION|SKILL|PROJECT|CERTIF|AWARD|ACHIEVE|INTEREST|HOBBY|REFERENCE|$))/i);
    if (expSectionMatch) {
        const expText = expSectionMatch[1];
        const expLines = expText.split('\n').filter(l => l.trim());

        let currentExp = null;
        for (const line of expLines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Check if line looks like a job title/company
            const dateMatch = trimmed.match(/(\w+\.?\s*\d{4})\s*[-–to]+\s*(\w+\.?\s*\d{4}|present|current)/i);
            const roleCompanyMatch = trimmed.match(/^(.+?)\s*(?:at|@|-|–|,|•|·)\s*(.+)/);

            if (dateMatch || (roleCompanyMatch && !trimmed.startsWith('•') && !trimmed.startsWith('-') && !trimmed.startsWith('*') && trimmed.length < 120)) {
                if (currentExp) experience.push(currentExp);
                currentExp = {
                    company: '',
                    position: '',
                    startDate: dateMatch ? dateMatch[1] : '',
                    endDate: dateMatch ? dateMatch[2] : '',
                    description: ''
                };
                if (roleCompanyMatch) {
                    currentExp.position = roleCompanyMatch[1].trim();
                    currentExp.company = roleCompanyMatch[2].replace(/(\w+\.?\s*\d{4}).*$/, '').trim();
                } else {
                    currentExp.position = trimmed.replace(/(\w+\.?\s*\d{4}).*$/, '').trim();
                }
            } else if (currentExp) {
                // It's a description bullet
                const bullet = trimmed.replace(/^[•·\-*]\s*/, '');
                currentExp.description += (currentExp.description ? '\n' : '') + bullet;
            }
        }
        if (currentExp) experience.push(currentExp);
    }

    // ── 10. Extract Certifications ──
    const certifications = [];
    const certSectionMatch = text.match(/(?:CERTIFI?CATION|LICENSE|CREDENTIAL)S?\s*\n([\s\S]*?)(?=\n\s*(?:EDUCATION|SKILL|PROJECT|EXPERIENCE|AWARD|ACHIEVE|INTEREST|HOBBY|REFERENCE|$))/i);
    if (certSectionMatch) {
        const certLines = certSectionMatch[1].split('\n').filter(l => l.trim());
        for (const line of certLines) {
            const trimmed = line.trim().replace(/^[•·\-*]\s*/, '');
            if (trimmed.length < 3 || trimmed.length > 150) continue;

            const issuerMatch = trimmed.match(/(.+?)\s*(?:[-–|,]\s*(?:by|from|issued by)?\s*)(.+)/i);
            const dateMatch = trimmed.match(/\b(\w+\.?\s*\d{4})\b/);

            certifications.push({
                name: issuerMatch ? issuerMatch[1].trim() : trimmed.replace(/\d{4}.*$/, '').trim(),
                organization: issuerMatch ? issuerMatch[2].replace(/\d{4}.*$/, '').trim() : '',
                date: dateMatch ? dateMatch[1] : '',
                link: ''
            });
        }
    }

    // ── 11. Extract Bio / Summary ──
    let bio = '';
    const summaryMatch = text.match(/(?:SUMMARY|OBJECTIVE|ABOUT\s*ME|PROFILE\s*SUMMARY|PROFESSIONAL\s*SUMMARY)\s*\n([\s\S]*?)(?=\n\s*(?:EDUCATION|SKILL|PROJECT|EXPERIENCE|CERTIF|AWARD|WORK|$))/i);
    if (summaryMatch) {
        bio = summaryMatch[1].trim().split('\n').filter(l => l.trim()).join(' ').substring(0, 500);
    }

    return {
        name,
        personal: { phone, address, linkedin, portfolio, bio },
        email,
        skills,
        education,
        experience,
        certifications
    };
};

export const ResumeUpload = ({ profile, onParsed }) => {
    const [uploading, setUploading] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const [applied, setApplied] = useState(false);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState(null);
    const [showDebug, setShowDebug] = useState(false);
    const [debugText, setDebugText] = useState('');

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setApplied(false);
        setFileName(file.name);

        const fileType = file.name.split('.').pop().toLowerCase();
        console.log('File selected:', file.name, 'Type:', fileType);

        try {
            let text = '';
            
            if (fileType === 'pdf') {
                console.log('Starting PDF parsing...');
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                console.log('PDF loaded, pages:', pdf.numPages);
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items
                        .filter(item => item.str !== undefined)
                        .map(item => item.str);
                    fullText += strings.join(' ') + '\n';
                }
                text = fullText;
                console.log('PDF text extracted, length:', text.length);
            } else if (fileType === 'docx' || fileType === 'doc') {
                console.log('Starting DOCX parsing with mammoth...');
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                text = result.value;
                console.log('DOCX text extracted, length:', text.length);
            } else {
                console.log('Starting plain text read...');
                text = await file.text();
            }

            setDebugText(text);
            console.log('--- RAW EXTRACTED TEXT ---');
            console.log(text.substring(0, 1000));
            console.log('---------------------------');

            if (!text || text.trim().length === 0) {
                throw new Error('No text content could be extracted from this file.');
            }

            console.log('Beginning heuristic parsing...');
            const parsed = parseResumeText(text);
            console.log('Parsed data structure:', parsed);

            // If no name found, derive from filename
            if (!parsed.name && file.name) {
                const base = file.name.replace(/\.(pdf|docx|txt|doc)$/i, '').replace(/[_-]/g, ' ');
                if (base.length < 40) {
                    parsed.name = base.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                }
            }

            setParsedData(parsed);
            setUploading(false);

            // ── AUTO-APPLY: Merge parsed data into profile and save ──
            console.log('Merging parsed data into pulse profile...');
            const mergedProfile = { ...profile };

            // Name
            if (parsed.name) mergedProfile.name = parsed.name;

            // Personal info
            mergedProfile.personal = {
                ...(mergedProfile.personal || {}),
                ...(parsed.personal.phone && { phone: parsed.personal.phone }),
                ...(parsed.personal.address && { address: parsed.personal.address }),
                ...(parsed.personal.linkedin && { linkedin: parsed.personal.linkedin }),
                ...(parsed.personal.portfolio && { portfolio: parsed.personal.portfolio }),
                ...(parsed.personal.bio && { bio: parsed.personal.bio }),
            };

            // Skills — merge, avoid duplicates
            const existingSkillNames = new Set((mergedProfile.skills || []).map(s => s.name?.toLowerCase()));
            const newSkills = parsed.skills.filter(s => !existingSkillNames.has(s.name.toLowerCase()));
            mergedProfile.skills = [...(mergedProfile.skills || []), ...newSkills];

            // Education — replace if we got data
            if (parsed.education.length > 0) {
                mergedProfile.education = parsed.education;
            }

            // Experience — replace if we got data
            if (parsed.experience.length > 0) {
                mergedProfile.experience = parsed.experience;
            }

            // Certifications — merge
            if (parsed.certifications.length > 0) {
                const existingCerts = new Set((mergedProfile.certifications || []).map(c => c.name?.toLowerCase()));
                const newCerts = parsed.certifications.filter(c => !existingCerts.has(c.name?.toLowerCase()));
                mergedProfile.certifications = [...(mergedProfile.certifications || []), ...newCerts];
            }

            console.log('Final merged profile ready for save:', mergedProfile);

            // Save automatically
            if (onParsed) {
                console.log('Calling onParsed handler...');
                await onParsed(mergedProfile);
                setApplied(true);
                console.log('Profile sync complete.');
            } else {
                console.warn('No onParsed handler provided to ResumeUpload.');
            }

        } catch (err) {
            console.error('CRITICAL: Resume parsing failed:', err);
            setError(err.message || 'An unexpected error occurred during parsing.');
            setUploading(false);
        }
    };

    const statItem = (label, value) => (
        <div className="stat-item">
            <CheckCircle size={14} color="var(--success)" />
            <span className="stat-label">{label}:</span>
            <span className="stat-value">{value}</span>
        </div>
    );

    return (
        <div className="resume-tool">
            {error && (
                <div className="parse-error-banner glass animate-fade-in" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-md)' }}>
                    <AlertCircle size={20} color="var(--danger)" />
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--danger)' }}>Parsing Failed</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{error}</p>
                    </div>
                    <button onClick={() => setError(null)} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '1.2rem' }}>&times;</button>
                </div>
            )}
            
            {uploading && (
                <div className="parsing-status glass animate-fade-in" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                    <Loader size={48} className="spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                    <h3>AI is analyzing your resume...</h3>
                    <p className="text-muted">Extracting skills, experience, and education details.</p>
                </div>
            )}

            {!parsedData && !uploading ? (
                <label className="upload-zone glass">
                    <Upload size={32} />
                    <span className="upload-title">Upload Resume to Auto-fill Profile</span>
                    <span className="upload-hint">Supports .pdf, .docx, .txt — Extracts name, skills, education, experience & more</span>
                    <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={(e) => { setError(null); handleFileUpload(e); }} disabled={uploading} hidden />
                </label>
            ) : null}

            {parsedData && (
                <div className={`parsed-result glass animate-fade-in ${applied ? 'success' : ''}`}>
                    <div className="parsed-header">
                        {applied ? <CheckCircle size={24} color="var(--success)" /> : <FileText size={24} color="var(--primary)" />}
                        <div>
                            <h3>{applied ? 'Profile Synced Successfully!' : 'Parsing Complete'}</h3>
                            <p className="text-muted">{fileName} — All extracted data has been applied to your profile</p>
                        </div>
                    </div>

                    <div className="parsed-summary">
                        {parsedData.name && statItem('Name', parsedData.name)}
                        {parsedData.email && statItem('Email', parsedData.email)}
                        {parsedData.personal?.phone && statItem('Phone', parsedData.personal.phone)}
                        {parsedData.personal?.address && statItem('Address', parsedData.personal.address)}
                        {parsedData.personal?.linkedin && statItem('LinkedIn', '✓ Detected')}
                        {parsedData.skills.length > 0 && statItem('Skills', `${parsedData.skills.length} extracted`)}
                        {parsedData.education.length > 0 && statItem('Education', `${parsedData.education.length} entries`)}
                        {parsedData.experience.length > 0 && statItem('Experience', `${parsedData.experience.length} roles`)}
                        {parsedData.certifications.length > 0 && statItem('Certifications', `${parsedData.certifications.length} found`)}
                        {parsedData.personal?.bio && statItem('Summary', `${parsedData.personal.bio.length} chars`)}
                    </div>

                    {parsedData.skills.length > 0 && (
                        <div className="parsed-skills">
                            <span className="label">Skills Applied:</span>
                            <div className="skill-chips">
                                {parsedData.skills.map((s, i) => (
                                    <span key={i} className="chip">{s.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="parsed-actions">
                        <button className="upload-another-btn" onClick={() => { setParsedData(null); setApplied(false); setShowDebug(false); }}>
                            <Upload size={16} /> Upload Another
                        </button>
                        <button className="upload-another-btn" onClick={() => setShowDebug(!showDebug)}>
                            <FileText size={16} /> {showDebug ? 'Hide Debug' : 'Show Debug'}
                        </button>
                    </div>

                    {showDebug && (
                        <div className="debug-view animate-fade-in" style={{ marginTop: '1rem', padding: '1rem', background: '#1e1e1e', color: '#00ff00', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                            <p style={{ margin: '0 0 0.5rem', fontWeight: 700, borderBottom: '1px solid #333' }}>Raw Extracted Text:</p>
                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{debugText}</pre>
                            <p style={{ margin: '1rem 0 0.5rem', fontWeight: 700, borderBottom: '1px solid #333' }}>Parsed JSON:</p>
                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(parsedData, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .resume-tool { margin-bottom: 2rem; }
                .upload-zone {
                    display: flex; flex-direction: column; align-items: center; gap: 1rem;
                    padding: 3rem; border: 2px dashed var(--border); border-radius: var(--radius-lg);
                    cursor: pointer; transition: var(--transition); text-align: center; color: var(--primary);
                }
                .upload-zone:hover { border-color: var(--primary); background: rgba(79, 70, 229, 0.03); }
                .upload-title { font-weight: 700; font-size: 1rem; color: var(--text-main); }
                .upload-hint { font-size: 0.75rem; color: var(--text-muted); }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .parsed-result {
                    padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border);
                    transition: all 0.3s;
                }
                .parsed-result.success { border-color: var(--success); background: rgba(16, 185, 129, 0.03); }
                .parsed-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
                .parsed-header h3 { margin: 0; font-size: 1.1rem; }
                .parsed-header p { margin: 0; font-size: 0.85rem; }

                .parsed-summary {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem;
                    padding: 1.25rem; background: var(--bg-main); border-radius: var(--radius-md);
                }
                .stat-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
                .stat-label { font-weight: 700; color: var(--text-main); }
                .stat-value { color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }

                .parsed-skills { margin-bottom: 1.5rem; }
                .parsed-skills .label { display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; }
                .skill-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
                .chip {
                    background: rgba(79, 70, 229, 0.08); color: var(--primary);
                    padding: 0.25rem 0.6rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600;
                    border: 1px solid rgba(79, 70, 229, 0.2);
                }

                .parsed-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid var(--border); }
                .upload-another-btn {
                    display: flex; align-items: center; gap: 0.5rem;
                    padding: 0.6rem 1.25rem; border-radius: var(--radius-md);
                    font-weight: 600; font-size: 0.85rem; color: var(--primary);
                    border: 1px solid var(--primary); background: none; cursor: pointer;
                }
                .upload-another-btn:hover { background: rgba(79, 70, 229, 0.05); }

                @media (max-width: 768px) {
                    .upload-zone { padding: 2rem 1rem; }
                    .parsed-summary { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};
