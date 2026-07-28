import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './DiarySection.css';

const diaryEntries = [
  // Week 1
  { week: 1, date: 'MON, 03 AUG 2026', title: 'Orientation & Case File Review', description: 'First day at the firm. Received orientation on case management systems, ethical guidelines, and confidentiality protocols. Reviewed three active civil litigation files to understand current caseload.', tags: ['Orientation', 'Civil Litigation'] },
  { week: 1, date: 'TUE, 04 AUG 2026', title: 'Legal Research: Breach of Contract', description: 'Conducted comprehensive research on remedies for breach of contract under Malaysian Contract Act. Compiled case law and statutory provisions for senior associate\'s review.', tags: ['Research', 'Contract Law'] },
  { week: 1, date: 'WED, 05 AUG 2026', title: 'Drafting Legal Memo', description: 'Drafted internal memo analyzing precedent for upcoming contract dispute. Focused on statutory interpretation and application of relevant case law to client\'s factual matrix.', tags: ['Drafting', 'Memo'] },
  { week: 1, date: 'THU, 06 AUG 2026', title: 'Court Observation: Civil Proceedings', description: 'Attended High Court proceedings for civil matter involving property dispute. Observed oral submissions, judicial questioning, and courtroom decorum. Documented key procedural steps.', tags: ['Court Attendance', 'Civil Litigation'] },
  { week: 1, date: 'FRI, 07 AUG 2026', title: 'Client Meeting Preparation', description: 'Assisted in preparing client briefing materials for upcoming consultation. Summarized case status, legal options, and potential outcomes in accessible language for lay client.', tags: ['Client Meeting', 'Drafting'] },
  
  // Week 2
  { week: 2, date: 'MON, 10 AUG 2026', title: 'Evidence Analysis for Trial', description: 'Reviewed documentary evidence for upcoming trial. Organized exhibits, cross-referenced witness statements, and flagged inconsistencies for counsel\'s attention.', tags: ['Research', 'Trial Preparation'] },
  { week: 2, date: 'TUE, 11 AUG 2026', title: 'Drafting Statement of Claim', description: 'Prepared first draft of Statement of Claim for new commercial litigation matter. Focused on clear articulation of facts, legal grounds, and relief sought per Rules of Court.', tags: ['Drafting', 'Pleadings'] },
  { week: 2, date: 'WED, 12 AUG 2026', title: 'Legal Opinion Research', description: 'Researched tort liability issues for partner\'s legal opinion. Analyzed negligence elements, duty of care, and causation principles under Malaysian common law and recent Federal Court decisions.', tags: ['Research', 'Tort Law'] },
  { week: 2, date: 'THU, 13 AUG 2026', title: 'Case Management Conference', description: 'Attended Case Management Conference at Sessions Court. Observed judicial directions on timelines, discovery obligations, and pre-trial procedures. Took detailed minutes for file.', tags: ['Court Attendance', 'Procedure'] },
  { week: 2, date: 'FRI, 14 AUG 2026', title: 'Contract Review & Annotation', description: 'Reviewed commercial lease agreement for potential risk areas. Annotated clauses concerning termination rights, indemnities, and dispute resolution. Flagged ambiguities for senior review.', tags: ['Contract Review', 'Commercial Law'] },

  // Week 3 & 4 (继续添加...)
  { week: 3, date: 'MON, 17 AUG 2026', title: 'Discovery Document Review', description: 'Reviewed opposing party\'s discovery documents. Identified relevant exhibits, privileged communications, and documents requiring further clarification. Prepared summary for counsel.', tags: ['Discovery', 'Litigation'] },
  { week: 3, date: 'TUE, 18 AUG 2026', title: 'Witness Statement Drafting', description: 'Assisted in drafting witness statement for factual witness. Ensured chronological clarity, relevance to pleadings, and compliance with evidentiary requirements under Evidence Act.', tags: ['Drafting', 'Evidence'] },
  { week: 4, date: 'MON, 24 AUG 2026', title: 'Trial Preparation & Bundles', description: 'Assisted in preparing trial bundles for upcoming hearing. Organized pleadings, affidavits, exhibits, and submissions per Court of Appeal Practice Direction. Verified pagination and cross-references.', tags: ['Trial Preparation', 'Procedure'] },
  { week: 4, date: 'FRI, 28 AUG 2026', title: 'Practicum I Reflection & Debrief', description: 'Final day of Practicum I. Met with supervising partner for feedback session. Reflected on skills gained in research, drafting, court observation, and client interaction. Received guidance for Practicum II preparation.', tags: ['Reflection', 'Feedback'] },
];

const DiarySection = () => {
  const [activeTab, setActiveTab] = useState('practicum1');
  const [activeWeek, setActiveWeek] = useState('all');
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filteredEntries = activeWeek === 'all' 
    ? diaryEntries 
    : diaryEntries.filter(entry => entry.week === parseInt(activeWeek));

  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: i * 0.05 },
    }),
  };

  return (
    <section id="diary" className="diary-section section-border">
      <div className="section-container" ref={ref}>
        <motion.div
          className="section-number"
          custom={0}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          03
        </motion.div>

        <motion.h2
          className="section-heading"
          custom={1}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          Practicum Journals
        </motion.h2>

        <motion.div
          className="diary-controls"
          custom={2}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          <div className="practicum-tabs">
            <motion.button
              className={`tab-btn ${activeTab === 'practicum1' ? 'active' : ''}`}
              onClick={() => setActiveTab('practicum1')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Practicum I (03/08/2026 – 28/08/2026)
            </motion.button>
            <motion.button
              className={`tab-btn ${activeTab === 'practicum2' ? 'active' : ''}`}
              onClick={() => setActiveTab('practicum2')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Practicum II (Upcoming)
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'practicum1' ? (
            <motion.div
              key="practicum1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="week-filters">
                {['all', '1', '2', '3', '4'].map((week) => (
                  <motion.button
                    key={week}
                    className={`week-chip ${activeWeek === week ? 'active' : ''}`}
                    onClick={() => setActiveWeek(week)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {week === 'all' ? 'All Weeks' : `Week ${week}`}
                  </motion.button>
                ))}
              </div>

              <motion.div className="diary-entries" layout>
                <AnimatePresence mode="popLayout">
                  {filteredEntries.map((entry, index) => (
                    <motion.div
                      key={entry.date}
                      className="diary-card"
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    >
                      <div className="diary-date">{entry.date}</div>
                      <h3 className="diary-title">{entry.title}</h3>
                      <p className="diary-description">{entry.description}</p>
                      <div className="diary-tags">
                        {entry.tags.map((tag) => (
                          <span key={tag} className="diary-tag">{tag}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="practicum2"
              className="upcoming-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              Practicum II begins soon. Entries will be documented here as the term progresses.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DiarySection;
