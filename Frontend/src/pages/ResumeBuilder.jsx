import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const templates = [
  { id: 'classic', label: 'Classic', preview: '📄' },
  { id: 'modern', label: 'Modern', preview: '🗂️' },
  { id: 'minimal', label: 'Minimal', preview: '📃' }
];

const emptyEducation = { institution: '', degree: '', startYear: '', endYear: '', score: '' };
const emptyProject = { title: '', description: '', techStack: '', link: '' };
const emptyCertification = { title: '', issuer: '', year: '' };

const ResumeBuilder = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { data } = await api.get('/resume');
        setResume(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const { data } = await api.put('/resume', {
        template: resume.template,
        personalInfo: resume.personalInfo,
        education: resume.education,
        projects: resume.projects,
        skills: resume.skills,
        certifications: resume.certifications
      });
      setResume(data);
      setMessage('Resume saved successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const updatePersonalInfo = (field, value) => {
    setResume({ ...resume, personalInfo: { ...resume.personalInfo, [field]: value } });
  };

  const updateListItem = (listName, index, field, value) => {
    const list = [...resume[listName]];
    list[index] = { ...list[index], [field]: value };
    setResume({ ...resume, [listName]: list });
  };

  const addListItem = (listName, emptyItem) => {
    setResume({ ...resume, [listName]: [...resume[listName], { ...emptyItem }] });
  };

  const removeListItem = (listName, index) => {
    const list = [...resume[listName]];
    list.splice(index, 1);
    setResume({ ...resume, [listName]: list });
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setResume({ ...resume, skills: [...resume.skills, skillInput.trim()] });
    setSkillInput('');
  };

  const removeSkill = (idx) => {
    const skills = [...resume.skills];
    skills.splice(idx, 1);
    setResume({ ...resume, skills });
  };

  if (loading) return <p className="text-slate-400">Loading resume...</p>;
  if (!resume) return <p className="text-slate-400">Could not load resume.</p>;

  const atsColor = resume.atsScore >= 70 ? 'text-secondary' : resume.atsScore >= 40 ? 'text-accent' : 'text-danger';
  const atsBg = resume.atsScore >= 70 ? 'bg-emerald-50' : resume.atsScore >= 40 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <div>
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
        <div>
          <h1 className="text-xl font-bold">Resume Builder</h1>
          <p className="text-sm text-slate-500">Build a job-ready resume with ATS scoring.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${atsBg}`}>
            <span className="text-sm font-medium">ATS Score</span>
            <span className={`text-lg font-bold ${atsColor}`}>{resume.atsScore}/100</span>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handlePrint} className="btn-secondary bg-slate-200 text-slate-700 hover:bg-slate-300">
            Export PDF
          </button>
        </div>
      </div>

      {message && <div className="bg-emerald-50 text-emerald-600 text-sm rounded-lg p-3 mb-4 print:hidden">{message}</div>}

      {/* Template selector */}
      <div className="card mb-6 print:hidden">
        <h3 className="font-semibold mb-3">Choose Template</h3>
        <div className="flex gap-3 overflow-x-auto">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setResume({ ...resume, template: t.id })}
              className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 min-w-[100px] transition ${
                resume.template === t.id ? 'border-primary bg-indigo-50' : 'border-slate-200'
              }`}
            >
              <span className="text-3xl">{t.preview}</span>
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT: FORM */}
        <div className="space-y-6 print:hidden">
          {/* Personal Info */}
          <div className="card">
            <h3 className="font-semibold mb-3">👤 Personal Info</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input className="input-field" placeholder="Full Name" value={resume.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
              <input className="input-field" placeholder="Email" value={resume.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
              <input className="input-field" placeholder="Phone" value={resume.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
              <input className="input-field" placeholder="LinkedIn URL" value={resume.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} />
              <input className="input-field col-span-2" placeholder="GitHub URL" value={resume.personalInfo.github} onChange={(e) => updatePersonalInfo('github', e.target.value)} />
            </div>
            <textarea className="input-field" rows={3} placeholder="Professional summary (2-3 sentences)" value={resume.personalInfo.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)} />
          </div>

          {/* Education */}
          <div className="card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">🎓 Education</h3>
              <button onClick={() => addListItem('education', emptyEducation)} className="text-sm text-primary">+ Add</button>
            </div>
            <div className="space-y-3">
              {resume.education.map((ed, idx) => (
                <div key={idx} className="border border-slate-100 rounded-lg p-3 relative">
                  <button onClick={() => removeListItem('education', idx)} className="absolute top-2 right-2 text-slate-400 hover:text-danger text-sm">✕</button>
                  <div className="grid grid-cols-2 gap-2">
                    <input className="input-field" placeholder="Institution" value={ed.institution} onChange={(e) => updateListItem('education', idx, 'institution', e.target.value)} />
                    <input className="input-field" placeholder="Degree" value={ed.degree} onChange={(e) => updateListItem('education', idx, 'degree', e.target.value)} />
                    <input className="input-field" placeholder="Start Year" value={ed.startYear} onChange={(e) => updateListItem('education', idx, 'startYear', e.target.value)} />
                    <input className="input-field" placeholder="End Year" value={ed.endYear} onChange={(e) => updateListItem('education', idx, 'endYear', e.target.value)} />
                    <input className="input-field col-span-2" placeholder="Score / GPA" value={ed.score} onChange={(e) => updateListItem('education', idx, 'score', e.target.value)} />
                  </div>
                </div>
              ))}
              {resume.education.length === 0 && <p className="text-sm text-slate-400">No education added yet.</p>}
            </div>
          </div>

          {/* Projects */}
          <div className="card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">🚀 Projects</h3>
              <button onClick={() => addListItem('projects', emptyProject)} className="text-sm text-primary">+ Add</button>
            </div>
            <div className="space-y-3">
              {resume.projects.map((proj, idx) => (
                <div key={idx} className="border border-slate-100 rounded-lg p-3 relative">
                  <button onClick={() => removeListItem('projects', idx)} className="absolute top-2 right-2 text-slate-400 hover:text-danger text-sm">✕</button>
                  <div className="grid gap-2">
                    <input className="input-field" placeholder="Project Title" value={proj.title} onChange={(e) => updateListItem('projects', idx, 'title', e.target.value)} />
                    <textarea className="input-field" rows={2} placeholder="Description" value={proj.description} onChange={(e) => updateListItem('projects', idx, 'description', e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <input className="input-field" placeholder="Tech Stack" value={proj.techStack} onChange={(e) => updateListItem('projects', idx, 'techStack', e.target.value)} />
                      <input className="input-field" placeholder="Link (GitHub/Live)" value={proj.link} onChange={(e) => updateListItem('projects', idx, 'link', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              {resume.projects.length === 0 && <p className="text-sm text-slate-400">No projects added yet.</p>}
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h3 className="font-semibold mb-3">🛠️ Skills</h3>
            <div className="flex gap-2 mb-3">
              <input
                className="input-field"
                placeholder="e.g. React, SQL, Java"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button onClick={addSkill} className="btn-primary whitespace-nowrap">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((s, idx) => (
                <span key={idx} className="badge bg-indigo-50 text-primary flex items-center gap-1">
                  {s}
                  <button onClick={() => removeSkill(idx)} className="text-primary hover:text-danger">✕</button>
                </span>
              ))}
              {resume.skills.length === 0 && <p className="text-sm text-slate-400">No skills added yet.</p>}
            </div>
          </div>

          {/* Certifications */}
          <div className="card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">📜 Certifications</h3>
              <button onClick={() => addListItem('certifications', emptyCertification)} className="text-sm text-primary">+ Add</button>
            </div>
            <div className="space-y-3">
              {resume.certifications.map((cert, idx) => (
                <div key={idx} className="border border-slate-100 rounded-lg p-3 relative">
                  <button onClick={() => removeListItem('certifications', idx)} className="absolute top-2 right-2 text-slate-400 hover:text-danger text-sm">✕</button>
                  <div className="grid grid-cols-3 gap-2">
                    <input className="input-field col-span-2" placeholder="Title" value={cert.title} onChange={(e) => updateListItem('certifications', idx, 'title', e.target.value)} />
                    <input className="input-field" placeholder="Year" value={cert.year} onChange={(e) => updateListItem('certifications', idx, 'year', e.target.value)} />
                    <input className="input-field col-span-3" placeholder="Issuer" value={cert.issuer} onChange={(e) => updateListItem('certifications', idx, 'issuer', e.target.value)} />
                  </div>
                </div>
              ))}
              {resume.certifications.length === 0 && <p className="text-sm text-slate-400">No certifications added yet.</p>}
            </div>
          </div>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="lg:sticky lg:top-20 self-start">
          <div className="card print:shadow-none print:border-0" id="resume-preview">
            <div className={`${resume.template === 'modern' ? 'border-l-4 border-primary pl-4' : ''}`}>
              <h2 className="text-2xl font-bold">{resume.personalInfo.fullName || 'Your Name'}</h2>
              <p className="text-sm text-slate-500 flex flex-wrap gap-3 mt-1">
                {resume.personalInfo.email && <span>📧 {resume.personalInfo.email}</span>}
                {resume.personalInfo.phone && <span>📞 {resume.personalInfo.phone}</span>}
                {resume.personalInfo.linkedin && <span>🔗 {resume.personalInfo.linkedin}</span>}
                {resume.personalInfo.github && <span>💻 {resume.personalInfo.github}</span>}
              </p>

              {resume.personalInfo.summary && (
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">{resume.personalInfo.summary}</p>
              )}

              {resume.education.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold uppercase text-primary border-b border-slate-200 pb-1 mb-2">Education</h3>
                  {resume.education.map((ed, idx) => (
                    <div key={idx} className="mb-2 text-sm">
                      <p className="font-medium">{ed.institution || 'Institution'} {ed.degree && `— ${ed.degree}`}</p>
                      <p className="text-slate-500">{ed.startYear} - {ed.endYear} {ed.score && `• ${ed.score}`}</p>
                    </div>
                  ))}
                </div>
              )}

              {resume.projects.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold uppercase text-primary border-b border-slate-200 pb-1 mb-2">Projects</h3>
                  {resume.projects.map((proj, idx) => (
                    <div key={idx} className="mb-2 text-sm">
                      <p className="font-medium">{proj.title || 'Project Title'} {proj.link && <a href={proj.link} className="text-primary text-xs">↗</a>}</p>
                      <p className="text-slate-600">{proj.description}</p>
                      {proj.techStack && <p className="text-slate-400 text-xs mt-0.5">Tech: {proj.techStack}</p>}
                    </div>
                  ))}
                </div>
              )}

              {resume.skills.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold uppercase text-primary border-b border-slate-200 pb-1 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((s, idx) => (
                      <span key={idx} className="badge bg-slate-100 text-slate-700">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {resume.certifications.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold uppercase text-primary border-b border-slate-200 pb-1 mb-2">Certifications</h3>
                  {resume.certifications.map((cert, idx) => (
                    <div key={idx} className="mb-1 text-sm">
                      <p className="font-medium">{cert.title} {cert.issuer && `- ${cert.issuer}`} {cert.year && `(${cert.year})`}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 print:hidden">
            "Export PDF" uses your browser's print dialog — choose "Save as PDF" as the destination.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;