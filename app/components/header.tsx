import { cn } from '@nextui-org/theme';
import React from 'react';

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn('flex flex-col gap-1', className)} {...props} />;
  },
);
Header.displayName = 'Header';

const HeaderTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return <h1 className={cn('text-3xl font-black', className)} {...props} />;
});
HeaderTitle.displayName = 'HeaderTitle';

const HeaderDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return <h5 className={cn('max-sm:text-sm text-default-500', className)} {...props} />;
});
HeaderDescription.displayName = 'HeaderDescription';

export { Header, HeaderTitle, HeaderDescription };
