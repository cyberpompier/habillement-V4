import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Parametres() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [accessPassword, setAccessPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddPersonnel, setShowAddPersonnel] = useState(false);
  const [showAddHabillement, setShowAddHabillement] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showEditHabillementPopup, setShowEditHabillementPopup] = useState(false);
  const [showAffectHabillement, setShowAffectHabillement] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (accessPassword === '31071974') {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setAccessPassword('');
    } else {
      setError('Mot de passe incorrect');
      setAccessPassword('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError('Email ou mot de passe incorrect');
      } else {
        setShowLoginModal(false);
        resetForm();
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        setError(error.message);
      } else {
        setError('Vérifiez votre email pour confirmer votre inscription');
        setTimeout(() => {
          setIsLogin(true);
          resetForm();
        }, 3000);
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const closeModal = () => {
    setShowLoginModal(false);
    resetForm();
    setIsLogin(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Accès Paramètres</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Mot de passe:
              </label>
              <input
                type="password"
                value={accessPassword}
                onChange={(e) => setAccessPassword(e.target.value)}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="bg-ios-blue text-white rounded-md px-4 py-2"
              >
                Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Paramètres</h2>

      <div className="flex flex-col items-center space-y-4">
        <button
          className="bg-ios-blue text-white rounded-md p-2 w-64"
          onClick={() => setShowAddPersonnel(true)}
        >
          Ajouter Personnel
        </button>
        <button
          className="bg-ios-blue text-white rounded-md p-2 w-64"
          onClick={() => setShowAddHabillement(true)}
        >
          Ajouter Habillement
        </button>
        <button
          className="bg-green-500 text-white rounded-md p-2 w-64"
          onClick={() => setShowEditPopup(true)}
        >
          Edition Personnel
        </button>
        <button
          className="bg-green-500 text-white rounded-md p-2 w-64"
          onClick={() => setShowEditHabillementPopup(true)}
        >
          Edition Habillement
        </button>
        <button
          className="bg-ios-blue text-white rounded-md p-2 w-64"
          onClick={() => setShowAffectHabillement(true)}
        >
          Affecter Habillement
        </button>
        {user ? (
          <button
            className="bg-red-500 text-white rounded-md p-2 w-64"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        ) : (
          <button
            className="bg-ios-blue text-white rounded-md p-2 w-64"
            onClick={() => setShowLoginModal(true)}
          >
            Connexion
          </button>
        )}
      </div>

      {showLoginModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-96">
            <h3 className="text-lg font-semibold mb-4">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h3>
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="flex flex-col space-y-4">
              <div>
                <label className="block mb-1">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Mot de passe:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              {!isLogin && (
                <div>
                  <label className="block mb-1">Confirmer le mot de passe:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border rounded-md p-2"
                    required
                  />
                </div>
              )}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                type="submit"
                className="bg-ios-blue text-white rounded-md p-2"
              >
                {isLogin ? 'Se connecter' : 'S\'inscrire'}
              </button>
              <button
                type="button"
                className="text-ios-blue underline"
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
              >
                {isLogin ? 'Créer un compte' : 'Déjà inscrit ? Se connecter'}
              </button>
              <button
                type="button"
                className="bg-gray-200 rounded-md p-2"
                onClick={closeModal}
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Parametres;
