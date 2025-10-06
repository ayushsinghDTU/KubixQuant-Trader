import React, { useState, useMemo } from 'react';
import { FileText, Download, Search, ChevronDown } from 'lucide-react';

// --- MOCK DATA ---
// In a real application, you would fetch this data from a server.
const mockDocuments = [
  { id: 1, title: 'Q3 2025 Performance Review', category: 'Performance Report', date: '2025-10-05', size: '2.5 MB' },
  { id: 2, title: 'BTC Breakout Strategy Backtest', category: 'Backtest Result', date: '2025-09-28', size: '5.1 MB' },
  { id: 3, title: 'Annual Tax Statement 2024', category: 'Tax Document', date: '2025-09-15', size: '1.2 MB' },
  { id: 4, title: 'Risk Analysis - ETH Portfolio', category: 'Risk Report', date: '2025-09-10', size: '3.8 MB' },
  { id: 5, title: 'Q2 2025 Performance Review', category: 'Performance Report', date: '2025-07-05', size: '2.4 MB' },
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredAndSortedDocuments = useMemo(() => {
    let documents = [...mockDocuments];

    // Filter by search term
    if (searchTerm) {
      documents = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort the documents
    documents.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return documents;
  }, [searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Documents</h2>
      
      <div className="bg-white rounded-lg shadow-md">
        {/* Toolbar for Search and Sort */}
        <div className="p-4 flex flex-col md:flex-row items-center justify-between border-b gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative w-full md:w-auto">
             <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
             >
                <option value="date-desc">Sort by Date (Newest)</option>
                <option value="date-asc">Sort by Date (Oldest)</option>
                <option value="title-asc">Sort by Title (A-Z)</option>
                <option value="title-desc">Sort by Title (Z-A)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Size</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedDocuments.map(doc => (
                <tr key={doc.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-gray-800">{doc.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{doc.category}</td>
                  <td className="p-4 text-gray-600">{new Date(doc.date).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-600">{doc.size}</td>
                  <td className="p-4 text-right">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      <Download size={14} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAndSortedDocuments.length === 0 && (
            <p className="p-6 text-center text-gray-500">No documents found.</p>
          )}
        </div>
      </div>
    </div>
  );
}