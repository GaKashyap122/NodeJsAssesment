import { useState, useEffect } from 'react';
import { userApi } from '../api/user';
import type { UserListItem, UserListResponse } from '../types';

const PAGE_SIZE = 10;

export function useUserList() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [meta, setMeta] = useState<UserListResponse['meta'] | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    // Abort controller cancels the in-flight request if page changes
    // before the previous response arrives — prevents stale data races
    const controller = new AbortController();

    setLoading(true);
    setServerError('');

    userApi
      .getUserList(page, PAGE_SIZE)
      .then((res) => {
        if (controller.signal.aborted) return;
        console.log('User list data:', res);
        setUsers(res.data);
        setMeta(res.meta);
      })
      .catch((err: Error) => {
        if (controller.signal.aborted) return;
        console.error('User list fetch error:', err.message);
        setServerError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort(); // cleanup on page change or unmount
  }, [page]); // ← only re-fetches when page changes

  const totalPages = meta?.totalPages ?? 1;

  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));
  const goPrev = () => setPage((p) => Math.max(p - 1, 1));

  return {
    users,
    meta,
    page,
    totalPages,
    loading,
    serverError,
    goNext,
    goPrev,
  };
}
