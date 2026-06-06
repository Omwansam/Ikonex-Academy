export function calculateGrade(marks, maxMarks = 100) {
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'E';
}

export function getGradeRemark(grade) {
  const remarks = {
    A: 'Excellent',
    B: 'Very Good',
    C: 'Good',
    D: 'Fair',
    E: 'Needs Improvement',
  };
  return remarks[grade] || '—';
}

export function getPositionSuffix(position) {
  if (position === 1) return '1st';
  if (position === 2) return '2nd';
  if (position === 3) return '3rd';
  return `${position}th`;
}
