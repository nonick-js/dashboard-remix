import { Icon } from '@iconify/react';
import { Button, type ButtonProps } from '@nextui-org/react';
import { useTheme } from 'next-themes';

export function ThemeToggle(props: ButtonProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant='light'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      disableRipple
      isIconOnly
      {...props}
    >
      <Icon
        icon='solar:sun-bold'
        className='text-[20px] text-default-500 absolute scale-100 dark:scale-0'
      />
      <Icon
        icon='solar:moon-bold'
        className='text-[20px] text-default-500 absolute scale-0 dark:scale-100'
      />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
