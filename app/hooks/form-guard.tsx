import { unstable_usePrompt, useBeforeUnload } from '@remix-run/react';

export const useFormGuard = (isDirty: boolean) => {
  unstable_usePrompt({
    message: '保存していない変更があります。ページを移動しますか？',
    when: () => isDirty,
  });

  useBeforeUnload((event) => {
    if (isDirty) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
};
