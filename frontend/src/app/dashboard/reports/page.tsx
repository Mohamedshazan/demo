'use client';

import { useState } from 'react';
import axios from '@/app/lib/api';

export default function AssetReportsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    asset_type: '',
    status: '',
    from_date: '',
    to_date: '',
  });

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/report/assets', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
      setAssets(response.data);
    } catch (err) {
      console.error('Fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/report/assets/export/${format}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assets_report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      asset_type: '',
      status: '',
      from_date: '',
      to_date: '',
    });
    setAssets([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Asset Report</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
          <input
            type="text"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm"
            placeholder="e.g. IT"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Asset Type</label>
          <select
            value={filters.asset_type}
            onChange={(e) => setFilters({ ...filters, asset_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
          >
            <option value="">All</option>
            <option value="Laptop">Laptop</option>
            <option value="PC">PC</option>
            <option value="Tablet">Tablet</option>
            <option value="Monitor">Monitor</option>
            <option value="Printer">Printer</option>
            <option value="Smartphone">Smartphone</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
          >
            <option value="">All</option>
            <option value="live">Live</option>
            <option value="backup">Backup</option>
            <option value="to_be_disposal">To Be Disposal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={filters.from_date}
            onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={filters.to_date}
            onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={fetchAssets}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
        <button
          onClick={() => handleExport('csv')}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
        <button
          onClick={() => handleExport('pdf')}
          className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
        >
          Export PDF
        </button>
        <button
          onClick={clearFilters}
          className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-700"
        >
          Clear Filters
        </button>
      </div>

      {/* Table or Message */}
      {loading ? (
        <p className="text-gray-600">Loading assets...</p>
      ) : assets.length === 0 ? (
        <p className="text-center text-gray-500 py-10">🔍 No assets found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-left text-gray-800">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Device</th>
                <th className="p-3">Type</th>
                <th className="p-3">Department</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={asset.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{asset.device_name}</td>
                  <td className="p-3">{asset.asset_type}</td>
                  <td className="p-3">{asset.department?.name || '—'}</td>
                  <td className="p-3">{asset.location}</td>
                  <td className="p-3 capitalize">{asset.status}</td>
                  <td className="p-3">
                    {asset.created_at
                      ? new Date(asset.created_at).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
