import { useState, useEffect } from "react";
import { translations } from "../i18n/translations";

export const useGlobalState = () => {
  const [lang, setLang] = useState('ar');
  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  const t = translations[lang];

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, message: '', type: 'info' }), 5000);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return { lang, setLang, t, menuOpen, setMenuOpen, notification, showNotification, scrollToSection };
};
