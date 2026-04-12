import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuthCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const requireAuth = (cb?: () => void) => {
    if (status === 'loading') return false;
    if (!session) {
      router.push('/auth/login');
      return false;
    }
    if (cb) cb();
    return true;
  };

  return { session, requireAuth };
}

