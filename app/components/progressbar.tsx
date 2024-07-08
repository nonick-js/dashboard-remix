import { useFetchers, useNavigation } from '@remix-run/react';
import NProgress from 'nprogress';
import { useEffect, useMemo } from 'react';

export function ProgressBar({ ...props }: Partial<NProgress.NProgressOptions>) {
  const navigation = useNavigation();
  const fetchers = useFetchers();

  /**
   * This gets the state of every fetcher active on the app and combine it with
   * the state of the global transition (Link and Form), then use them to
   * determine if the app is idle or if it's loading.
   * Here we consider both loading and submitting as loading.
   */
  const state = useMemo<'idle' | 'loading'>(
    function getGlobalState() {
      const states = [navigation.state, ...fetchers.map((fetcher) => fetcher.state)];
      if (states.every((state) => state === 'idle')) return 'idle';
      return 'loading';
    },
    [navigation.state, fetchers],
  );

  useEffect(() => {
    NProgress.configure(props);
  });

  useEffect(() => {
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    if (state === 'loading') NProgress.start();
    // when the state is idle then we can to complete the progress bar
    if (state === 'idle') NProgress.done();
  }, [state]);

  return null;
}
