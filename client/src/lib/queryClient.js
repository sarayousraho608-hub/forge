import { QueryClient } from '@tanstack/react-query';

// تخزين مؤقت في المتصفح: لا يعيد الجلب خلال دقيقة، ولا يعيد المحاولة كثيراً
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 1, refetchOnWindowFocus: false },
  },
});
