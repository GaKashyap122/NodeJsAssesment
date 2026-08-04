import { useState, useEffect } from 'react';
import { userApi } from '../api/user';
import type { User } from '../types';

export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    userApi
      .getProfile()
      .then((data) => {
        if (controller.signal.aborted) return;
        console.log('Profile data:', data);
        setUser(data);
      })
      .catch((err: Error) => {
        if (controller.signal.aborted) return;
        console.error('Profile fetch error:', err.message);
        setServerError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort(); // cancels the stale request on cleanup
  }, []);

  return { user, loading, serverError };
}
