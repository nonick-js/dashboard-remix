import { useNavigation } from '@remix-run/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

type FormActionRes = {
  ok: boolean;
  message: string;
  data?: unknown;
};

export const useFormToast = (data?: FormActionRes) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === 'idle' && data) {
      data.ok ? toast.success(data.message) : toast.error(data.message);
    }
  }, [navigation, data]);
};
