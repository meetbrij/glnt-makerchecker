import React, { useEffect, useState } from 'react';
import { supabase } from './utils/supabaseClient';
import './App.css';

const COUNTRIES = ['Australia', 'Japan', 'Singapore', 'Hongkong', 'Malaysia', 'Indonesia', 'Thailand', 'Philippines', 'Selected News' ];

const App = () => {
  const [SALES_APAC, setSALES_APAC] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterCountry, setFilterCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    let { data: SALES_APAC, error } = await supabase
      .from('SALES APAC')
      .select('*')
      .not('Title', 'is', null)
      .neq('Title', '') // filters out empty string titles  
      .order('SelectedForNewsletter', { ascending: false })
      .order('Date', { ascending: false });
      // .order('Date', { ascending: false })
      // .order('SelectedForNewsletter', { ascending: false });
      
    
    if (error) {
      console.error('Fetch error:', error.message);
      setError('Failed to load data. Please try again.');
    } else {
      setSALES_APAC(SALES_APAC);
      
      // console.dir(SALES_APAC);
      
      // ✅ Pre-select checkboxes based on SelectedForNewsletter
      const initiallySelected = SALES_APAC
        .filter((r) => r.SelectedForNewsletter)
        .map((r) => r.id);
      setSelectedIds(initiallySelected);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApprove = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const updates = SALES_APAC.map((record) => ({
        id: record.id,
        SelectedForNewsletter: selectedIds.includes(record.id),
      }));
  
      // Optional: batch using Promise.all (for multiple updates)
      const updatePromises = updates.map((update) =>
        supabase
          .from('SALES APAC')
          .update({ SelectedForNewsletter: update.SelectedForNewsletter })
          .eq('id', update.id)
      );
  
      await Promise.all(updatePromises);

      alert('Status for selected records updated!');
  
      // Refresh the data
      await fetchData();
    } catch (err) {
      console.error('Update failed:', err.message);
      setError('Failed to update selected status.');
    } finally {
      setLoading(false);
    }
  };

  const isTitleIncomplete = (title, date, summary) => {
    if (!title || !date || !summary) return true;
    const lowerTitle = title.toLowerCase();
    const lowerDate = date.toLowerCase();
    const lowerSummary = summary.toLowerCase();
    return lowerTitle.includes('no recent') || lowerTitle.includes('no specific') ||
        lowerDate.includes('no recent') || lowerDate.includes('no specific') ||
        lowerSummary.includes('no recent') || lowerSummary.includes('no specific');
  };

  const filteredRecords = filterCountry === 'Selected News'
  ? SALES_APAC.filter((r) => r.SelectedForNewsletter)
  : filterCountry
    ? SALES_APAC.filter((r) => r.Country === filterCountry.toLowerCase())
    : SALES_APAC;

  return (
    <div className="app">
      <div className="controls">
        <select className="dropDown" onChange={(e) => setFilterCountry(e.target.value)} value={filterCountry}>
          <option value="">All Countries</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <button className="updateBtn" onClick={handleApprove} disabled={updating || selectedIds.length === 0}>
          {updating ? 'Updating...' : 'Update Records'}
        </button>
        {loading && <p className='loadingTxt'>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {updateError && <p style={{ color: 'red' }}>{updateError}</p>}
      </div>

      <div className="grid">
        {filteredRecords.map(({ id, Title, Summary, Source, Date, Country, Company }) => (
          <div key={id} className={`card ${isTitleIncomplete(Title, Date, Summary) ? 'incomplete-title' : ''}`}>
            <span>{Date} <input
              type="checkbox"
              className="checkbox"
              checked={selectedIds.includes(id)}
              onChange={() => toggleSelect(id)}
            /></span>
            <h4>{Title}</h4>
            <p>{Summary}</p>
            <p><strong>Bank:</strong> {Company}</p>
            <p><strong>Country:</strong> {Country}</p>
            <p><a href={Source} target='_blank'>Source Link</a></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;