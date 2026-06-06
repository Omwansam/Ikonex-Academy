import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import Card, { CardHeader } from '../ui/Card';

const COLORS = ['#2563EB', '#14B8A6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];
const GRADE_COLORS = { A: '#22C55E', B: '#2563EB', C: '#F59E0B', D: '#F97316', E: '#EF4444' };

export function PerformanceTrendChart({ data, title = 'Performance Trends' }) {
  return (
    <Card variant="elevated">
      <CardHeader title={title} subtitle="Average performance over terms" />
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="term" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="average" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB' }} name="Average %" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function SubjectPerformanceChart({ data, title = 'Subject Performance' }) {
  return (
    <Card variant="elevated">
      <CardHeader title={title} subtitle="Average scores by subject" />
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
          <YAxis dataKey="subject" type="category" tick={{ fontSize: 11 }} width={80} />
          <Tooltip />
          <Bar dataKey="average" fill="#14B8A6" radius={[0, 4, 4, 0]} name="Average %" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function StreamDistributionChart({ data, title = 'Student Distribution by Stream' }) {
  return (
    <Card variant="elevated">
      <CardHeader title={title} />
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="students" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, students }) => `${name}: ${students}`}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function GradeDistributionChart({ data, title = 'Grade Distribution' }) {
  return (
    <Card variant="elevated">
      <CardHeader title={title} />
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Students">
            {data.map((entry) => (
              <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] || '#64748B'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function StudentPerformanceChart({ data, title = 'My Performance Trend' }) {
  return (
    <Card variant="elevated">
      <CardHeader title={title} />
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="term" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} name="Score %" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function SubjectScoresChart({ data, title = 'Subject Scores' }) {
  return (
    <Card variant="elevated">
      <CardHeader title={title} />
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="score" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Score %" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
