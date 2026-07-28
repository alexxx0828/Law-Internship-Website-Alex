import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import Hero from '../components/legal-journal/Hero';
import Overview from '../components/legal-journal/Overview';
import DiarySection from '../components/legal-journal/DiarySection';
import LocationMap from '../components/legal-journal/LocationMap';
import ScrollTransition from '../components/legal-journal/ScrollTransition';
import Metrics from '../components/legal-journal/Metrics';
import Contact from '../components/legal-journal/Contact';
import './LegalJournal.css';

const LegalJournal = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="legal-journal">
      <Hero />
      <Overview />
      <LocationMap />
      <DiarySection />
      <ScrollTransition />
      <Metrics />
      <Contact />
    </div>
  );
};

export default LegalJournal;
