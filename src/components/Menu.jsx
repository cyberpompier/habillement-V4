import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaTshirt, FaCog, FaList } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Menu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleMasseClick = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vous devez être connecté pour accéder à cette page');
      navigate('/parametres');
    } else {
      navigate('/masse');
    }
  };

  return (
    <nav className="flex justify-around">
      <NavLink to="/" className="flex flex-col items-center">
        <FaUser size={24} className="text-ios-blue" />
        <span className="text-sm">Personnel</span>
      </NavLink>
      <NavLink to="/habillement" className="flex flex-col items-center">
        <FaTshirt size={24} className="text-ios-blue" />
        <span className="text-sm">Habillement</span>
      </NavLink>
      <div 
        className={`flex flex-col items-center cursor-pointer ${!user ? 'opacity-50' : ''}`}
        onClick={handleMasseClick}
      >
        <FaList size={24} className="text-ios-blue" />
        <span className="text-sm">Masse</span>
      </div>
      <NavLink to="/parametres" className="flex flex-col items-center">
        <FaCog size={24} className="text-ios-blue" />
        <span className="text-sm">Paramètres</span>
      </NavLink>
    </nav>
  );
}

export default Menu;
