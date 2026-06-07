const { prisma } = require('../config/db');
const { computeGradeFromTotals, isCatType, isExamType } = require('../utils/grading');

async function getStudentScores(studentId, term) {
    const where = { studentId };
    const scores = await prisma.score.findMany({
        where,
        include: {
            assessment: {
                include: { subject: true },
            },
        },
    });

    return scores.filter((s) => !term || s.assessment.term === term);
}

function aggregateResultsBySubject(scores) {
    const bySubject = {};

    for (const entry of scores) {
        const subjectId = entry.assessment.subjectId;
        const subjectName = entry.assessment.subject.name;
        const type = entry.assessment.type;
        const maxScore = entry.assessment.maxScore;

        if (!bySubject[subjectId]) {
            bySubject[subjectId] = {
                studentId: entry.studentId,
                subjectId,
                subjectName,
                cat: 0,
                exam: 0,
                catMax: 0,
                examMax: 0,
            };
        }

        if (isCatType(type)) {
            bySubject[subjectId].cat += entry.score;
            bySubject[subjectId].catMax += maxScore;
        } else if (isExamType(type)) {
            bySubject[subjectId].exam += entry.score;
            bySubject[subjectId].examMax += maxScore;
        } else {
            bySubject[subjectId].cat += entry.score;
            bySubject[subjectId].catMax += maxScore;
        }
    }

    return Object.values(bySubject).map((r) => {
        const total = r.cat + r.exam;
        const maxTotal = r.catMax + r.examMax;
        return {
            studentId: r.studentId,
            subjectId: r.subjectId,
            subjectName: r.subjectName,
            cat: r.cat,
            exam: r.exam,
            total,
            maxTotal,
            grade: computeGradeFromTotals(total, maxTotal),
        };
    });
}

async function getStudentResults(studentId, term) {
    const scores = await getStudentScores(studentId, term);
    return aggregateResultsBySubject(scores);
}

async function getSubjectResults(subjectId, term) {
    const assessments = await prisma.assessment.findMany({
        where: {
            subjectId,
            ...(term ? { term } : {}),
        },
        select: { id: true },
    });
    const assessmentIds = assessments.map((a) => a.id);

    const scores = await prisma.score.findMany({
        where: { assessmentId: { in: assessmentIds } },
        include: {
            assessment: { include: { subject: true } },
        },
    });

    const byStudent = {};
    for (const entry of scores) {
        if (!byStudent[entry.studentId]) {
            byStudent[entry.studentId] = [];
        }
        byStudent[entry.studentId].push(entry);
    }

    const results = [];
    for (const [studentId, studentScores] of Object.entries(byStudent)) {
        const aggregated = aggregateResultsBySubject(studentScores);
        results.push(...aggregated);
    }
    return results;
}

async function computeRankings({ streamId, term } = {}) {
    const studentWhere = { status: 'Active' };
    if (streamId) studentWhere.streamId = parseInt(streamId, 10);

    const students = await prisma.student.findMany({
        where: studentWhere,
        include: { stream: true },
    });

    const rankings = [];

    for (const student of students) {
        const results = await getStudentResults(student.id, term);
        const totalMarks = results.reduce((sum, r) => sum + r.total, 0);
        const maxTotal = results.reduce((sum, r) => sum + r.maxTotal, 0);
        const average = maxTotal ? parseFloat(((totalMarks / maxTotal) * 100).toFixed(1)) : 0;

        rankings.push({
            studentId: student.id,
            admissionNumber: student.admissionNumber,
            name: `${student.firstName} ${student.lastName}`,
            stream: student.stream.name,
            average,
            totalMarks,
        });
    }

    rankings.sort((a, b) => b.average - a.average || b.totalMarks - a.totalMarks);

    return rankings.map((r, i) => ({ position: i + 1, ...r }));
}

async function getStudentAssessmentDetails(studentId) {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { stream: true },
    });
    if (!student) return [];

    const subjectStreams = await prisma.subjectStream.findMany({
        where: { streamId: student.streamId },
        select: { subjectId: true },
    });
    const subjectIds = subjectStreams.map((s) => s.subjectId);

    const assessments = await prisma.assessment.findMany({
        where: { streamId: student.streamId, subjectId: { in: subjectIds } },
        include: { subject: true, scores: { where: { studentId } } },
        orderBy: { date: 'desc' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return assessments.map((a) => {
        const scoreRecord = a.scores[0];
        const assessmentDate = new Date(a.date);
        const isGraded = Boolean(scoreRecord);
        const isUpcoming = !isGraded && assessmentDate >= today;

        let status = 'Pending';
        if (isGraded) status = 'Graded';
        else if (isUpcoming) status = 'Upcoming';
        else status = 'Missed';

        return {
            studentId,
            assessmentId: a.id,
            title: a.title,
            type: a.type,
            subjectName: a.subject.name,
            score: scoreRecord?.score ?? null,
            maxScore: a.maxScore,
            date: a.date,
            status,
        };
    });
}

module.exports = {
    getStudentResults,
    getSubjectResults,
    computeRankings,
    getStudentAssessmentDetails,
    aggregateResultsBySubject,
};
