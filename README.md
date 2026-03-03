# EduAI - Modern Educational Platform

A modern Next.js 14 application with TypeScript, Tailwind CSS, and built-in API routes.

## Features

- ✅ **Next.js 14** with App Router
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling
- ✅ **ESLint** configuration
- ✅ Responsive design
- ✅ Reusable component structure
- ✅ API routes ready
- ✅ Minimal dependencies

## Project Structure

```
.
├── app/                 # App Router pages and layouts
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard page
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # Reusable React components
│   ├── Header.tsx      # Navigation header
│   ├── Button.tsx      # Reusable button component
│   └── Card.tsx        # Reusable card component
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── tailwind.config.ts  # Tailwind CSS config
├── next.config.js      # Next.js config
└── .eslintrc.json      # ESLint config
```

## Getting Started

### Prerequisites

- Node.js 18.17+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the homepage.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Configuration

This project uses a third‑party AI chatbot service to generate lesson plans.
You must provide an API key via an environment variable before starting the
server:

```bash
# any of the following names will be read by the code
export EDU_CHATBOT_KEY="<your key>"
# or
export HUGGINGFACE_API_KEY="<your key>"
```

The example implementation in `app/api/generate-lesson/route.ts` targets a
Hugging Face text-inference endpoint (`google/flan-t5-large`), but you can
point it at any provider that supports educational keys by editing the URL
and request format.

If the key is missing, the endpoint will return a 500 error with a
"AI chatbot key not configured" message.

## Project Pages

- **Home** (`/`) - Landing page with features overview
- **Dashboard** (`/dashboard`) - User dashboard with stats and progress tracking
- **API** (`/api`) - Example API endpoint

## Components

### Header
Navigation component with links to home and dashboard.

### Button
Reusable button with variants:
- `primary` - Blue button (default)
- `secondary` - Gray button

### Card
Container component for content with optional title and description.

## Styling

This project uses **Tailwind CSS** for all styling. Customize theme in `tailwind.config.ts`.

## API Routes

The `app/api/` directory contains API endpoints. Example:
- GET `/api` - Returns API information

## Best Practices

- Use TypeScript for type safety
- Leverage Tailwind's utility classes
- Keep components small and reusable
- Follow the App Router structure
- Use path aliases (`@/`) for imports

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org)

## License

MIT
