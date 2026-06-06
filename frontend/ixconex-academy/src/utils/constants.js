export const APP_NAME = 'Ikonex Academy';

export const COLORS = {
  primary: '#2563EB',
  secondary: '#1E293B',
  accent: '#14B8A6',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#F8FAFC',
  card: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
};

export const GRADE_COLORS = {
  A: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  B: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  C: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  D: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  E: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
};

export const ASSESSMENT_TYPES = ['CAT', 'Assignment', 'Midterm', 'End Term Exam'];

export const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin', icon: 'dashboard' },
  { label: 'Class Streams', path: '/admin/streams', icon: 'streams' },
  { label: 'Students', path: '/admin/students', icon: 'students' },
  { label: 'Teachers', path: '/admin/teachers', icon: 'teachers' },
  { label: 'Subjects', path: '/admin/subjects', icon: 'subjects' },
  { label: 'Assessments', path: '/admin/assessments', icon: 'assessments' },
  { label: 'Attendance', path: '/admin/attendance', icon: 'attendance' },
  { label: 'Results', path: '/admin/results/students', icon: 'results' },
  { label: 'Reports', path: '/admin/reports/cards', icon: 'reports' },
  { label: 'Notifications', path: '/admin/notifications', icon: 'notifications' },
  { label: 'Settings', path: '/admin/settings', icon: 'settings' },
];

export const STUDENT_NAV = [
  { label: 'Dashboard', path: '/student', icon: 'dashboard' },
  { label: 'Results', path: '/student/results', icon: 'results' },
  { label: 'Subjects', path: '/student/subjects', icon: 'subjects' },
  { label: 'Assessments', path: '/student/assessments', icon: 'assessments' },
  { label: 'Timetable', path: '/student/timetable', icon: 'timetable' },
  { label: 'Attendance', path: '/student/attendance', icon: 'attendance' },
  { label: 'Rankings', path: '/student/rankings', icon: 'rankings' },
  { label: 'Reports', path: '/student/reports', icon: 'reports' },
  { label: 'Fees', path: '/student/fees', icon: 'fees' },
  { label: 'Calendar', path: '/student/calendar', icon: 'calendar' },
  { label: 'Notifications', path: '/student/notifications', icon: 'notifications' },
  { label: 'Profile', path: '/student/profile', icon: 'profile' },
  { label: 'Settings', path: '/student/settings', icon: 'settings' },
];

export const STATUS_OPTIONS = ['Active', 'Inactive', 'Graduated', 'Suspended'];

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const CLASS_LEVELS = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
