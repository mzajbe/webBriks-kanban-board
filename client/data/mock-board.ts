import { Board, BoardItem, Column, User } from '@/types/kanban';

export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Rivera',
  email: 'alex@timetoprogram.com',
  initials: 'AR',
  color: 'bg-rose-900 text-rose-100',
};

export const teamMembers: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: 'Maya Chen',
    email: 'maya@timetoprogram.com',
    initials: 'MC',
    color: 'bg-amber-700 text-amber-100',
  },
  {
    id: 'user-3',
    name: 'Sarah Chen',
    email: 'sarah@timetoprogram.com',
    initials: 'SC',
    color: 'bg-emerald-700 text-emerald-100',
  },
  {
    id: 'user-4',
    name: 'Marcus Vance',
    email: 'marcus@timetoprogram.com',
    initials: 'MV',
    color: 'bg-purple-700 text-purple-100',
  },
  {
    id: 'user-5',
    name: 'Elena Rostova',
    email: 'elena@timetoprogram.com',
    initials: 'ER',
    color: 'bg-sky-700 text-sky-100',
  },
];

export const sidebarBoards: BoardItem[] = [
  {
    id: 'board-1',
    name: 'Product Roadmap',
    iconLetter: 'P',
    iconBg: 'bg-emerald-100',
    iconTextColor: 'text-emerald-700',
    count: 18,
    active: true,
  },
  {
    id: 'board-2',
    name: 'Design System',
    iconLetter: 'D',
    iconBg: 'bg-teal-100',
    iconTextColor: 'text-teal-700',
    count: 8,
  },
  {
    id: 'board-3',
    name: 'Mobile App Launch',
    iconLetter: 'M',
    iconBg: 'bg-orange-100',
    iconTextColor: 'text-orange-700',
    count: 10,
  },
  {
    id: 'board-4',
    name: 'Engineering Sprint',
    iconLetter: 'E',
    iconBg: 'bg-slate-100',
    iconTextColor: 'text-slate-700',
    count: 10,
  },
  {
    id: 'board-5',
    name: 'Website Redesign',
    iconLetter: 'W',
    iconBg: 'bg-indigo-100',
    iconTextColor: 'text-indigo-700',
    count: 7,
  },
];

export const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'Todo',
    dotColor: 'bg-rose-500',
    bgTint: 'bg-[#FFF5F5]/60',
    borderTint: 'border-rose-100/70',
    badgeBg: 'bg-rose-100/80',
    badgeText: 'text-rose-700',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    dotColor: 'bg-amber-500',
    bgTint: 'bg-[#FFF9F2]/60',
    borderTint: 'border-amber-100/70',
    badgeBg: 'bg-amber-100/80',
    badgeText: 'text-amber-700',
  },
  {
    id: 'review',
    title: 'Review',
    dotColor: 'bg-sky-500',
    bgTint: 'bg-[#F0F7FF]/60',
    borderTint: 'border-sky-100/70',
    badgeBg: 'bg-sky-100/80',
    badgeText: 'text-sky-700',
  },
  {
    id: 'done',
    title: 'Done',
    dotColor: 'bg-purple-500',
    bgTint: 'bg-[#F8F5FF]/60',
    borderTint: 'border-purple-100/70',
    badgeBg: 'bg-purple-100/80',
    badgeText: 'text-purple-700',
  },
];

export const initialBoard: Board = {
  id: 'board-product-roadmap',
  name: 'Product Roadmap',
  subtitle: 'Quarterly planning, OKRs and feature prioritization.',
  totalTasks: 22,
  columns: initialColumns,
  tasks: [
    // TODO Tasks (12 total)
    {
      id: 'task-1',
      title: 'Add middleware or logic to enforce authorization rules, role-based access...',
      description: 'Ensure security policies and role checks are validated on edge routes.',
      priority: 'URGENT',
      columnId: 'todo',
      position: 0,
      subtasks: { completed: 1, total: 4 },
      commentsCount: 3,
    },
    {
      id: 'task-2',
      title: 'Test and Secure Authentication Flows',
      description: 'Conduct thorough unit, integration, and security testing of all authentication and authorization flows.',
      priority: 'URGENT',
      columnId: 'todo',
      position: 1,
      subtasks: { completed: 0, total: 3 },
      commentsCount: 5,
    },
    {
      id: 'task-3',
      title: 'Develop Cart Review & Initial Checkout',
      description: 'Create the front-end page allowing users to review cart contents, adjust quantities, and initiate checkout.',
      priority: 'HIGH',
      columnId: 'todo',
      position: 2,
      subtasks: { completed: 2, total: 5 },
      commentsCount: 1,
    },
    {
      id: 'task-4',
      title: 'Implement Shipping Address & Method Selection',
      description: 'Build the forms and logic for users to input or select shipping addresses, choose from available delivery options.',
      priority: 'HIGH',
      columnId: 'todo',
      position: 3,
      subtasks: { completed: 0, total: 2 },
    },
    {
      id: 'task-5',
      title: 'API Gateway Rate Limiting & Security Policies',
      description: 'Configure Redis token bucket algorithm for public endpoints to prevent DDOS attacks.',
      priority: 'HIGH',
      columnId: 'todo',
      position: 4,
      assignee: teamMembers[2], // Sarah Chen
      dueDate: 'Aug 12',
    },
    {
      id: 'task-6',
      title: 'Database Schema Migration Strategy for V2',
      description: 'Write zero-downtime migration scripts for Postgres DB with rollbacks.',
      priority: 'MEDIUM',
      columnId: 'todo',
      position: 5,
      assignee: teamMembers[3], // Marcus Vance
      dueDate: 'Aug 15',
    },
    {
      id: 'task-7',
      title: 'Setup Sentry Error Monitoring & Alerting',
      description: 'Integrate Sentry SDK across frontend and API handlers for real-time crash reports.',
      priority: 'LOW',
      columnId: 'todo',
      position: 6,
      assignee: teamMembers[4], // Elena Rostova
    },
    {
      id: 'task-8',
      title: 'Mobile Responsive Navigation Drawer Polish',
      description: 'Refactor drawer menu transitions for smooth 60fps animations on touch devices.',
      priority: 'MEDIUM',
      columnId: 'todo',
      position: 7,
    },
    {
      id: 'task-9',
      title: 'Accessibility (a11y) Audit across UI Components',
      description: 'Verify keyboard navigation and ARIA attributes for all modal components.',
      priority: 'LOW',
      columnId: 'todo',
      position: 8,
      assignee: teamMembers[2], // Sarah Chen
    },
    {
      id: 'task-10',
      title: 'Notification Center UI & Badge Indicators',
      description: 'Design slide-over panel for user activity notifications and real-time alerts.',
      priority: 'HIGH',
      columnId: 'todo',
      position: 9,
    },
    {
      id: 'task-11',
      title: 'Export Analytics to CSV and PDF Reports',
      description: 'Implement client-side data export features for executive summaries.',
      priority: 'LOW',
      columnId: 'todo',
      position: 10,
    },
    {
      id: 'task-12',
      title: 'Idempotent Webhook Processing Pipeline',
      description: 'Build queue consumer to handle incoming third-party event webhooks with retry logic.',
      priority: 'MEDIUM',
      columnId: 'todo',
      position: 11,
      assignee: teamMembers[3], // Marcus Vance
    },

    // IN PROGRESS Tasks (5 total)
    {
      id: 'task-13',
      title: 'Prioritize feature backlog',
      description: 'Review Q3 feature requests with product managers and prioritize core user flows.',
      priority: 'MEDIUM',
      columnId: 'in_progress',
      position: 0,
      assignee: currentUser, // Alex Rivera
      subtasks: { completed: 4, total: 6 },
    },
    {
      id: 'task-14',
      title: 'Set up authentication',
      description: 'Configure OAuth 2.0 and JWT token storage with secure HTTP-only cookie headers.',
      priority: 'HIGH',
      columnId: 'in_progress',
      position: 1,
      assignee: teamMembers[1], // Maya Chen
      dueDate: 'Jul 24',
    },
    {
      id: 'task-15',
      title: 'User interview synthesis',
      description: 'Synthesize insights from 15 customer discovery calls into key product improvement themes.',
      priority: 'HIGH',
      columnId: 'in_progress',
      position: 2,
      assignee: currentUser, // Alex Rivera
      dueDate: 'Jul 12',
    },
    {
      id: 'task-16',
      title: 'Quarterly planning deck',
      description: 'Draft slides covering Q4 strategic initiatives, engineering velocity, and resource allocation.',
      priority: 'URGENT',
      columnId: 'in_progress',
      position: 3,
      assignee: currentUser, // Alex Rivera
      dueDate: 'Jul 5',
    },
    {
      id: 'task-17',
      title: 'Roadmap review with leadership',
      description: 'Present prioritized features and engineering estimates to executive leadership.',
      priority: 'MEDIUM',
      columnId: 'in_progress',
      position: 4,
      assignee: currentUser, // Alex Rivera
    },

    // REVIEW Tasks (2 total)
    {
      id: 'task-18',
      title: 'Pricing experiment plan',
      description: 'Pricing experiment plan — details and acceptance criteria.',
      priority: 'LOW',
      columnId: 'review',
      position: 0,
      assignee: teamMembers[1], // Maya Chen
      dueDate: 'Jun 29',
    },
    {
      id: 'task-19',
      title: 'Define success metrics',
      description: 'Define success metrics — details and acceptance criteria.',
      priority: 'HIGH',
      columnId: 'review',
      position: 1,
      assignee: currentUser, // Alex Rivera
      dueDate: 'Tomorrow',
    },

    // DONE Tasks (3 total)
    {
      id: 'task-20',
      title: 'Competitor analysis',
      description: 'Benchmark feature set against top 3 market competitors.',
      priority: 'URGENT',
      columnId: 'done',
      position: 0,
      dueDate: 'Jul 7',
    },
    {
      id: 'task-21',
      title: 'Beta feedback triage',
      description: 'Categorize early tester feedback into bugs and feature requests.',
      priority: 'LOW',
      columnId: 'done',
      position: 1,
      assignee: currentUser, // Alex Rivera
    },
    {
      id: 'task-22',
      title: 'Stakeholder alignment',
      description: 'Stakeholder alignment — details and acceptance criteria.',
      priority: 'MEDIUM',
      columnId: 'done',
      position: 2,
      dueDate: 'Jun 28',
    },
  ],
};
