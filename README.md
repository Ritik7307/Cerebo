# Cerebo

Cerebo is an all-in-one, AI-powered career and learning platform designed specifically for students, software engineers, and job seekers. It centralizes everything you need to upskill, manage projects, and land your dream job in one sleek, dark-themed dashboard.

## 🚀 Features

- **AI Roadmap Generator:** Instantly generate detailed, step-by-step curriculum roadmaps for any topic (e.g., "System Design for Netflix", "Advanced Dynamic Programming") powered by Groq's LLMs.
- **Company-wise Interview Guides:** Generate exhaustive lists of coding interview questions (OA & Onsite) categorized by companies and difficulty levels.
- **YouTube Learning Hub:** Import any YouTube playlist directly into Cerebo. Track your progress per video and utilize an integrated Pomodoro focus timer while watching.
- **Project Kanban Board:** Keep track of your personal projects, tech stacks, and progress via a drag-and-drop Kanban board.
- **Internship Tracker:** Manage all your job and internship applications (Applied, Interviewing, Offered, Rejected) in one place.
- **ATS Resume Manager:** Store multiple versions of your resume, track their ATS scores, and toggle your "Main" resume seamlessly.
- **Event Calendar:** Keep track of interviews, coding contests, and deadlines.
- **Analytics & Heatmap:** Visualize your learning consistency with a GitHub-style activity heatmap and interactive charts.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **AI Integration:** [Groq API](https://groq.com/)
- **Icons:** Lucide React
- **Charts:** Recharts

## ⚙️ Local Setup

Follow these steps to get the project running on your local machine.

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed locally or a cloud database URL (e.g., Supabase, Neon)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/cerebo.git
cd cerebo
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Environment Variables
Create a \`.env\` file in the root directory and add the following variables:

\`\`\`env
# Prisma Database URL
DATABASE_URL="postgresql://user:password@localhost:5432/cerebo?schema=public"

# Groq API Key (for AI features)
GROQ_API_KEY="your_groq_api_key_here"

# YouTube Data API Key (for importing learning playlists)
YOUTUBE_API_KEY="your_youtube_api_key_here"
\`\`\`

### 4. Setup the Database
Push the Prisma schema to your PostgreSQL database:
\`\`\`bash
npx prisma db push
\`\`\`

*(Optional) Seed the database if a seed script is provided:*
\`\`\`bash
npx prisma db seed
\`\`\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🤝 Contributing

Contributions are always welcome! Feel free to open an issue or submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.
