'use client';

import { useState } from 'react';
import { processDraftExpenses } from './action';

export default function DraftPage() {
  const [draftExpenses, setDraftExpenses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleDraftSubmit = async () => {
    if (draftExpenses.length === 0) {
      setMessage('No draft expenses to submit');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await processDraftExpenses(draftExpenses);
      setMessage(result.message);
      if (result.success) {
        setDraftExpenses([]); // Clear drafts after successful submission
      }
    } catch (error) {
      setMessage('Error submitting drafts: ' + error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Draft Expenses</h1>
      
      {draftExpenses.length > 0 ? (
        <div className="space-y-4">
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Items</th>
              </tr>
            </thead>
            <tbody>
              {draftExpenses.map((expense, index) => (
                <tr key={index}>
                  <td className="border p-2">{expense.transaction_date}</td>
                  <td className="border p-2">{expense.total_amount}</td>
                  <td className="border p-2">{expense.category}</td>
                  <td className="border p-2">{expense.line_items?.length || 0} items</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleDraftSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Draft Expenses'}
          </button>
        </div>
      ) : (
        <p>No draft expenses available</p>
      )}

      {message && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          {message}
        </div>
      )}
    </div>
  );
}
