'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { scanAndFillForm } from './actions';

// A helper component to show a loading state on the scan button
function ScanButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
    >
      {pending ? 'Scanning...' : 'Scan & Fill Form'}
    </button>
  );
}

export default function ExpensePage() {
  // State for the manual form fields
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [total, setTotal] = useState('');
  const [category, setCategory] = useState('General');
  const [lineItems, setLineItems] = useState([
    { itemName: '', quantity: 1, price: '' },
  ]);

  // useFormState hook to manage the Server Action for OCR
  const initialState = { status: null, message: null, data: null };
  const [state, formAction] = useFormState(scanAndFillForm, initialState);

  // This effect runs when the server action returns data, populating the form
  useEffect(() => {
    if (state.status === 'success' && state.data) {
      const { total_amount, transaction_date, category, line_items } = state.data;
      setTotal(total_amount || '');
      setDate(transaction_date || new Date().toISOString().split('T')[0]);
      setCategory(category || 'General');
      setLineItems(line_items || [{ itemName: '', quantity: 1, price: '' }]);
    }
  }, [state]);

  // --- Handlers for manual manipulation of line items ---
  const handleItemChange = (index, event) => {
    const values = [...lineItems];
    values[index][event.target.name] = event.target.value;
    setLineItems(values);
  };

  const handleAddItem = () => {
    setLineItems([...lineItems, { itemName: '', quantity: 1, price: '' }]);
  };

  const handleRemoveItem = (index) => {
    const values = [...lineItems];
    values.splice(index, 1);
    setLineItems(values);
  };
  
  const handleManualSubmit = (event) => {
    event.preventDefault();
    const expenseData = { date, total, category, lineItems };
    console.log('--- Manual Submission ---', expenseData);
    alert('Expense saved! Check the browser console for the data.');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Add New Expense</h1>
        <p className="text-center text-gray-500 mb-6">Fill the form manually or scan a receipt to start.</p>
        
        {/* --- OCR Section --- */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-3">Option 1: Scan a Receipt</h2>
          <form action={formAction}>
            <input
              type="file"
              name="receipt"
              required
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="mt-4">
              <ScanButton />
            </div>
            {state?.message && (
                <p className={`mt-2 text-sm ${state.status === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                    {state.message}
                </p>
            )}
          </form>
        </div>

        {/* --- Manual Form Section --- */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
           <h2 className="text-lg font-semibold mb-4">Option 2: Enter Details Manually</h2>
           <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <input type="number" id="total" step="0.01" placeholder="0.00" value={total} onChange={(e) => setTotal(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            </div>
             <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option>General</option>
                    <option>Groceries</option>
                    <option>Food & Dining</option>
                    <option>Travel</option>
                    <option>Shopping</option>
                </select>
             </div>
             
             {/* Line Items Sub-form */}
             <div>
                <h3 className="text-md font-semibold text-gray-800 mb-2">Line Items</h3>
                <div className="space-y-3">
                    {lineItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                            <input type="text" name="itemName" placeholder="Item Name" value={item.itemName} onChange={e => handleItemChange(index, e)} className="col-span-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            <input type="number" name="quantity" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, e)} className="col-span-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            <input type="number" name="price" placeholder="Price" step="0.01" value={item.price} onChange={e => handleItemChange(index, e)} className="col-span-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            <button type="button" onClick={() => handleRemoveItem(index)} className="col-span-1 text-red-500 hover:text-red-700 font-bold">X</button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={handleAddItem} className="mt-3 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                    + Add Item
                </button>
             </div>

             <button type="submit" className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">
                Confirm and Save Expense
             </button>
           </form>
        </div>
      </main>
    </div>
  );
}