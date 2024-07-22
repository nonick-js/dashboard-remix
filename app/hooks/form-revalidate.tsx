import { useNavigation } from '@remix-run/react';
import type { FlattenMaps } from 'mongoose';
import { useEffect } from 'react';
import type { UseRemixFormReturn } from 'remix-hook-form';
import type { ActionResult } from '~/types';

/** Action成功時にフォームを特定の値にリセット */
export const useFormReset = (
  /** リセット関数 */
  reset: UseRemixFormReturn['reset'],
  /** リセット後に標準値にする値 */
  value: FlattenMaps<unknown> | undefined,
  /** useActionDataで取得したActionResult */
  actionResult: ActionResult | undefined,
) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === 'idle' && actionResult?.ok) {
      reset(value ?? undefined);
    }
  }, [navigation, reset, actionResult, value]);
};
