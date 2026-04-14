# 🧠 EduAI

<div align="center">
  
[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-4FC08D?logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

<div align="center">

## 🎓 **AI-Powered Teaching Assistant**
### Create lessons, homework, activities & student feedback in **minutes** 🚀
*Powered by cutting-edge AI, aligned with **CBSE & NEP 2020** guidelines*

</div>

## ✨ **Features**

| Feature | Description | 🎯 Benefit |
|---------|-------------|------------|
| 📚 **Lesson Generator** | Structured lessons with objectives, activities & worksheets | Save 2-3 hours per lesson plan |
| ✏️ **Homework Generator** | Custom worksheets with answer keys | Personalized practice instantly |
| 🎮 **Activities** | 10-min classroom engagement ideas | Boost participation effortlessly |
| 📝 **Report Comments** | 100+ professional report card phrases | Grade smarter, not harder |
| 📊 **Student Analysis** | AI-powered improvement recommendations from marks | Data-driven teaching insights |

**Additional Superpowers:**
- 👤 **Personal Dashboard** - Track your lessons, view history & stats
- 📥 **PDF Export** - Print-ready documents with one click
- 🔢 **Live Stats** - Platform-wide lesson generation counter
- 🔐 **Secure Auth** - Login to save & access your content anytime
- 📱 **Fully Responsive** - Works on desktop, tablet & mobile
- ⚡ **Fast AI** - Generate content in seconds

## 🛠 **Tech Stack**

```
Frontend: Next.js 14 (App Router) + React 18 + TypeScript 5.9 + TailwindCSS 3.3
Backend: Prisma ORM + PostgreSQL + NextAuth v5 + Zod Validation
AI: Custom API routes (/api/generate-*)
Utils: jsPDF/html2canvas (PDF), React Context/Hooks
Dev: ESLint + Prettier + PostCSS + Autoprefixer
Deployment: Vercel/Netlify (serverless ready)
```

<details>
<summary>🔍 Full Dependencies</summary>

```json
{
  \"dependencies\": {
    \"@prisma/client\": \"^6.19.3\",
    \"next-auth\": \"^5.0.0-beta.24\",
    \"next\": \"^14.2.3\",
    \"react\": \"^18.3.1\"
  }
}
```

</details>

## ⚡ **Quick Start**

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/eduai.git
cd eduai

# 2. Install dependencies
npm install

# 3. Setup Environment (create .env)
cp .env.example .env
# Add your vars:
# DATABASE_URL=\"postgresql://user:pass@localhost:5432/eduai\"
# NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\"
# NEXTAUTH_URL=\"http://localhost:3000\"

# 4. Database Setup
npx prisma generate
npx prisma db push  # or migrate for production
npx prisma db seed   # optional seed data

# 5. Run Development Server
npm run dev

# Open http://localhost:3000
```

<details>
<summary>🧪 Environment Variables</summary>

| Var | Required | Description |
|-----|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Auth secret (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | ✅ | App URL (http://localhost:3000 in dev) |

</details>

## 🔌 **API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate-lesson` | `{topic, grade, duration}` → Full lesson plan |
| `POST` | `/api/generate-homework` | `{subject, topic, questions}` → Worksheet + answers |
| `POST` | `/api/generate-activity` | `{topic, time: 10}` → Quick activity |
| `POST` | `/api/generate-comment` | `{subject, performance}` → Report phrase |
| `POST` | `/api/analyze-student` | `{marks: {Math:80,...}}` → Analysis + tips |
| `GET` | `/api/stats` | Global lesson counter |
| `GET` | `/api/user-lessons` | User's lesson history |

## 🏗 **Architecture**

```mermaid
graph TB
    A[Next.js App Router] --> B["API Routes /api/generate-*"]
    B --> C[Prisma Client]
    C --> D[PostgreSQL]
    E[NextAuth] --> F[User Sessions]
    G[Dashboard] --> H["PDF Export jsPDF"]
    A -.->|"Tailwind UI"| I[Components]
    J["AI Service OpenAI"] -.->|"Prompts"| B
```

## 🗄 **Database Schema**

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  lessons       Lesson[]
  analyses      Analysis[]
  lessonCount   Int      @default(0)
}

model Lesson {
  id        String   @id @default(cuid())
  content   String   // Full generated lesson
  metadata  Json?    // {title, topic, grade}
  userId    String?
}
```

## 🌟 **Future Features**
- [ ] 🔗 Lesson templates & sharing
- [ ] 🤖 Multi-AI provider support (GPT + Grok/Claude)
- [ ] 📱 PWA/Offline mode
- [ ] 👥 Multi-teacher collaboration
- [ ] 📊 Advanced analytics dashboard
- [ ] 🌍 Multi-language support
- [ ] 🎨 Custom branding/themes

## 🤝 **Contributing**

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

**Guidelines:**
- Follow existing code style (ESLint)
- Write tests for new features
- Update docs/README
- Keep PRs focused (1 feature max)

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file.

<div align="center">

**Made with ❤️ by [Vipin Gupta](https://github.com/Vipinn29)**  
⭐ **Star on GitHub** if this helps you save teaching time!

</div>
