import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Editable from './Editable';
import './Contact.css';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: i * 0.1 },
    }),
  };

  return (
    <section id="contact" className="contact-section section-border">
      <div className="section-container" ref={ref}>
        <motion.div
          className="section-number"
          custom={0}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          05
        </motion.div>

        <motion.h2
          className="contact-headline"
          custom={1}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          <Editable k="contact_heading" />
        </motion.h2>

        <motion.ul
          className="contact-links"
          custom={2}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          <li>
            <motion.a
              href="mailto:alexsiong2001@gmail.com"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-testid="contact-email"
            >
              Email
            </motion.a>
          </li>
          <li>
            <motion.a
              href="https://www.linkedin.com/in/alex-siong-b90167223/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-testid="contact-linkedin"
            >
              LinkedIn
            </motion.a>
          </li>
        </motion.ul>

        <motion.div
          className="footer"
          custom={3}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          <Editable k="footer_text" />
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;