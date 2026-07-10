"use client";

import React, { useState, useRef } from "react";
import { ResumeData, ResumePreview, defaultResumeData } from "@/components/resume/ResumePreview";
import { useReactToPrint } from "react-to-print";
import { Printer, Save, ChevronLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { updateResumeContent } from "@/actions/resume";

export default function ResumeEditor({ initialData, resumeId }: { initialData: any, resumeId: string }) {
  const [data, setData] = useState<ResumeData>(
    initialData ? JSON.parse(initialData) : defaultResumeData
  );
  const [isSaving, setIsSaving] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: data.personalInfo.fullName ? `${data.personalInfo.fullName}_Resume` : "Resume",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await updateResumeContent(resumeId, JSON.stringify(data));
    setIsSaving(false);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addArrayItem = (key: 'experience' | 'education' | 'projects', emptyItem: any) => {
    setData(prev => ({
      ...prev,
      [key]: [...prev[key], { ...emptyItem, id: crypto.randomUUID() }]
    }));
  };

  const updateArrayItem = (key: 'experience' | 'education' | 'projects', id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].map((item: any) => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeArrayItem = (key: 'experience' | 'education' | 'projects', id: string) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].filter((item: any) => item.id !== id)
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden text-white">
      {/* Top Navbar */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-4">
          <Link href="/resume" className="text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold">Resume Editor</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
          <button 
            onClick={() => handlePrint()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Editor Form */}
        <div className="w-1/3 bg-zinc-950 border-r border-zinc-800 overflow-y-auto p-6 space-y-8">
          
          <section>
            <h2 className="text-lg font-semibold mb-4 border-b border-zinc-800 pb-2 text-blue-400">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={data.personalInfo.fullName} 
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={data.personalInfo.email} 
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Phone</label>
                  <input 
                    type="text" 
                    value={data.personalInfo.phone} 
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={data.personalInfo.location || ''} 
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Website</label>
                  <input 
                    type="text" 
                    value={data.personalInfo.website || ''} 
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">LinkedIn Profile</label>
                  <input 
                    type="text" 
                    value={data.personalInfo.linkedin} 
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">GitHub Profile</label>
                  <input 
                    type="text" 
                    value={data.personalInfo.github || ''} 
                    onChange={(e) => updatePersonalInfo('github', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4 border-b border-zinc-800 pb-2 text-blue-400">Professional Summary</h2>
            <textarea 
              value={data.summary} 
              onChange={(e) => setData({ ...data, summary: e.target.value })}
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </section>

          {/* Experience Section */}
          <section>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-4">
              <h2 className="text-lg font-semibold text-blue-400">Experience</h2>
              <button 
                onClick={() => addArrayItem('experience', { company: '', role: '', startDate: '', endDate: '', description: '' })}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={exp.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg space-y-3 relative group">
                  <button 
                    onClick={() => removeArrayItem('experience', exp.id)}
                    className="absolute top-3 right-3 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-6">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Company</label>
                      <input 
                        value={exp.company} onChange={(e) => updateArrayItem('experience', exp.id, 'company', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Role</label>
                      <input 
                        value={exp.role} onChange={(e) => updateArrayItem('experience', exp.id, 'role', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Start Date</label>
                      <input 
                        value={exp.startDate} onChange={(e) => updateArrayItem('experience', exp.id, 'startDate', e.target.value)} placeholder="e.g. Jun 2023"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">End Date</label>
                      <input 
                        value={exp.endDate} onChange={(e) => updateArrayItem('experience', exp.id, 'endDate', e.target.value)} placeholder="e.g. Present"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Description (Bullet points)</label>
                    <textarea 
                      value={exp.description} onChange={(e) => updateArrayItem('experience', exp.id, 'description', e.target.value)}
                      rows={4} placeholder="Did X by implementing Y resulting in Z..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
              {data.experience.length === 0 && <p className="text-sm text-zinc-500">No experience added.</p>}
            </div>
          </section>

          {/* Education Section */}
          <section>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-4">
              <h2 className="text-lg font-semibold text-blue-400">Education</h2>
              <button 
                onClick={() => addArrayItem('education', { school: '', degree: '', startDate: '', endDate: '', gpa: '' })}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-6">
              {data.education.map((edu, idx) => (
                <div key={edu.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg space-y-3 relative group">
                  <button 
                    onClick={() => removeArrayItem('education', edu.id)}
                    className="absolute top-3 right-3 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-6">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">School</label>
                      <input 
                        value={edu.school} onChange={(e) => updateArrayItem('education', edu.id, 'school', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Degree</label>
                      <input 
                        value={edu.degree} onChange={(e) => updateArrayItem('education', edu.id, 'degree', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Dates</label>
                      <div className="flex items-center gap-2">
                        <input value={edu.startDate} onChange={(e) => updateArrayItem('education', edu.id, 'startDate', e.target.value)} placeholder="Start" className="w-1/2 bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none" />
                        <input value={edu.endDate} onChange={(e) => updateArrayItem('education', edu.id, 'endDate', e.target.value)} placeholder="End" className="w-1/2 bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">GPA</label>
                      <input 
                        value={edu.gpa} onChange={(e) => updateArrayItem('education', edu.id, 'gpa', e.target.value)} placeholder="e.g. 3.8/4.0"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {data.education.length === 0 && <p className="text-sm text-zinc-500">No education added.</p>}
            </div>
          </section>

          {/* Projects Section */}
          <section>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-4">
              <h2 className="text-lg font-semibold text-blue-400">Projects</h2>
              <button 
                onClick={() => addArrayItem('projects', { name: '', techStack: '', link: '', description: '' })}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-6">
              {data.projects.map((proj, idx) => (
                <div key={proj.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg space-y-3 relative group">
                  <button 
                    onClick={() => removeArrayItem('projects', proj.id)}
                    className="absolute top-3 right-3 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-6">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Project Name</label>
                      <input 
                        value={proj.name} onChange={(e) => updateArrayItem('projects', proj.id, 'name', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Tech Stack</label>
                      <input 
                        value={proj.techStack} onChange={(e) => updateArrayItem('projects', proj.id, 'techStack', e.target.value)} placeholder="React, Node..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Link</label>
                    <input 
                      value={proj.link} onChange={(e) => updateArrayItem('projects', proj.id, 'link', e.target.value)} placeholder="github.com/..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Description (Bullet points)</label>
                    <textarea 
                      value={proj.description} onChange={(e) => updateArrayItem('projects', proj.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
              {data.projects.length === 0 && <p className="text-sm text-zinc-500">No projects added.</p>}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4 border-b border-zinc-800 pb-2 text-blue-400">Skills</h2>
            <textarea 
              value={data.skills} 
              onChange={(e) => setData({ ...data, skills: e.target.value })}
              rows={3}
              placeholder="e.g. JavaScript, React, Node.js"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </section>

        </div>

        {/* Right Side: Live Preview Area */}
        <div className="w-2/3 bg-zinc-900 overflow-y-auto p-10 flex justify-center items-start">
          {/* A4 Container Wrapper */}
          <div className="bg-white text-black shadow-2xl rounded-sm overflow-hidden" style={{ width: "210mm", minHeight: "297mm" }}>
            <ResumePreview data={data} ref={componentRef} />
          </div>
        </div>

      </div>
    </div>
  );
}
