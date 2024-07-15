import { useNavigation } from '@remix-run/react';
import { useEffect } from 'react';
import type { UseRemixFormReturn } from 'remix-hook-form';
import type { ActionResult } from '~/types';

/** Action成功時にフォームを特定の値にリセット */
export const useFormReset = (reset: UseRemixFormReturn['reset'], actionData?: ActionResult) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === 'idle' && actionData?.ok) {
      reset(actionData.data);
    }
  }, [navigation, reset, actionData]);
};
