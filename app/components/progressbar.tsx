import { useFetchers, useNavigation } from '@remix-run/react';
import NProgress from 'nprogress';
import { useEffect } from 'react';

export function ProgressBar({ ...props }: Partial<NProgress.NProgressOptions>) {
  const navigation = useNavigation();
  const fetchers = useFetchers();

  useEffect(() => {
    NProgress.configure({ ...props });
  });

  useEffect(() => {
    const fetchersIdle = fetchers.every((f) => f.state === 'idle');
    if (navigation.state === 'idle' && fetchersIdle) {
      NProgress.done();
    } else {
      NProgress.start();
    }
  }, [navigation.state, fetchers]);

  return null;
}
