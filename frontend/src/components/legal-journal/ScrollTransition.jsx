import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Editable from './Editable';
import './ScrollTransition.css';

const ScrollTransition = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="scroll-transition-section">
      <div className="scroll-transition-sticky">
        <motion.div className="scroll-transition-content" style={{ scale, opacity }}>
          <motion.div className="legal-seal" style={{ rotate }}>
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" />
              <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M100 40 L100 160 M60 100 L140 100"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="100" cy="100" r="15" fill="currentColor" />
            </svg>
          </motion.div>
          <motion.p className="scroll-transition-text" style={{ opacity }}>
            <Editable k="scroll_text" />
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollTransition;