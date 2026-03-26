import { useState, useEffect } from 'react';
import Head from 'next/head';
import { MapPin, Wallet, Sparkles, Calendar, Users, Wand2, Compass, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    destination: '',
    budget: 'medium',
    mood: 'relax',
    days: 3,
    travelType: 'solo',
    hiddenGems: false,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Small fix to avoid hydration mismatch with lucide icons if needed, 
  // but lucide-react mostly works fine. We will ensure components are mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const generateTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate itinerary');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Head>
        <title>AI Holiday Planner</title>
        <meta name="description" content="Generate personalized travel itineraries with AI" />
      </Head>

      <main className="max-w-5xl mx-auto">
        <div className="text-center mb-10 mt-6">
          <div className="flex justify-center mb-4 text-purple-600">
            <Compass size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 tracking-tight">
            AI Travel Companion
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Discover magical destinations tailored precisely to your mood, budget, and travel style. Let's create an unforgettable journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Input Form */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Wand2 className="mr-2 text-indigo-500" /> Plan Your Trip
              </h2>

              <form onSubmit={generateTrip} className="space-y-5">
                {/* Destination */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <MapPin size={16} className="mr-1 text-gray-400"/> Destination
                  </label>
                  <input
                    type="text"
                    name="destination"
                    required
                    placeholder="e.g. Kyoto, Bali, or 'Anywhere'"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all shadow-sm"
                    value={formData.destination}
                    onChange={handleChange}
                  />
                </div>

                {/* Days */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <Calendar size={16} className="mr-1 text-gray-400"/> Number of Days
                  </label>
                  <input
                    type="number"
                    name="days"
                    min="1"
                    max="14"
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all shadow-sm"
                    value={formData.days}
                    onChange={handleChange}
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <Wallet size={16} className="mr-1 text-gray-400"/> Budget Level
                  </label>
                  <select
                    name="budget"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none bg-white shadow-sm"
                    value={formData.budget}
                    onChange={handleChange}
                  >
                    <option value="low">Low / Backpacking</option>
                    <option value="medium">Medium / Comfort</option>
                    <option value="luxury">Luxury / Premium</option>
                  </select>
                </div>

                {/* Travel Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <Users size={16} className="mr-1 text-gray-400"/> Whose traveling?
                  </label>
                  <select
                    name="travelType"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none bg-white shadow-sm"
                    value={formData.travelType}
                    onChange={handleChange}
                  >
                    <option value="solo">Solo Healing</option>
                    <option value="couple">Couple / Romantic</option>
                    <option value="friends">Friends Group</option>
                    <option value="family">Family Gathering</option>
                  </select>
                </div>

                {/* Mood */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <Sparkles size={16} className="mr-1 text-gray-400"/> Vibe & Mood
                  </label>
                  <select
                    name="mood"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none bg-white shadow-sm"
                    value={formData.mood}
                    onChange={handleChange}
                  >
                    <option value="relax">Relax & Unwind 🏖️</option>
                    <option value="adventure">Thrilling Adventure 🧗‍♂️</option>
                    <option value="romantic">Romantic Escape 🍷</option>
                    <option value="party">Nightlife & Party 🪩</option>
                    <option value="cultural">Culture & History 🏛️</option>
                  </select>
                </div>

                {/* Hidden Gems Toggle */}
                <div className="flex items-center pt-2">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                      type="checkbox" 
                      name="hiddenGems" 
                      id="toggle" 
                      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer focus:outline-none transition-transform duration-200 ease-in-out checked:bg-indigo-500 checked:translate-x-5 checked:border-indigo-500"
                      checked={formData.hiddenGems}
                      onChange={handleChange}
                    />
                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                  <label htmlFor="toggle" className="text-sm text-gray-700 font-medium cursor-pointer">
                    Avoid tourist traps (Find Hidden Gems)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg transform transition active:scale-95 disabled:opacity-70 flex justify-center items-center"
                >
                  {loading ? (
                    <span className="animate-pulse">Crafting your itinerary...</span>
                  ) : (
                    <>Generate Trip <Sparkles size={18} className="ml-2" /></>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Output Dashboard */}
          <div className="lg:col-span-7">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-6 font-medium">
                <strong>Error:</strong> {error}
              </div>
            )}

            {!result && !loading && !error && (
              <div className="h-full glass-card border-dashed border-2 border-gray-300 flex flex-col items-center justify-center p-10 text-gray-400 min-h-[400px]">
                <Compass size={64} className="mb-4 opacity-50" />
                <p className="text-lg">Your itinerary will magically appear here.</p>
              </div>
            )}

            {loading && (
              <div className="h-full glass-card flex flex-col items-center justify-center p-10 min-h-[400px] animate-pulse">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4 animate-[spin_1s_linear_infinite]"></div>
                <p className="text-indigo-600 font-semibold text-lg">Consulting local experts & AI logic...</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                {/* Story Card */}
                <div className="glass-card p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                  <h3 className="text-xl font-bold mb-3 text-indigo-50 flex items-center">
                    <Sparkles className="mr-2" size={20} /> The Vibe
                  </h3>
                  <p className="leading-relaxed text-lg text-indigo-50 font-medium italic">
                    "{result.story}"
                  </p>
                </div>

                {/* Budget Card */}
                <div className="glass-card p-6 border-l-4 border-l-green-400">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <Wallet className="mr-2 text-green-500" size={20} /> Budget Breakdown
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Stay</p>
                      <p className="font-medium text-gray-800 text-sm">{result.budget.stay}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Food</p>
                      <p className="font-medium text-gray-800 text-sm">{result.budget.food}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Transport</p>
                      <p className="font-medium text-gray-800 text-sm">{result.budget.transport}</p>
                    </div>
                  </div>
                </div>

                {/* Itinerary */}
                <div className="glass-card p-6">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <Calendar className="mr-2 text-blue-500" size={24} /> Day-by-Day Plan
                  </h3>
                  
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                    {result.itinerary?.map((item, index) => (
                      <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-indigo-100 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
                          {item.day}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-gray-100 shadow-md transform transition group-hover:-translate-y-1">
                          <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                            <CheckCircle2 size={16} className="text-indigo-500 mr-2"/> Day {item.day}
                          </h4>
                          <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                            {item.plan}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </main>
      
      {/* Required for Tailwind toggle switch logic without external libraries */}
      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked { right: 0; border-color: #68d391; }
        .toggle-checkbox:checked + .toggle-label { background-color: #6366f1; }
        .toggle-checkbox { right: 0; z-index: 1; border-color: #e2e8f0; transition: all 0.3s; }
      `}} />
    </div>
  );
}
