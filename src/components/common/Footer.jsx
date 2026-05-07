import React from 'react';

import '../../assets/scss/footer.scss';

const Footer = () => {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();

  const yearDisplay =
    currentYear > startYear
      ? `${startYear} - ${currentYear}`
      : `${currentYear}`;

  return (
    <footer className="ftr">
      <p className="copy">© {yearDisplay} @ SGIVS Global</p>
    </footer>
  );
};

export default Footer;
