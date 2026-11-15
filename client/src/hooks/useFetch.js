import { useQuery } from '@tanstack/react-query';

// Custom hook فوق TanStack Query: يجلب JSON ويخزّنه مؤقتاً. يعيد { data, loading, error }
// إن كان الرابط null لا يجلب شيئاً.
export default function useFetch(url) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['fetch', url],
    enabled: Boolean(url),
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('bad response');
      return res.json();
    },
  });
  return { data: data ?? null, loading: isLoading, error: isError };
}
