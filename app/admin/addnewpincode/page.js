"use client"
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function PincodeForm() {
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState(null);
  const { toast } = useToast(); // Initialize the toast

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pincode.length !== 6 || isNaN(pincode)) {
      setError('Pincode must be 6 numeric characters');
      return;
    }

    // Clear error if valid
    setError(null);

    const response = await fetch('/api/addnewpincode', {
      method: 'POST',
      body: JSON.stringify({ pincode }),
    });
    const data = await response.json();

    if (!data.success) {
      // Show an error toast message
      toast({
        title: "Error",
        description: response.message,
        status: "error",
        duration: 4000,
      });
    }
    else {
      // Show a success toast message
      toast({
        title: "Success",
        description: response.message,
        status: "success",
        duration: 4000,
      });
    }

    // Reset the form after submission
    setPincode('');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Enter Your Pincode</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter 6 digit pincode"
              maxLength="6"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-bold text-lg bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
