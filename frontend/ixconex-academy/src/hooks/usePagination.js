import { useState, useMemo } from 'react';

export function usePagination(totalItems, initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const pagination = useMemo(
    () => ({
      page,
      pageSize,
      totalPages,
      totalItems,
      setPage,
      setPageSize,
      nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
      prevPage: () => setPage((p) => Math.max(p - 1, 1)),
      goToPage: (p) => setPage(Math.max(1, Math.min(p, totalPages))),
      reset: () => setPage(1),
    }),
    [page, pageSize, totalPages, totalItems],
  );

  return pagination;
}
