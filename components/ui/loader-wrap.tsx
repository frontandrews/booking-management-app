'use client';

import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './loader-wrap.module.css';

const LoaderWrap = () => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useGSAP(
    () => {
      const svg = svgRef.current;
      const tl = gsap.timeline();
      const curve = 'M0 502S175 272 500 272s500 230 500 230V0H0Z';
      const flat = 'M0 2S175 1 500 1s500 1 500 1V0H0Z';

      // Animation to transform the SVG path into a curve
      tl.to(svg, {
        duration: 0.8,
        attr: { d: curve },
        ease: 'power2.easeIn',
      })
        // Animation to transform the SVG path into a straight line
        .to(svg, {
          duration: 1,
          attr: { d: flat },
          ease: 'power2.easeOut',
        });

      // Animation to move the loader container up, off the screen
      tl.to(containerRef.current, {
        y: '-150%',
        duration: 0.5,
      });
      // Set zIndex to -1 and hide the loader container
      tl.to(containerRef.current, {
        zIndex: -1,
        display: 'none',
        duration: 0, // Ensure it happens immediately after the previous animation
      });
    },
    { scope: containerRef },
  );

  // Remove the loader from the DOM after the animation
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current as HTMLDivElement;

    const handleAnimationComplete = () => {
      container.style.display = 'none';
    };

    container.addEventListener('animationend', handleAnimationComplete);

    return () => {
      container.removeEventListener('animationend', handleAnimationComplete);
    };
  }, []);

  return (
    <div className={styles.loaderWrap} ref={containerRef}>
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <path
          id="svg"
          ref={svgRef}
          d="M0,1005S175,995,500,995s500,5,500,5V0H0Z"
          fill="white"
        ></path>
      </svg>
    </div>
  );
};

export default LoaderWrap;
