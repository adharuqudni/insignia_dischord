# Discord Task Scheduler - Frontend

A modern Next.js 14 application for managing and monitoring scheduled Discord webhook tasks.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod
- **State Management:** TanStack Query (React Query)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (main)/              # Main layout group
│   │   │   ├── dashboard/       # Dashboard page
│   │   │   ├── tasks/           # Tasks management
│   │   │   ├── logs/            # Logs viewer
│   │   │   └── layout.tsx       # Layout with sidebar
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home (redirects to dashboard)
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── dashboard/           # Dashboard components
│   │   ├── layout/              # Layout components (Sidebar)
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/
│   │   ├── api/                 # API client and services
│   │   └── utils.ts             # Utility functions
│   ├── types/                   # TypeScript type definitions
│   └── hooks/                   # Custom React hooks
├── public/                      # Static assets
└── package.json
```

## 🎨 Features Implemented

### Phase 1-4 Complete ✅

1. **Project Setup**
   - Next.js 14 with TypeScript and App Router
   - Tailwind CSS v4 configuration
   - shadcn/ui components installed
   - Custom color theme (success, warning, error)

2. **API Layer**
   - Axios client with interceptors
   - Task API service with full CRUD operations
   - TypeScript interfaces for all data models

3. **Layout & Navigation**
   - Root layout with Sonner toast notifications
   - Sidebar navigation component
   - Main layout with sidebar for authenticated pages
   - Responsive design

4. **Dashboard**
   - Statistics cards (Total Tasks, Active Tasks, Success Rate, Failed Executions)
   - Recent execution logs display
   - Loading states with skeleton components
   - Error handling

## 🔧 Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.local.example` to `.env.local` and update:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_API_KEY=your-secret-api-key-here
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 API Endpoints Used

The frontend expects the following API endpoints:

- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task status
- `POST /api/tasks/:id/execute` - Execute task manually
- `GET /api/tasks/:id/logs` - Get task logs
- `GET /api/logs` - List all logs

## 🎨 UI Components

All UI components are from shadcn/ui:
- Button, Input, Label
- Card, Badge, Table
- Dialog, Select, Textarea
- Form, Dropdown Menu, Tabs
- Alert, Separator, Skeleton
- Sonner (Toast notifications)

## 📝 Next Steps

The following features are ready to be implemented:

1. **Task Management** (Phase 5)
   - Task list view with filtering and sorting
   - Create task form with validation
   - Edit task functionality
   - Task actions (toggle, delete, execute)

2. **Logs Management**
   - Logs viewer with filtering
   - Pagination
   - Log details view

3. **Additional Features**
   - Form validation with Zod schemas
   - Real-time updates with React Query
   - Error boundaries
   - Loading states optimization
   - Responsive mobile design

## 🔗 Related Files

- Backend API: `../backend/`
- Project Documentation: `../PROJECT_PLAN.md`
- Implementation Checklist: `../IMPLEMENTATION_CHECKLIST.md`

## 📄 License

This project is part of the Discord Task Scheduler system.
