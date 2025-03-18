import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Habillement() {
  const [habillementItems, setHabillementItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabillement = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('habillement')
          .select('*'); // Fetch all items without filtering

        if (error) {
          setError(error);
          console.error("Supabase fetch error:", error); // Log the error
        } else {
          setHabillementItems(data || []);
        }
      } catch (err) {
        setError(err);
        console.error("Error during fetch:", err); // Log the error
      } finally {
        setLoading(false);
      }
    };

    fetchHabillement();
  }, []);

  if (loading) {
    return <div className="p-4">Loading Habillement...</div>;
  }

  if (error) {
    return <div className="p-4">Error: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Habillement</h2>
      {habillementItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habillementItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 relative"
            >
              {item.image && (
                <div className="absolute top-2 right-2 w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.article}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center mb-2">
                <strong className="text-gray-700 text-sm font-bold mr-2">
                  Article:
                </strong>
                <span className="text-gray-600 text-sm">{item.article}</span>
              </div>
              <div className="flex items-center">
                <strong className="text-gray-700 text-sm font-bold mr-2">
                  Description:
                </strong>
                <span className="text-gray-600 text-sm">{item.description}</span>
              </div>
              <div className="flex items-center">
                <strong className="text-gray-700 text-sm font-bold mr-2">
                  Code:
                </strong>
                <span className="text-gray-600 text-sm">{item.code}</span>
              </div>
              <div className="flex items-center">
                <strong className="text-gray-700 text-sm font-bold mr-2">
                  Taille:
                </strong>
                <span className="text-gray-600 text-sm">{item.taille}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
}

export default Habillement;
