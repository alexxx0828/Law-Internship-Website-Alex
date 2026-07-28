import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './LocationMap.css';

const LocationMap = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Court of Appeal, Putrajaya coordinates (Istana Kehakiman / Palace of Justice, Presint 3)
  const practicum1Location = {
    lat: 2.9175,
    lng: 101.6855,
  };

  // Static map image URL (using OpenStreetMap embed centered on the Palace of Justice)
  const staticMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=101.6775%2C2.9115%2C101.6935%2C2.9235&layer=mapnik&marker=${practicum1Location.lat}%2C${practicum1Location.lng}`;

  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: i * 0.1 },
    }),
  };

  return (
    <section id="location" className="location-section section-border">
      <div className="section-container" ref={ref}>
        <motion.div
          className="section-number"
          custom={0}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          02
        </motion.div>

        <motion.h2
          className="section-heading"
          custom={1}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          Internship Locations
        </motion.h2>

        <div className="location-grid">
          <motion.div
            className="location-card"
            custom={2}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={textVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <div className="location-label">Practicum I</div>
            <h3 className="location-name">Court of Appeal, Putrajaya</h3>
            <p className="location-address">Istana Kehakiman, Presint 3, 62506 Putrajaya</p>
            <p className="location-dates">03/08/2026 – 28/08/2026</p>
            <div className="location-tags">
              <span className="location-tag">Appellate Court</span>
              <span className="location-tag">Civil & Criminal</span>
            </div>
          </motion.div>

          <motion.div
            className="location-card location-card-pending"
            custom={3}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={textVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <div className="location-label">Practicum II</div>
            <h3 className="location-name">To Be Determined</h3>
            <p className="location-address">Location pending confirmation</p>
            <p className="location-dates">Upcoming</p>
            <div className="location-tags">
              <span className="location-tag">TBD</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="map-container"
          custom={4}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          <iframe
            title="Court of Appeal, Putrajaya Location"
            className="map-iframe"
            src={staticMapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={`https://www.openstreetmap.org/?mlat=${practicum1Location.lat}&mlon=${practicum1Location.lng}#map=16/${practicum1Location.lat}/${practicum1Location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-fullscreen-link"
          >
            View Larger Map ↗
          </a>
          <div className="map-note">
            <strong>Court of Appeal, Putrajaya</strong> — Malaysia's premier appellate court, where I observed
            judicial proceedings and analyzed complex legal arguments.
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LocationMap;