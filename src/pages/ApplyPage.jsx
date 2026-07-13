import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApplyPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        rollNumber: '',
        email: '',
        mobile: '',
        year: '',
        department: '',
        division: '',
        prnNumber: '',
        teams: [],
        experience: '',
        projects: '',
        hackathons: '',
        achievements: '',
        linkedin: '',
        github: '',
        portfolio: '',
        whyJoin: '',
        contribution: '',
        availability: '',
        agreement: false
    });

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const teamOptions = [
        'Web Team',
        'Design Team',
        'Creative Team',
        'Photography Team',
        'Videography Team',
        'Content Team',
        'Social Media Team',
        'PR team',
        'Sponsorship Team'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTeamCheckbox = (teamName) => {
        setFormData(prev => {
            const alreadySelected = prev.teams.includes(teamName);
            const updatedTeams = alreadySelected
                ? prev.teams.filter(t => t !== teamName)
                : [...prev.teams, teamName];
            return { ...prev, teams: updatedTeams };
        });
    };

    const [showAdmin, setShowAdmin] = useState(false);
    const [localSubmissions, setLocalSubmissions] = useState([]);

    useEffect(() => {
        // Load initial submissions
        const apps = JSON.parse(localStorage.getItem('acm_applications') || '[]');
        setLocalSubmissions(apps);

        // Simple check if url contains ?admin=true
        if (window.location.search.includes('admin=true')) {
            setShowAdmin(true);
        }
    }, [submitted]);

    const clearSubmissions = () => {
        if (window.confirm("Are you sure you want to clear all submissions from local storage?")) {
            localStorage.removeItem('acm_applications');
            setLocalSubmissions([]);
        }
    };

    const downloadCSV = () => {
        if (localSubmissions.length === 0) return;
        const headers = ["Submitted At", "Full Name", "Roll Number", "Email", "Mobile", "Year", "Department", "Division", "PRN", "Teams", "LinkedIn", "GitHub", "Portfolio", "Why Join", "Contribution", "Availability"];
        const csvRows = [headers.join(",")];

        for (const sub of localSubmissions) {
            const values = [
                sub.submittedAt || '',
                sub.fullName || '',
                sub.rollNumber || '',
                sub.email || '',
                sub.mobile || '',
                sub.year || '',
                sub.department || '',
                sub.division || '',
                sub.prnNumber || '',
                (sub.teams || []).join(" | "),
                sub.linkedin || '',
                sub.github || '',
                sub.portfolio || '',
                (sub.whyJoin || '').replace(/"/g, '""'),
                (sub.contribution || '').replace(/"/g, '""'),
                sub.availability || ''
            ].map(val => `"${val}"`);
            csvRows.push(values.join(","));
        }

        const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `acm_membership_submissions_${new Date().toISOString().split('T')[0]}.csv`);
        a.click();
    };

    // Feel free to register a free key at https://web3forms.com/ and paste it below
    // to enable silent background email sending directly to rutujakhadse2006@gmail.com
    const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "a6c06616-834e-4d47-8c90-a4de5b0e54f5";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // 1. Save submission details in Local Storage
        const newSubmission = {
            ...formData,
            submittedAt: new Date().toLocaleString()
        };
        const updatedSubmissions = [...localSubmissions, newSubmission];
        localStorage.setItem('acm_applications', JSON.stringify(updatedSubmissions));
        setLocalSubmissions(updatedSubmissions);

        // 2. Prepare the email content details
        const emailBody = `ACM RSCOE Student Chapter Membership Application

01. PERSONAL DETAILS
--------------------------------------------------
Full Name: ${formData.fullName}
Roll Number (RBT No.): ${formData.rollNumber}
PRN Number: ${formData.prnNumber}
Personal Email: ${formData.email}
Mobile Number: ${formData.mobile}

02. ACADEMIC INFORMATION
--------------------------------------------------
Year: ${formData.year}
Department: ${formData.department}
Division: ${formData.division}

03. PREFERRED TEAMS & AVAILABILITY
--------------------------------------------------
Teams: ${(formData.teams || []).join(', ') || 'None selected'}
Availability: ${formData.availability}

04. PORTFOLIOS & PROFILES
--------------------------------------------------
LinkedIn: ${formData.linkedin || 'Not provided'}
GitHub: ${formData.github || 'Not provided'}
Portfolio: ${formData.portfolio || 'Not provided'}

05. STATEMENT OF PURPOSE
--------------------------------------------------
Why do you want to join ACM?
${formData.whyJoin}

How can you contribute to ACM?
${formData.contribution}

06. EXPERIENCE & PROJECTS
--------------------------------------------------
Previous Experience: ${formData.experience || 'None'}
Projects: ${formData.projects || 'None'}
Hackathons Participated: ${formData.hackathons || 'None'}
Achievements: ${formData.achievements || 'None'}
`;

        // 3. Try to submit silently in the background via Web3Forms if key is provided
        if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== "YOUR_ACCESS_KEY_HERE" && WEB3FORMS_ACCESS_KEY !== "") {
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_ACCESS_KEY,
                        subject: `New ACM Membership Application - ${formData.fullName}`,
                        from_name: "ACM RSCOE Membership Portal",
                        to_email: "rutujakhadse2006@gmail.com",
                        message: emailBody,
                        ...formData,
                        teams: (formData.teams || []).join(', ')
                    })
                });

                if (response.ok) {
                    setSubmitting(false);
                    setSubmitted(true);
                    return;
                }
            } catch (err) {
                console.error("Web3Forms silent submit failed, falling back to mailto", err);
            }
        }

        // 4. Fallback: Compose mailto link if key is not configured or fails
        const subject = encodeURIComponent(`ACM RSCOE Student Chapter Application - ${formData.fullName}`);
        const body = encodeURIComponent(emailBody);

        setTimeout(() => {
            window.location.href = `mailto:rutujakhadse2006@gmail.com?subject=${subject}&body=${body}`;
            setSubmitting(false);
            setSubmitted(true);
        }, 1200);
    };

    if (showAdmin) {
        return (
            <main style={{
                background: '#030712',
                minHeight: '100vh',
                padding: '120px 20px 80px',
                position: 'relative',
                color: '#fff',
                fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8' }}>
                                SUBMISSIONS DASHBOARD
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '5px' }}>
                                Total Applications: {localSubmissions.length}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={downloadCSV} className="admin-btn" style={{ background: '#38bdf8', color: '#030712', fontWeight: 700, border: 'none' }}>
                                Download CSV
                            </button>
                            <button onClick={clearSubmissions} className="admin-btn" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444' }}>
                                Clear Submissions
                            </button>
                            <a href="/apply" className="admin-btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                Back to Form
                            </a>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(17,21,31,0.55)',
                        backdropFilter: 'blur(16px)',
                        borderRadius: '16px',
                        border: '1px solid rgba(56,189,248,0.15)',
                        overflow: 'auto',
                        maxHeight: '70vh'
                    }}>
                        {localSubmissions.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                                No submissions found in local storage yet.
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(56,189,248,0.05)' }}>
                                        <th style={{ padding: '16px' }}>Date</th>
                                        <th style={{ padding: '16px' }}>Name</th>
                                        <th style={{ padding: '16px' }}>Roll Number</th>
                                        <th style={{ padding: '16px' }}>Email</th>
                                        <th style={{ padding: '16px' }}>Mobile</th>
                                        <th style={{ padding: '16px' }}>Year/Dept</th>
                                        <th style={{ padding: '16px' }}>Selected Teams</th>
                                        <th style={{ padding: '16px' }}>Profiles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {localSubmissions.map((sub, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)' }}>{sub.submittedAt}</td>
                                            <td style={{ padding: '16px', fontWeight: 600 }}>{sub.fullName}</td>
                                            <td style={{ padding: '16px' }}>{sub.rollNumber}</td>
                                            <td style={{ padding: '16px', color: '#38bdf8' }}>{sub.email}</td>
                                            <td style={{ padding: '16px' }}>{sub.mobile}</td>
                                            <td style={{ padding: '16px' }}>{sub.year} - {sub.department} ({sub.division})</td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                    {(sub.teams || []).map(t => (
                                                        <span key={t} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}>
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {sub.linkedin && <a href={sub.linkedin} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>LinkedIn</a>}
                                                    {sub.github && <a href={sub.github} target="_blank" rel="noreferrer" style={{ color: '#a78bfa' }}>GitHub</a>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <style>{`
                    .admin-btn {
                        padding: 10px 20px;
                        border-radius: 8px;
                        font-family: Orbitron, sans-serif;
                        font-size: 0.72rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    .admin-btn:hover {
                        transform: translateY(-2px);
                        filter: brightness(1.15);
                    }
                `}</style>
            </main>
        );
    }

    return (
        <main style={{
            background: '#030712',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 20px 80px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Glow Effects */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '800px', width: '100%', position: 'relative', zIndex: 5 }}>
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div
                            key="form-card"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                background: 'rgba(17,21,31,0.55)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgba(56,189,248,0.18)',
                                borderRadius: '24px',
                                padding: '40px 32px',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                            }}
                        >
                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <h1 style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                                    fontWeight: 900,
                                    color: '#fff',
                                    marginBottom: '12px',
                                    letterSpacing: '0.04em',
                                    textTransform: 'uppercase'
                                }}>
                                    ACM RSCOE <span style={{ color: '#38bdf8' }}>Membership Form</span>
                                </h1>
                                <p style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.6,
                                    maxWidth: '600px',
                                    margin: '0 auto'
                                }}>
                                    Thank you for your interest in joining ACM RSCOE Student Chapter. Please complete the following information so that we can connect you with the appropriate team.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                                {/* Group 1: Personal Details */}
                                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                                    <legend style={{ color: '#38bdf8', fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase' }}>
                                        01. Personal Details
                                    </legend>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Full Name *</label>
                                            <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. John Doe" className="form-input" />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Personal Email *</label>
                                            <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="e.g. john@gmail.com" className="form-input" />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Mobile Number *</label>
                                            <input required type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="10-digit number" className="form-input" />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Roll Number (RBT No.) *</label>
                                            <input required type="text" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} placeholder="e.g. RBT22CO001" className="form-input" />
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Group 2: Academic Info */}
                                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                                    <legend style={{ color: '#38bdf8', fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase' }}>
                                        02. Academic Information
                                    </legend>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Year *</label>
                                            <select required name="year" value={formData.year} onChange={handleInputChange} className="form-select">
                                                <option value="">Select Year</option>
                                                <option value="First Year">First Year</option>
                                                <option value="Second Year">Second Year</option>
                                                <option value="Third Year">Third Year</option>
                                                <option value="Final Year">Final Year</option>
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Department *</label>
                                            <input required type="text" name="department" value={formData.department} onChange={handleInputChange} placeholder="e.g. Computer Engineering" className="form-input" />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Division *</label>
                                            <input required type="text" name="division" value={formData.division} onChange={handleInputChange} placeholder="e.g. A" className="form-input" />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>PRN Number *</label>
                                            <input required type="text" name="prnNumber" value={formData.prnNumber} onChange={handleInputChange} placeholder="e.g. 72314567G" className="form-input" />
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Group 3: Preferred Teams */}
                                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                                    <legend style={{ color: '#38bdf8', fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>
                                        03. Preferred Team(s) to Join *
                                    </legend>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
                                        Select all options that apply to you.
                                    </p>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                        gap: '12px'
                                    }}>
                                        {teamOptions.map(team => {
                                            const selected = formData.teams.includes(team);
                                            return (
                                                <div
                                                    key={team}
                                                    onClick={() => handleTeamCheckbox(team)}
                                                    style={{
                                                        padding: '12px 16px',
                                                        borderRadius: '10px',
                                                        background: selected ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.03)',
                                                        border: selected ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                                                        color: selected ? '#38bdf8' : 'rgba(255,255,255,0.7)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.25s ease',
                                                        fontFamily: 'Inter, sans-serif',
                                                        fontSize: '0.78rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '14px',
                                                        height: '14px',
                                                        borderRadius: '3px',
                                                        border: '1.5px solid ' + (selected ? '#38bdf8' : 'rgba(255,255,255,0.4)'),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.6rem'
                                                    }}>
                                                        {selected && '✓'}
                                                    </div>
                                                    {team}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </fieldset>

                                {/* Group 4: Projects & Experience */}
                                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                                    <legend style={{ color: '#38bdf8', fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase' }}>
                                        04. Experience & Projects
                                    </legend>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Previous Experience</label>
                                            <textarea name="experience" value={formData.experience} onChange={handleInputChange} rows="3" placeholder="Tell us about any previous committees, roles, or organization experience..." className="form-textarea"></textarea>
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Projects</label>
                                            <textarea name="projects" value={formData.projects} onChange={handleInputChange} rows="3" placeholder="Briefly describe projects you've built or worked on..." className="form-textarea"></textarea>
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Hackathons Participated</label>
                                            <textarea name="hackathons" value={formData.hackathons} onChange={handleInputChange} rows="3" placeholder="Mention hackathons or coding contests you took part in..." className="form-textarea"></textarea>
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Achievements</label>
                                            <textarea name="achievements" value={formData.achievements} onChange={handleInputChange} rows="3" placeholder="List any key academic, sports, or extracurricular achievements..." className="form-textarea"></textarea>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Group 5: Profiles & Links */}
                                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                                    <legend style={{ color: '#38bdf8', fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase' }}>
                                        05. Profiles & Portfolios
                                    </legend>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>LinkedIn Profile</label>
                                            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/username" className="form-input" />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>GitHub Profile</label>
                                            <input type="url" name="github" value={formData.github} onChange={handleInputChange} placeholder="https://github.com/username" className="form-input" />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Portfolio Website</label>
                                            <input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} placeholder="https://yourportfolio.com" className="form-input" />
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Group 6: Questions & availability */}
                                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                                    <legend style={{ color: '#38bdf8', fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase' }}>
                                        06. Statement of Purpose & availability
                                    </legend>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Why do you want to join ACM? *</label>
                                            <textarea required name="whyJoin" value={formData.whyJoin} onChange={handleInputChange} rows="4" placeholder="Write a brief SOP on your motivation to join..." className="form-textarea"></textarea>
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>How can you contribute to ACM? *</label>
                                            <textarea required name="contribution" value={formData.contribution} onChange={handleInputChange} rows="4" placeholder="Mention your skills, ideas, or how you plan to help grow the chapter..." className="form-textarea"></textarea>
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', color: '#fff', fontSize: '0.75rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Availability *</label>
                                            <select required name="availability" value={formData.availability} onChange={handleInputChange} className="form-select">
                                                <option value="">Select availability</option>
                                                <option value="Weekdays">Weekdays</option>
                                                <option value="Weekends">Weekends</option>
                                                <option value="Both">Both (Weekdays & Weekends)</option>
                                            </select>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Agreement Checkbox */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '10px' }}>
                                    <input
                                        required
                                        type="checkbox"
                                        id="agreement"
                                        name="agreement"
                                        checked={formData.agreement}
                                        onChange={handleInputChange}
                                        style={{ marginTop: '3px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="agreement" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.4, cursor: 'pointer' }}>
                                        I agree to actively participate in ACM activities, maintain regular attendance, and work collaboratively to support the growth of the ACM RSCOE Student Chapter.
                                    </label>
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #38bdf8, #60a5fa)',
                                        border: 'none',
                                        color: '#030712',
                                        fontFamily: 'Orbitron, sans-serif',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        transition: 'all 0.35s ease',
                                        boxShadow: '0 0 20px rgba(56,189,248,0.2)'
                                    }}
                                    className="apply-submit-btn"
                                >
                                    {submitting ? 'Submitting Application...' : 'Submit Application →'}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-card"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                background: 'rgba(17,21,31,0.65)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgba(52,211,153,0.3)',
                                borderRadius: '24px',
                                padding: '50px 32px',
                                textAlign: 'center',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'rgba(52,211,153,0.1)',
                                border: '2px solid #34d399',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                margin: '0 auto 24px',
                                color: '#34d399',
                                boxShadow: '0 0 30px rgba(52,211,153,0.2)'
                            }}>
                                ✓
                            </div>
                            <h2 style={{
                                fontFamily: 'Orbitron, sans-serif',
                                fontSize: '1.8rem',
                                fontWeight: 900,
                                color: '#fff',
                                marginBottom: '16px'
                            }}>
                                Application Submitted!
                            </h2>
                            <p style={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '0.95rem',
                                lineHeight: 1.7,
                                maxWidth: '500px',
                                margin: '0 auto 32px',
                                fontFamily: 'Inter, sans-serif'
                            }}>
                                Thank you for applying to the ACM RSCOE Student Chapter. Our team will review your application and reach out to you via email shortly!
                            </p>
                            <a
                                href="/"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '12px 28px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    fontSize: '0.75rem',
                                    fontFamily: 'Orbitron, sans-serif',
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.3s ease'
                                }}
                                className="success-home-btn"
                            >
                                Go Back Home
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }
        .form-input:focus {
          border-color: #38bdf8;
          background: rgba(255,255,255,0.07);
          outline: none;
          box-shadow: 0 0 12px rgba(56,189,248,0.25);
        }

        .form-select {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          appearance: none;
          cursor: pointer;
        }
        .form-select:focus {
          border-color: #38bdf8;
          background: rgba(255,255,255,0.07);
          outline: none;
          box-shadow: 0 0 12px rgba(56,189,248,0.25);
        }
        .form-select option {
          background: #0d111d;
          color: #fff;
        }

        .form-textarea {
          width: 100%;
          padding: 14px 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          resize: vertical;
        }
        .form-textarea:focus {
          border-color: #38bdf8;
          background: rgba(255,255,255,0.07);
          outline: none;
          box-shadow: 0 0 12px rgba(56,189,248,0.25);
        }

        .apply-submit-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
          box-shadow: 0 0 35px rgba(56,189,248,0.45);
        }
        .apply-submit-btn:active {
          transform: translateY(0);
        }

        .success-home-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }
      `}</style>
        </main>
    );
}
