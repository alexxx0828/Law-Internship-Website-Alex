import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Editable from './Editable';
import { useAuth } from '../../context/AuthContext';
import './Hero.css';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const lineVariants = {
    hidden: { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      clipPath: 'inset(0 0 0% 0)',
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.33, 1, 0.68, 1],
      },
    }),
  };

  const eyebrowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.1, duration: 0.6, ease: [0.33, 1, 0.68, 1] },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8 + i * 0.1,
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1],
      },
    }),
  };

  const scrollHintVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 1.2, duration: 0.6 },
    },
    float: {
      y: [0, -8, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <motion.div
          className="hero-eyebrow"
          variants={eyebrowVariants}
          initial="hidden"
          animate="visible"
        >
          <Editable k="hero_eyebrow" />
        </motion.div>

        <h1 className="hero-headline">
          <motion.div
            className="headline-line"
            custom={0}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          >
            <Editable k="hero_headline_1" />
          </motion.div>
          <motion.div
            className="headline-line headline-italic"
            custom={1}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          >
            <Editable k="hero_headline_2" />
          </motion.div>
        </h1>

        <motion.p
          className="hero-lede"
          variants={lineVariants}
          custom={2}
          initial="hidden"
          animate="visible"
        >
          <Editable k="hero_lede" />
        </motion.p>

        <div className="hero-buttons">
          <motion.a
            href="#diary"
            className="btn btn-primary"
            custom={0}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { if (isAdmin) e.preventDefault(); }}
          >
            <Editable k="hero_btn_primary" />
          </motion.a>
          <motion.a
            href="#overview"
            className="btn btn-outline"
            custom={1}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { if (isAdmin) e.preventDefault(); }}
          >
            <Editable k="hero_btn_outline" />
          </motion.a>
        </div>
      </div>

      <motion.div
        className="scroll-hint"
        variants={scrollHintVariants}
        initial="hidden"
        animate={['visible', 'float']}
      >
        <span>Scroll</span>
        <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
          <path d="M1 13L6 18L11 13" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </motion.div>

      <div className="hero-background">
        <motion.div
          className="gradient-orb gradient-orb-1"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="gradient-orb gradient-orb-2"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>
    </section>
  );
};

export default Hero;