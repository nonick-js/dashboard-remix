import { useNavigation } from '@remix-run/react';
import { useEffect } from 'react';
import type { FieldValues } from 'react-hook-form';
import type { UseRemixFormReturn } from 'remix-hook-form';

/** Action成功時にフォームを特定の値にリセット */
export const useFormRevalidate = (
  reset: UseRemixFormReturn['reset'],
  trigger: boolean,
  values?: FieldValues,
) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === 'idle' && trigger) {
      reset(values);
    }
  }, [navigation, trigger, values, reset]);
};
