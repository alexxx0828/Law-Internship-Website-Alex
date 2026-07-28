import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
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
          My practicum journal documents the <em>intersection of legal theory and applied practice</em>.
          From <em>civil litigation research</em> to drafting memos, attending court hearings at the{' '}
          <em>Court of Appeal, Putrajaya</em>, and analyzing case law — every entry captures the
          discipline required to transition from student to practitioner. This record spans{' '}
          <em>Practicum I (03/08/2026 – 28/08/2026)</em> and the forthcoming Practicum II,
          offering a comprehensive view of my legal internship journey.
        </motion.p>
      </div>
    </section>
  );
};

export default Overview;