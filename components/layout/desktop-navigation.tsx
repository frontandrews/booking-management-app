import { NavigationItem } from './navigation-item';

const navigation = [
  { name: 'Linkedin', href: 'https://www.linkedin.com/in/andrewsgomes/' },
  { name: 'Github', href: 'https://github.com/frontandrews' },
];

export const DesktopNavigation = () => {
  return (
    <div className="hidden lg:flex lg:gap-x-12">
      {navigation.map((item) => (
        <NavigationItem key={item.name} name={item.name} href={item.href} />
      ))}
    </div>
  );
};
