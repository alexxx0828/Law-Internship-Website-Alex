import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getStatsApi } from '../../services/api';
import Editable from './Editable';
import './Metrics.css';

const Metrics = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [stats, setStats] = useState({
    days_logged: 0,
    memos_drafted: 0,
    court_attendances: 0,
    practicum_terms: 2,
  });

  const fetchStats = useCallback(async () => {
    try {
      const data = await getStatsApi();
      setStats(data);
    } catch (e) {
      console.error('Failed to fetch stats', e);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    window.addEventListener('entriesChanged', fetchStats);
    return () => window.removeEventListener('entriesChanged', fetchStats);
  }, [fetchStats]);

  const metrics = [
    { value: stats.days_logged, labelKey: 'metric_days_label', suffix: '' },
    { value: stats.memos_drafted, labelKey: 'metric_memos_label', suffix: '' },
    { value: stats.court_attendances, labelKey: 'metric_court_label', suffix: '' },
    { value: stats.practicum_terms, labelKey: 'metric_terms_label', suffix: '' },
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
        <motion.div className="section-number" custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={textVariants}>
          04
        </motion.div>

        <motion.h2 className="section-heading" custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={textVariants}>
          <Editable k="metrics_heading" />
        </motion.h2>

        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.labelKey} metric={metric} index={index} inView={inView} />
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
      const end = metric.value;
      if (end === 0) {
        setCount(0);
        return;
      }
      let start = 0;
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
      <Editable k={metric.labelKey} as="div" className="metric-label" />
    </motion.div>
  );
};

export default Metrics;
