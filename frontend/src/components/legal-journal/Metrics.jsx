import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Metrics.css';

const Metrics = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const metrics = [
    { value: 20, label: 'Days Logged', suffix: '+' },
    { value: 15, label: 'Memos Drafted', suffix: '+' },
    { value: 8, label: 'Court Attendances', suffix: '+' },
    { value: 2, label: 'Practicum Terms', suffix: '' },
  ];

  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: i * 0.1 },
    }),
  };

  return (
    <section id="metrics" className="metrics-section section-border">
      <div className="section-container" ref={ref}>
        <motion.div
          className="section-number"
          custom={0}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          04
        </motion.div>

        <motion.h2
          className="section-heading"
          custom={1}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          Cumulative Metrics
        </motion.h2>

        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const MetricCard = ({ metric, index, inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = metric.value;
      const duration = 1500;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [inView, metric.value]);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.2 + index * 0.1 },
    },
  };

  return (
    <motion.div
      className="metric-card"
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className="metric-number">
        {count}
        <span className="metric-suffix">{metric.suffix}</span>
      </div>
      <div className="metric-label">{metric.label}</div>
    </motion.div>
  );
};

export default Metrics;