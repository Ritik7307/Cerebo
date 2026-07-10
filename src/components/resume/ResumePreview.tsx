import React, { forwardRef } from 'react';

export type ResumeData = {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    link: string;
    techStack: string;
  }>;
  skills: string;
};

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    website: "johndoe.com",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe"
  },
  summary: "Software Engineer with a passion for building scalable web applications.",
  experience: [],
  education: [],
  projects: [],
  skills: "JavaScript, TypeScript, React, Node.js, Python, SQL"
};

interface ResumePreviewProps {
  data: ResumeData;
}

// Ensure it's forwarded for react-to-print
export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data }, ref) => {
  const { personalInfo, summary, experience, education, projects, skills } = data;

  const Link = ({ href, children }: { href: string, children: React.ReactNode }) => {
    if (!href) return null;
    const url = href.startsWith('http') ? href : `https://${href}`;
    return (
      <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
        {children}
      </a>
    );
  };

  return (
    <div 
      ref={ref} 
      className="bg-white text-black print:text-black w-full mx-auto shadow-2xl print:shadow-none"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm", // Standard A4 padding
        boxSizing: "border-box",
        fontFamily: "'Times New Roman', Times, serif" // Classic Harvard resume font
      }}
    >
      {/* HEADER */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 tracking-tight uppercase" style={{ letterSpacing: '0.05em' }}>{personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-700">
          {personalInfo.email && <Link href={`mailto:${personalInfo.email}`}>{personalInfo.email}</Link>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-700 mt-1">
          {personalInfo.website && <Link href={personalInfo.website}>{personalInfo.website}</Link>}
          {personalInfo.linkedin && <Link href={personalInfo.linkedin}>{personalInfo.linkedin}</Link>}
          {personalInfo.github && <Link href={personalInfo.github}>{personalInfo.github}</Link>}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div className="mb-5">
          <p className="text-[11pt] leading-relaxed text-justify">{summary}</p>
        </div>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[12pt] font-bold uppercase border-b border-black pb-1 mb-3 tracking-widest">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline font-bold">
                <span className="text-[11pt]">{edu.school}</span>
                <span className="text-[10pt] font-normal italic whitespace-nowrap ml-4">
                  {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline italic text-[11pt]">
                <span>{edu.degree}</span>
                {edu.gpa && <span className="font-normal text-[10pt]">GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[12pt] font-bold uppercase border-b border-black pb-1 mb-3 tracking-widest">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline font-bold">
                <span className="text-[11pt]">{exp.company}</span>
                <span className="text-[10pt] font-normal italic whitespace-nowrap ml-4">
                  {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                </span>
              </div>
              <div className="text-[11pt] italic mb-1">{exp.role}</div>
              {exp.description && (
                <ul className="list-disc list-outside ml-5 text-[11pt] space-y-1">
                  {exp.description.split('\n').filter(Boolean).map((bullet, idx) => (
                    <li key={idx} className="pl-1 text-justify">{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[12pt] font-bold uppercase border-b border-black pb-1 mb-3 tracking-widest">Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-[11pt]">{proj.name}</span>
                {proj.link && (
                  <span className="text-[10pt]">
                    | <Link href={proj.link}>{proj.link.replace(/^https?:\/\//, '')}</Link>
                  </span>
                )}
                {proj.techStack && (
                  <span className="italic text-[10pt] ml-auto">{proj.techStack}</span>
                )}
              </div>
              {proj.description && (
                <ul className="list-disc list-outside ml-5 text-[11pt] space-y-1">
                  {proj.description.split('\n').filter(Boolean).map((bullet, idx) => (
                    <li key={idx} className="pl-1 text-justify">{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {skills && (
        <div>
          <h2 className="text-[12pt] font-bold uppercase border-b border-black pb-1 mb-3 tracking-widest">Skills</h2>
          <p className="text-[11pt] leading-relaxed text-justify">
            {skills}
          </p>
        </div>
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
