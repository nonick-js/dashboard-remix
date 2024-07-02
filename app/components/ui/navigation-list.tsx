import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import { Chip, Divider, cn } from '@nextui-org/react';
import { Link, useLocation } from '@remix-run/react';
import { type HTMLAttributes, type MouseEventHandler, createContext, useContext } from 'react';

type NavigationContextProps = {
  onNavigate?: () => void;
  currentPath: string;
};

const NavigationContext = createContext<NavigationContextProps>({
  onNavigate: () => {},
  currentPath: '',
});

type NavigationListProps = Omit<NavigationContextProps, 'currentPath'> &
  HTMLAttributes<HTMLDivElement>;

export function NavigationList({ className, onNavigate, ...props }: NavigationListProps) {
  const location = useLocation();

  return (
    <NavigationContext.Provider value={{ onNavigate, currentPath: location.pathname }}>
      <div className={cn('flex flex-col', className)} {...props} />
    </NavigationContext.Provider>
  );
}

type NavigationSectionProps = {
  label?: string;
  showDivider?: boolean;
  classNames?: { base?: string; label?: string; container?: string };
} & HTMLAttributes<HTMLDivElement>;

export function NavigationSection({
  className,
  classNames,
  label,
  children,
  showDivider,
  ...props
}: NavigationSectionProps) {
  return (
    <div className={cn('flex flex-col', className, classNames?.base)} {...props}>
      {label && <p className={cn('pb-3 text-default-500', classNames?.label)}>{label}</p>}
      <ul className={cn('flex flex-col gap-1', classNames?.container)}>{children}</ul>
      {showDivider && <Divider className='my-3' />}
    </div>
  );
}

type NavigationItemProps = {
  to: string;
  label: string;
  chipLabel?: string;
  icon: string;
};

export function NavigationItem({ to, label, chipLabel, icon }: NavigationItemProps) {
  const { onNavigate, currentPath } = useContext(NavigationContext);
  const isSamePaths = currentPath === to || `${currentPath}/` === to;

  const wrapperClassName = cn(
    'flex w-full items-center justify-between rounded-md',
    'px-3 py-[9px] text-sm transition ease-in-out hover:bg-zinc-400/20',
    { 'bg-zinc-400/30 cursor-pointer': isSamePaths },
  );

  function Item() {
    return (
      <>
        <div className='flex items-center gap-3'>
          <Icon icon={icon} className='text-[20px]' />
          <p>{label}</p>
        </div>
        {chipLabel && (
          <Chip size='sm' classNames={{ base: 'h-auto py-0.5' }}>
            {chipLabel}
          </Chip>
        )}
      </>
    );
  }

  return (
    <li>
      {isSamePaths ? (
        <div className={wrapperClassName}>
          <Item />
        </div>
      ) : (
        <Link to={to} onClick={onNavigate} className={wrapperClassName}>
          <Item />
        </Link>
      )}
    </li>
  );
}
