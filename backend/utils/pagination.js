function paginate(items, page = 1, pageSize = 10) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const size = Math.max(1, parseInt(pageSize, 10) || 10);
    const start = (p - 1) * size;

    return {
        data: items.slice(start, start + size),
        total: items.length,
        page: p,
        pageSize: size,
        totalPages: Math.ceil(items.length / size) || 1,
    };
}

function parsePaginationQuery(query) {
    return {
        page: parseInt(query.page, 10) || 1,
        pageSize: parseInt(query.pageSize, 10) || 10,
    };
}

module.exports = { paginate, parsePaginationQuery };
