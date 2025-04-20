// components/MakerCheckerComponent.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const COUNTRIES = ['Australia', 'Japan', 'Singapore', 'Hongkong', 'Malaysia', 'Indonesia', 'Thailand', 'Philippines', 'Selected News'];

const MakerCheckerComponent = () => {
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
      .neq('Title', '')
      .order('Date', { ascending: false })
      .order('SelectedForNewsletter', { ascending: false });

    if (error) {
      console.error('Fetch error:', error.message);
      setError('Failed to load data. Please try again.');
    } else {
      setSALES_APAC(SALES_APAC);
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
    setUpdating(true);
    setUpdateError(null);

    try {
      const updates = SALES_APAC.map((record) => ({
        id: record.id,
        SelectedForNewsletter: selectedIds.includes(record.id),
      }));

      const updatePromises = updates.map((update) =>
        supabase
          .from('SALES APAC')
          .update({ SelectedForNewsletter: update.SelectedForNewsletter })
          .eq('id', update.id)
      );

      await Promise.all(updatePromises);
      alert('Status for selected records updated!');
      await fetchData();
    } catch (err) {
      console.error('Update failed:', err.message);
      setUpdateError('Failed to update selected status.');
    } finally {
      setUpdating(false);
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
    <div className="p-4">
      <div className="sticky top-0 bg-white z-10 flex flex-wrap items-center gap-4 mb-6 p-4 shadow rounded">
        <select
          className="border p-2 rounded w-full sm:w-auto"
          onChange={(e) => setFilterCountry(e.target.value)}
          value={filterCountry}
        >
          <option value="">All Countries</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleApprove}
          disabled={updating || selectedIds.length === 0}
        >
          {updating ? 'Updating...' : 'Update Records'}
        </button>
        {loading && <p className="text-blue-500">Loading data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {updateError && <p className="text-red-500">{updateError}</p>}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecords.map(({ id, Title, Summary, Source, Date, Country, Company }) => (
          <div
            key={id}
            className={`border p-4 rounded shadow hover:shadow-md transition ${
              isTitleIncomplete(Title, Date, Summary) ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{Date}</span>
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selectedIds.includes(id)}
                onChange={() => toggleSelect(id)}
              />
            </div>
            <h4 className="text-lg font-semibold mb-1">{Title}</h4>
            <p className="text-gray-700 mb-2">{Summary}</p>
            <p className="text-sm"><strong>Bank:</strong> {Company}</p>
            <p className="text-sm"><strong>Country:</strong> {Country}</p>
            <a href={Source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Source Link</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MakerCheckerComponent;
