import Link from 'next/link';
import { buttonVariants } from '../ui/button';

interface NavigationItemProps {
  name: string;
  href: string;
}

export const NavigationItem = ({ name, href }: NavigationItemProps) => {
  const isExternal = href.startsWith('http') || href.startsWith('mailto');
  return isExternal ? (
    <a
      key={name}
      href={href}
      className={buttonVariants({ variant: 'ghost', className: 'text-white' })}
      target="_blank"
      rel="noopener noreferrer"
    >
      {name}
    </a>
  ) : (
    <Link
      key={name}
      href={href}
      className={buttonVariants({ variant: 'ghost', className: 'text-white' })}
    >
      {name}
    </Link>
  );
};
