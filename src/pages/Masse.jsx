import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Masse() {
  const navigate = useNavigate();
  const [personnelList, setPersonnelList] = useState([]);
  const [masseArticles, setMasseArticles] = useState([]);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticlePopup, setShowArticlePopup] = useState(false);
  const [articleTaille, setArticleTaille] = useState('');
  const [articleCode, setArticleCode] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/parametres');
        return;
      }
      fetchPersonnel();
    };

    checkAuth();
  }, [navigate]);

  const fetchPersonnel = async () => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .select('id, nom, prenom')
        .order('nom', { ascending: true });

      if (error) {
        console.error('Error fetching personnel:', error);
      } else {
        setPersonnelList(data || []);
      }
    } catch (error) {
      console.error('Error fetching personnel:', error);
    }
  };

  const handlePersonnelSelect = async (personnelId) => {
    setSelectedPersonnelId(personnelId);
    setMasseArticles([]);

    try {
      const { data, error } = await supabase
        .from('Masse')
        .select('id, habillement(id, article, description, code, taille, image), code, taille')
        .eq('personnel_id', personnelId);

      if (error) {
        console.error('Error fetching Masse articles:', error);
      } else {
        setMasseArticles(data || []);
      }
    } catch (error) {
      console.error('Error fetching Masse articles:', error);
    }
  };

  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
    setArticleTaille(article.taille);
    setArticleCode(article.code);
    setShowArticlePopup(true);
  };

  const handleClosePopup = () => {
    setShowArticlePopup(false);
    setSelectedArticle(null);
  };

  const handleModifierArticle = async () => {
    try {
      if (!articleTaille || !articleCode) {
        alert('Veuillez remplir tous les champs');
        return;
      }

      const { error: masseError } = await supabase
        .from('Masse')
        .update({ code: articleCode, taille: articleTaille })
        .eq('id', selectedArticle.id);

      if (masseError) {
        console.error('Erreur lors de la mise à jour de Masse:', masseError);
        alert(`Erreur lors de la mise à jour de Masse: ${masseError.message}`);
        return;
      }

      await handlePersonnelSelect(selectedPersonnelId);
      handleClosePopup();
      alert('Modifications enregistrées avec succès!');

    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert(`Une erreur est survenue lors de la modification: ${error.message}`);
    }
  };

  const handleDeleteArticle = async () => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('Masse')
        .delete()
        .eq('id', selectedArticle.id);

      if (error) {
        console.error('Error deleting Masse entry:', error);
      } else {
        handlePersonnelSelect(selectedPersonnelId);
        handleClosePopup();
      }
    } catch (error) {
      console.error('Error deleting Masse entry:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Masse</h2>

      <div className="flex mb-4">
        <select
          className="w-full p-2 border rounded-md"
          onChange={(e) => handlePersonnelSelect(e.target.value)}
          value={selectedPersonnelId}
        >
          <option value="">Sélectionner un personnel</option>
          {personnelList.map((personnel) => (
            <option key={personnel.id} value={personnel.id}>
              {personnel.nom} {personnel.prenom}
            </option>
          ))}
        </select>
      </div>

      {selectedPersonnelId && masseArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {masseArticles.map(article => (
            <div key={article.habillement.id} className="bg-white rounded-lg shadow-md p-4 relative cursor-pointer" onClick={() => handleArticleSelect(article)}>
              {article.habillement.image && (
                <div className="absolute top-2 right-2 w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={article.habillement.image}
                    alt={article.habillement.article}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center mb-2">
                <strong className="text-gray-700 text-sm font-bold mr-2">Article:</strong>
                <span className="text-gray-600">{article.habillement.article}</span>
              </div>
              <div className="flex items-center">
                <strong className="text-gray-700 text-sm font-bold mr-2">Description:</strong>
                <span className="text-gray-600">{article.habillement.description}</span>
              </div>
              <div className="flex items-center">
                <strong className="text-gray-700 text-sm font-bold mr-2">Code:</strong>
                <span className="text-gray-600">{article.code}</span>
              </div>
              <div className="flex items-center">
                <strong className="text-gray-700 text-sm font-bold mr-2">Taille:</strong>
                <span className="text-gray-600">{article.taille}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showArticlePopup && selectedArticle && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 w-96 relative">
            <h2 className="text-xl font-semibold mb-4">{selectedArticle.habillement.article}</h2>

            {selectedArticle.habillement.image && (
              <div className="absolute top-4 right-4 w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={selectedArticle.habillement.image}
                  alt={selectedArticle.habillement.article}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Taille:</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={articleTaille}
                onChange={(e) => setArticleTaille(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Code:</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={articleCode}
                onChange={(e) => setArticleCode(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                className="bg-ios-blue text-white rounded-md p-2"
                onClick={handleModifierArticle}
              >
                Modifier
              </button>
              <button
                className="bg-red-500 text-white rounded-md p-2"
                onClick={handleDeleteArticle}
              >
                Supprimer
              </button>
              <button className="bg-gray-200 rounded-md p-2" onClick={handleClosePopup}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Masse;
