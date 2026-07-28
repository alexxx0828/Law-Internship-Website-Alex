import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Editable from './Editable';
import './Overview.css';

const Overview = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] },
    },
  };

  return (
    <section id="overview" className="overview section-border">
      <div className="section-container" ref={ref}>
        <motion.div
          className="section-number"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          01
        </motion.div>

        <motion.p
          className="overview-text"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.1 },
            },
          }}
        >
          <Editable k="overview_text" />
        </motion.p>
      </div>
    </section>
  );
};

export default Overview;