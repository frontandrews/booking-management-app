/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';

jest.mock('next/image', () => {
  const Image = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  );
  Image.displayName = 'Image';
  return Image;
});
jest.mock('@/components/homepage/main-hero', () => {
  const MainHero = () => <div data-testid="main-hero">MainHero Component</div>;
  MainHero.displayName = 'MainHero';
  return MainHero;
});

jest.mock('@/components/ui/loader-wrap', () => {
  const LoaderWrap = () => (
    <div data-testid="loader-wrap">LoaderWrap Component</div>
  );
  LoaderWrap.displayName = 'LoaderWrap';
  return LoaderWrap;
});

describe('Home Component', () => {
  test('renders Home component correctly', () => {
    render(<Home />);

    expect(screen.getByTestId('main-hero')).toBeInTheDocument();
    expect(screen.getByTestId('loader-wrap')).toBeInTheDocument();

    const titles = screen.getAllByRole('heading', { level: 2 });
    expect(titles.length).toBeGreaterThan(0);

    const descriptions = screen.getAllByText(
      (content, element) => element?.tagName.toLowerCase() === 'p',
    );
    expect(descriptions.length).toBeGreaterThan(0);
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });
});
