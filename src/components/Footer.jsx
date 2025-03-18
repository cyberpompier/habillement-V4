import React from 'react';

function Footer({ children }) {
  return (
    <footer className="bg-white p-4 shadow-md fixed bottom-0 left-0 w-full">
      {children}
    </footer>
  );
}

export default Footer;
