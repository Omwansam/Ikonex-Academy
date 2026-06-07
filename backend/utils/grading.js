const CAT_TYPES = ['CAT', 'Assignment'];
const EXAM_TYPES = ['Midterm', 'End Term Exam'];

function computeGrade(percentage) {
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'E';
}

function computeGradeFromTotals(total, maxTotal) {
    if (!maxTotal) return 'E';
    return computeGrade((total / maxTotal) * 100);
}

function isCatType(type) {
    return CAT_TYPES.includes(type);
}

function isExamType(type) {
    return EXAM_TYPES.includes(type);
}

module.exports = {
    CAT_TYPES,
    EXAM_TYPES,
    computeGrade,
    computeGradeFromTotals,
    isCatType,
    isExamType,
};
