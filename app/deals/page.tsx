'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { saveAs } from 'file-saver';

type Deal = {
  id: number;
  name: string;
  stage: string;
  created_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [name, setName] = useState('');
  const [stage, setStage] = useState('Prospect');

  useEffect(() => {
    fetchDeals();
  }, []);

  async function fetchDeals() {
    const { data } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });
    setDeals(data || []);
  }

  async function addDeal() {
    if (!name) return;
    await supabase.from('deals').insert({ name, stage });
    setName('');
    fetchDeals();
  }

  function exportCSV() {
    const header = 'id,name,stage,created_at\n';
    const rows = deals
      .map((d) => `${d.id},${d.name},${d.stage},${d.created_at}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'deals.csv');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Deals</h1>

      <div className="mb-4 flex gap-2 flex-wrap">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Deal name"
          className="border p-2 rounded w-48"
        />
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Prospect</option>
          <option>Qualified</option>
          <option>Proposal</option>
          <option>Negotiation</option>
          <option>Closed</option>
        </select>
        <button
          onClick={addDeal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
      </div>

      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Stage</th>
            <th className="p-2 border">Created</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((d) => (
            <tr key={d.id} className="odd:bg-white even:bg-gray-50">
              <td className="p-2 border">{d.name}</td>
              <td className="p-2 border">{d.stage}</td>
              <td className="p-2 border">
                {new Date(d.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
