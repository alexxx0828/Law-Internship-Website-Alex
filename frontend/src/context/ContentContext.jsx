import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getContentApi, updateContentApi } from '../services/api';

const ContentContext = createContext(null);

export const useContent = () => useContext(ContentContext);

// Default text for every editable segment (used before any edits are saved)
export const CONTENT_DEFAULTS = {
  // Hero
  hero_eyebrow: 'Second-Year Law Student · Malaysia · Practicum Journal',
  hero_headline_1: 'Theory applied to',
  hero_headline_2: 'legal practice.',
  hero_lede:
    "I'm Alex Siong Sie Yang, and this is my daily record of bridging classroom doctrine with courtroom discipline across two practicum terms.",
  hero_btn_primary: 'Read Daily Diary',
  hero_btn_outline: 'Internship Scope',

  // Overview
  overview_text:
    'My practicum journal documents the intersection of legal theory and applied practice. From civil litigation research to drafting memos, attending court hearings at the Court of Appeal, Putrajaya, and analyzing case law — every entry captures the discipline required to transition from student to practitioner. This record spans Practicum I (03/08/2026 – 28/08/2026) and the forthcoming Practicum II, offering a comprehensive view of my legal internship journey.',

  // Location
  location_heading: 'Internship Locations',
  loc1_label: 'Practicum I',
  loc1_name: 'Court of Appeal, Putrajaya',
  loc1_address: 'Istana Kehakiman, Presint 3, 62506 Putrajaya',
  loc1_dates: '03/08/2026 – 28/08/2026',
  loc2_label: 'Practicum II',
  loc2_name: 'To Be Determined',
  loc2_address: 'Location pending confirmation',
  loc2_dates: 'Upcoming',
  map_note_title: 'Court of Appeal, Putrajaya',
  map_note_text:
    "— Malaysia's premier appellate court, where I observed judicial proceedings and analyzed complex legal arguments.",

  // Diary
  diary_heading: 'Practicum Journals',

  // Scroll transition
  scroll_text: 'Rigorous legal analysis, grounded in discipline.',

  // Metrics
  metrics_heading: 'Cumulative Metrics',
  metric_days_label: 'Days Logged',
  metric_memos_label: 'Memos Drafted',
  metric_court_label: 'Court Attendances',
  metric_terms_label: 'Practicum Terms',

  // Contact
  contact_heading: "Let's Connect",
  footer_text: '© 2026 Alex Siong Sie Yang. All rights reserved.',
};

export const ContentProvider = ({ children }) => {
  const [overrides, setOverrides] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getContentApi();
        setOverrides(data || {});
      } catch (e) {
        console.error('Failed to load content', e);
      }
    };
    load();
  }, []);

  const content = { ...CONTENT_DEFAULTS, ...overrides };

  const updateContent = useCallback(async (key, value) => {
    // optimistic update
    setOverrides((prev) => ({ ...prev, [key]: value }));
    try {
      await updateContentApi(key, value);
    } catch (e) {
      console.error('Failed to save content', e);
    }
  }, []);

  return (
    <ContentContext.Provider value={{ content, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
};
