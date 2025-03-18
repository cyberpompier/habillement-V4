import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateStaffList() {
  try {
    const { data: personnelList, error } = await supabase
      .from('personnel')
      .select('nom, prenom, grade, email, caserne, photo, id');

    if (error) {
      console.error('Error fetching personnel:', error);
      return;
    }

    // Sort the staff list alphabetically by 'nom'
    personnelList.sort((a, b) => a.nom.localeCompare(b.nom));

    // Convert the sorted list to JSON format
    const jsonOutput = JSON.stringify(personnelList, null, 2);

    // Write the JSON output to staff.txt
    fs.writeFileSync('staff.txt', jsonOutput);

    console.log('Staff list generated successfully in staff.txt');
  } catch (error) {
    console.error('Error generating staff list:', error);
  }
}

generateStaffList();
