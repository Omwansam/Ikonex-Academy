import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import StudentLayout from '../layouts/StudentLayout';
import ProtectedRoute, { PublicRoute } from './ProtectedRoute';

import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

import DashboardPage from '../pages/admin/DashboardPage';
import StreamsListPage from '../pages/admin/streams/StreamsListPage';
import StreamFormPage, { StreamViewPage } from '../pages/admin/streams/StreamFormPage';
import StudentsListPage from '../pages/admin/students/StudentsListPage';
import StudentFormPage, { StudentDetailsPage } from '../pages/admin/students/StudentFormPage';
import SubjectsListPage from '../pages/admin/subjects/SubjectsListPage';
import SubjectFormPage, { SubjectViewPage } from '../pages/admin/subjects/SubjectFormPage';
import AssessmentsListPage from '../pages/admin/assessments/AssessmentsListPage';
import AssessmentFormPage, { EnterScoresPage } from '../pages/admin/assessments/AssessmentFormPage';
import { StudentResultsPage as AdminStudentResultsPage, ClassResultsPage, SubjectResultsPage, RankingsPage } from '../pages/admin/results/ResultsPages';
import { ReportCardsPage, GenerateReportsPage, ClassReportsPage } from '../pages/admin/reports/ReportsPages';
import TeachersListPage from '../pages/admin/teachers/TeachersListPage';
import TeacherFormPage from '../pages/admin/teachers/TeacherFormPage';
import AttendancePage from '../pages/admin/attendance/AttendancePage';
import SettingsPage from '../pages/admin/settings/SettingsPage';
import NotificationsPage from '../pages/shared/NotificationsPage';

import StudentDashboardPage from '../pages/student/DashboardPage';
import StudentProfilePage from '../pages/student/ProfilePage';
import StudentResultsPage from '../pages/student/ResultsPage';
import StudentSubjectsPage from '../pages/student/SubjectsPage';
import SubjectDetailPage from '../pages/student/SubjectDetailPage';
import StudentAssessmentsPage from '../pages/student/AssessmentsPage';
import StudentTimetablePage from '../pages/student/TimetablePage';
import StudentRankingsPage from '../pages/student/RankingsPage';
import StudentAttendancePage from '../pages/student/AttendancePage';
import StudentReportsPage from '../pages/student/ReportsPage';
import StudentFeesPage from '../pages/student/FeesPage';
import StudentCalendarPage from '../pages/student/CalendarPage';
import StudentSettingsPage from '../pages/student/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="streams" element={<StreamsListPage />} />
        <Route path="streams/create" element={<StreamFormPage mode="create" />} />
        <Route path="streams/:id" element={<StreamViewPage />} />
        <Route path="streams/:id/edit" element={<StreamFormPage mode="edit" />} />
        <Route path="students" element={<StudentsListPage />} />
        <Route path="students/register" element={<StudentFormPage mode="create" />} />
        <Route path="students/:id" element={<StudentDetailsPage />} />
        <Route path="students/:id/edit" element={<StudentFormPage mode="edit" />} />
        <Route path="subjects" element={<SubjectsListPage />} />
        <Route path="subjects/create" element={<SubjectFormPage mode="create" />} />
        <Route path="subjects/:id" element={<SubjectViewPage />} />
        <Route path="subjects/:id/edit" element={<SubjectFormPage mode="edit" />} />
        <Route path="assessments" element={<AssessmentsListPage />} />
        <Route path="assessments/create" element={<AssessmentFormPage mode="create" />} />
        <Route path="assessments/:id/edit" element={<AssessmentFormPage mode="edit" />} />
        <Route path="assessments/scores" element={<EnterScoresPage />} />
        <Route path="teachers" element={<TeachersListPage />} />
        <Route path="teachers/create" element={<TeacherFormPage mode="create" />} />
        <Route path="teachers/:id/edit" element={<TeacherFormPage mode="edit" />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="notifications" element={<NotificationsPage basePath="/admin" />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="results/students" element={<AdminStudentResultsPage />} />
        <Route path="results/class" element={<ClassResultsPage />} />
        <Route path="results/subjects" element={<SubjectResultsPage />} />
        <Route path="results/rankings" element={<RankingsPage />} />
        <Route path="reports/cards" element={<ReportCardsPage />} />
        <Route path="reports/generate" element={<GenerateReportsPage />} />
        <Route path="reports/class" element={<ClassReportsPage />} />
      </Route>

      <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboardPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="results" element={<StudentResultsPage />} />
        <Route path="subjects" element={<StudentSubjectsPage />} />
        <Route path="subjects/:id" element={<SubjectDetailPage />} />
        <Route path="assessments" element={<StudentAssessmentsPage />} />
        <Route path="timetable" element={<StudentTimetablePage />} />
        <Route path="attendance" element={<StudentAttendancePage />} />
        <Route path="rankings" element={<StudentRankingsPage />} />
        <Route path="reports" element={<StudentReportsPage />} />
        <Route path="fees" element={<StudentFeesPage />} />
        <Route path="calendar" element={<StudentCalendarPage />} />
        <Route path="notifications" element={<NotificationsPage basePath="/student" />} />
        <Route path="settings" element={<StudentSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
