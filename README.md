# Dress Stitching Website

A mobile-first React website for a ladies' custom dress stitching center. Built with modern web technologies and optimized for mobile devices.

## Features

- **Mobile-First Design**: Optimized for mobile devices with 360px baseline width
- **Role-Based Navigation**: Different navigation for public users, customers, and administrators
- **Responsive Design**: Tailwind CSS with custom breakpoints and touch-friendly interactions
- **Modern Tech Stack**: React 18, TypeScript, Vite, and Tailwind CSS

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom Rose & Cream theme
- **Routing**: React Router DOM v6+
- **Icons**: Lucide React for consistent iconography
- **Testing**: Jest with React Testing Library and Fast-check for property-based testing

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── App.tsx        # Main application component
├── main.tsx       # Application entry point
└── index.css      # Global styles with Tailwind
```

## Design System

### Colors
- **Primary**: Rose 600 (#e11d48) for CTAs and active states
- **Background**: Rose 50 (#fff1f2) for subtle backgrounds
- **Text**: Slate 800 (#1e293b) for primary text content

### Mobile-First Breakpoints
- `xs`: 360px (baseline mobile)
- `sm`: 640px (small tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

### Touch Accessibility
- Minimum 48px height for all interactive elements
- 16px minimum font size for inputs (prevents iOS zoom)
- Optimized touch targets and spacing

## Development Guidelines

- Follow mobile-first design principles
- Ensure all interactive elements meet touch accessibility standards
- Use semantic HTML and proper ARIA labels
- Test on actual mobile devices when possible
- Maintain consistent spacing and typography scales