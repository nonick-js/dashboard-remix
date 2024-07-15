import { useNavigation } from '@remix-run/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import type { ActionResult } from '~/types';

export const useFormToast = (data?: ActionResult) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === 'idle' && data) {
      data.ok ? toast.success(data.message) : toast.error(data.message);
    }
  }, [navigation, data]);
};
