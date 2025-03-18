import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Personal() {
  const [personnelList, setPersonnelList] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [personnelDetails, setPersonnelDetails] = useState(null);
  const [assignedArticles, setAssignedArticles] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);

  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const { data, error } = await supabase.from('personnel').select('*');
        if (error) {
          console.error('Erreur lors de la récupération du personnel:', error);
        } else {
          // Sort the personnel list alphabetically by name
          const sortedPersonnel = [...data].sort((a, b) => a.nom.localeCompare(b.nom));
          setPersonnelList(sortedPersonnel || []);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchPersonnel();
  }, []);

  useEffect(() => {
    const fetchFilteredPersonnel = async () => {
      if (!searchCode) {
        // If searchCode is empty, filter by name only
        const filteredByName = personnelList.filter(personnel =>
          personnel.nom.toLowerCase().includes(searchName.toLowerCase())
        );
        setFilteredPersonnel(filteredByName);
        return;
      }

      try {
        // Fetch data from 'Masse' table based on the search code
        const { data: masseData, error: masseError } = await supabase
          .from('Masse')
          .select('personnel_id, personnel(nom, prenom, grade, photo, id)')
          .ilike('code', `%${searchCode}%`);

        if (masseError) {
          console.error('Error fetching from Masse table:', masseError);
          setFilteredPersonnel([]);
          return;
        }

        if (masseData && masseData.length > 0) {
          // Extract personnel details from the Masse data
          const filteredPersonnelList = masseData.map(item => ({
            id: item.personnel_id,
            nom: item.personnel?.nom || 'Unknown',
            prenom: item.personnel?.prenom || 'Unknown',
            grade: item.personnel?.grade || 'Unknown',
            photo: item.personnel?.photo || '',
          }));

          // Filter by name if searchName is not empty
          const finalFilteredPersonnel = filteredPersonnelList.filter(personnel =>
            personnel.nom.toLowerCase().includes(searchName.toLowerCase())
          );

          // Remove duplicates based on personnel id
          const uniqueFilteredPersonnel = Array.from(new Map(finalFilteredPersonnel.map(item => [item.id, item])).values());

          setFilteredPersonnel(uniqueFilteredPersonnel);
        } else {
          setFilteredPersonnel([]);
        }
      } catch (error) {
        console.error('Error fetching filtered personnel:', error);
        setFilteredPersonnel([]);
      }
    };

    fetchFilteredPersonnel();
  }, [searchName, searchCode, personnelList]);

  const handlePersonnelSelect = async (id) => {
    setSelectedPersonnel(id);
    setPersonnelDetails(null);
    setAssignedArticles([]);
    setActiveCategory(null);

    try {
      const { data: personnelData, error: personnelError } = await supabase
        .from('personnel')
        .select('*')
        .eq('id', id)
        .single();

      if (personnelError) {
        console.error('Erreur lors de la récupération des détails du personnel:', personnelError);
      } else {
        setPersonnelDetails(personnelData);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }

    try {
      const { data, error } = await supabase
        .from('Masse')
        .select('habillement(*), code') // Select habillement data and code
        .eq('personnel_id', id);

      if (error) {
        console.error('Erreur lors de la récupération des articles assignés:', error);
      } else {
        console.log("Assigned articles data:", data);
        setAssignedArticles(data || []);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }

    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setPersonnelDetails(null);
    setAssignedArticles([]);
    setSelectedPersonnel(null);
    setSearchName('');
    setSearchCode('');
    setActiveCategory(null);
  };

  // Function to filter articles by type
  const filterArticles = (articles, type) => {
    return articles.filter(article => article.habillement.article.toLowerCase().includes(type.toLowerCase()));
  };

  const pantalonTsiArticles = filterArticles(assignedArticles, 'pantalon tsi');
  const vesteTsiArticles = filterArticles(assignedArticles, 'veste tsi');
  const bottesLacetsArticles = filterArticles(assignedArticles, 'bottes à lacets');

  const tenueFeuKeywords = ['veste de protection', 'surpantalon', 'casque f1', 'casque f2', 'gant de protection'];
  const tenueFeuArticles = assignedArticles.filter(article =>
    tenueFeuKeywords.some(keyword => article.habillement.article.toLowerCase().includes(keyword))
  );

  // Function to filter out tenueFeu articles from the main list
  const otherArticles = assignedArticles.filter(article => !tenueFeuArticles.includes(article) &&
    !article.habillement.article.toLowerCase().includes('pantalon tsi') &&
    !article.habillement.article.toLowerCase().includes('veste tsi') &&
    !article.habillement.article.toLowerCase().includes('bottes à lacets')
  );

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Données du Personnel</h2>

      {/* Search Inputs */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          className="w-full p-2 border rounded-md"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rechercher par code..."
          className="w-full p-2 border rounded-md"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPersonnel.map((personnel) => (
          <div
            key={personnel.id}
            className="bg-white rounded-lg shadow-md p-4 relative cursor-pointer"
            onClick={() => handlePersonnelSelect(personnel.id)}
          >
            <div className="absolute top-2 right-2 w-12 h-12 rounded-full overflow-hidden">
              <img
                src={personnel.photo}
                alt={`${personnel.prenom} ${personnel.nom}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center">
              <strong className="mr-2 text-gray-700">Nom:</strong>
              <span className="text-gray-600">{personnel.nom}</span>
            </div>
            <div className="flex items-center">
              <strong className="mr-2 text-gray-700">Prenom:</strong>
              <span className="text-gray-600">{personnel.prenom}</span>
            </div>
            <div className="flex items-center">
              <strong className="mr-2 text-gray-700">Grade:</strong>
              <span className="text-gray-600">{personnel.grade}</span>
            </div>
          </div>
        ))}
      </div>

      {showDetailsModal && personnelDetails && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 w-96 relative overflow-y-auto max-h-screen">
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full overflow-hidden">
              <img
                src={personnelDetails.photo}
                alt={`${personnelDetails.prenom} ${personnelDetails.nom}`}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-lg font-semibold mb-2">Détails du Personnel</h3>
            <p>Nom: {personnelDetails.nom}</p>
            <p>Prenom: {personnelDetails.prenom}</p>
            <p>Grade: {personnelDetails.grade}</p>
            <p>Email: {personnelDetails.email}</p>
            <p>Caserne: {personnelDetails.caserne}</p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Articles Assignés</h3>

            {/* Pantalon TSI Dropdown */}
            <div>
              <button onClick={() => toggleCategory('pantalonTsi')} className="bg-gray-200 rounded-md p-2 mb-2 w-full text-left">
                Pantalon TSI ({pantalonTsiArticles.length})
              </button>
              {activeCategory === 'pantalonTsi' && (
                <ul>
                  {pantalonTsiArticles.map((article) => (
                    <li key={article.habillement.id} className="p-2 rounded-md hover:bg-gray-100">
                      {article.habillement.article} - {article.habillement.description} (<strong className="font-semibold">{article.code}</strong>)
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Veste TSI Dropdown */}
            <div>
              <button onClick={() => toggleCategory('vesteTsi')} className="bg-gray-200 rounded-md p-2 mb-2 w-full text-left">
                Veste TSI ({vesteTsiArticles.length})
              </button>
              {activeCategory === 'vesteTsi' && (
                <ul>
                  {vesteTsiArticles.map((article) => (
                    <li key={article.habillement.id} className="p-2 rounded-md hover:bg-gray-100">
                      {article.habillement.article} - {article.habillement.description} (<strong className="font-semibold">{article.code}</strong>)
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Bottes à lacets Dropdown */}
            <div>
              <button onClick={() => toggleCategory('bottesLacets')} className="bg-gray-200 rounded-md p-2 mb-2 w-full text-left">
                Bottes à lacets ({bottesLacetsArticles.length})
              </button>
              {activeCategory === 'bottesLacets' && (
                <ul>
                  {bottesLacetsArticles.map((article) => (
                    <li key={article.habillement.id} className="p-2 rounded-md hover:bg-gray-100">
                      {article.habillement.article} - {article.habillement.description} (<strong className="font-semibold">{article.code}</strong>)
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Tenue de Feu Dropdown */}
            <div>
              <button onClick={() => toggleCategory('tenueFeu')} className="bg-gray-200 rounded-md p-2 mb-2 w-full text-left">
                Tenue de Feu ({tenueFeuArticles.length})
              </button>
              {activeCategory === 'tenueFeu' && (
                <ul>
                  {tenueFeuArticles.map((article) => (
                    <li key={article.habillement.id} className="p-2 rounded-md hover:bg-gray-100">
                      {article.habillement.article} - {article.habillement.description} (<strong className="font-semibold">{article.code}</strong>)
                    </li>
                  ))}
                </ul>
              )}
            </div>

             {/* Other Articles Dropdown */}
             <div>
              <button onClick={() => toggleCategory('otherArticles')} className="bg-gray-200 rounded-md p-2 mb-2 w-full text-left">
                Autres Articles ({otherArticles.length})
              </button>
              {activeCategory === 'otherArticles' && (
                <ul>
                  {otherArticles.map((article) => (
                    <li key={article.habillement.id} className="p-2 rounded-md hover:bg-gray-100">
                      {article.habillement.article} - {article.habillement.description} (<strong className="font-semibold">{article.code}</strong>)
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="bg-gray-200 rounded-md p-2 mt-4" onClick={handleCloseModal}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Personal;
