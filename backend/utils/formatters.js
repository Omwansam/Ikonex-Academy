function formatStudent(student) {
    if (!student) return null;
    return {
        id: student.id,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        gender: student.gender,
        nationality: student.nationality,
        dateOfBirth: student.dateOfBirth,
        streamId: student.streamId,
        streamName: student.stream?.name || null,
        admissionDate: student.admissionDate,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        parentEmail: student.parentEmail,
        status: student.status,
        profileImage: student.profileImage,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
    };
}

function formatStream(stream, studentCount) {
    if (!stream) return null;
    return {
        id: stream.id,
        name: stream.name,
        classLevel: stream.classLevel,
        capacity: stream.capacity,
        classTeacherId: stream.classTeacherId,
        classTeacher: stream.classTeacher?.name || null,
        studentCount: studentCount ?? stream._count?.students ?? 0,
        createdAt: stream.createdAt,
        updatedAt: stream.updatedAt,
    };
}

function formatSubject(subject) {
    if (!subject) return null;
    return {
        id: subject.id,
        code: subject.code,
        name: subject.name,
        description: subject.description,
        teacherId: subject.teacherId,
        teacher: subject.teacher?.name || null,
        streamIds: subject.streams?.map((s) => s.streamId) || [],
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt,
    };
}

function formatAssessment(assessment) {
    if (!assessment) return null;
    return {
        id: assessment.id,
        title: assessment.title,
        type: assessment.type,
        subjectId: assessment.subjectId,
        subjectName: assessment.subject?.name || null,
        streamId: assessment.streamId,
        streamName: assessment.stream?.name || null,
        maxScore: assessment.maxScore,
        date: assessment.date,
        term: assessment.term,
        createdAt: assessment.createdAt,
        updatedAt: assessment.updatedAt,
    };
}

function formatRelativeTime(date) {
    const now = Date.now();
    const then = new Date(date).getTime();
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

function formatActivityLog(log) {
    return {
        id: log.id,
        action: log.action,
        detail: log.detail,
        type: log.type,
        createdAt: log.createdAt,
        time: formatRelativeTime(log.createdAt),
    };
}

function formatEvent(event) {
    const isPast = new Date(event.date) < new Date();
    return { ...event, isPast };
}

module.exports = {
    formatStudent,
    formatStream,
    formatSubject,
    formatAssessment,
    formatRelativeTime,
    formatActivityLog,
    formatEvent,
};
