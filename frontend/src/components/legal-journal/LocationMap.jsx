import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './LocationMap.css';

const LocationMap = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Court of Appeal, Putrajaya coordinates
  const practicum1Location = {
    lat: 2.9287,
    lng: 101.6914,
  };

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0',
  };

  const mapOptions = {
    styles: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ color: '#f4f0e6' }],
      },
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#1c1a17' }],
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#f4f0e6' }, { lightness: 16 }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#cfc7b3' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#bd5b1f' }, { lightness: 60 }],
      },
    ],
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  };

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
          <LoadScript googleMapsApiKey="">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={practicum1Location}
              zoom={15}
              options={mapOptions}
            >
              <Marker position={practicum1Location} />
            </GoogleMap>
          </LoadScript>
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