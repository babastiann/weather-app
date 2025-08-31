import { useState } from "react";

const Weather = () => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ tambahin ini

  const API_KEY = import.meta.env.VITE_WEATHER_KEY;

  
  const fetchCitySuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getWeather = async (lat, lon, name) => {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      if (!res.ok) throw new Error("Gagal mengambil data cuaca");
      const data = await res.json();
      setWeather({ ...data, displayName: name });
      setError(null);
      setSuggestions([]);
    } catch (err) {
      setWeather(null);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl text-white">
        <h1 className="text-3xl font-extrabold mb-6 text-center">🌤️ Weatherly</h1>

        {/* Input */}
        <input
          type="text"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            fetchCitySuggestions(e.target.value);
          }}
          placeholder="🔍 Cari kota..."
          className="w-full px-4 py-3 mb-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

    
        {/* Dropdown */}
        {loading ? (
          <div className="w-full mt-2 flex justify-center">
            <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          suggestions.length > 0 && (
            <ul
              className="list-none w-full mt-2 rounded-2xl overflow-hidden 
                   bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 
                   backdrop-blur-lg shadow-lg animate-fade-in border border-white/20"
            >
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => getWeather(s.lat, s.lon, `${s.name}, ${s.country}`)}
                  className="px-4 py-3 text-white cursor-pointer 
                     hover:bg-white/20 hover:scale-[1.02] active:scale-95
                     transition-all duration-200 ease-in-out 
                     flex justify-between items-center"
                >
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-xs opacity-80 italic">
                    {s.state ? `${s.state}, ` : ""}
                    {s.country}
                  </span>
                </li>
              ))}
            </ul>
          )
        )}

        {/* Error */}
        {error && <p className="text-red-300 mt-4 text-center animate-bounce">❌ {error}</p>}

        {/* Weather card */}
        {weather && (
          <div className="mt-6 p-6 bg-white/20 rounded-2xl shadow-lg text-center animate-fade-in">
            <h2 className="text-2xl font-bold">{weather.displayName}</h2>
            <p className="capitalize text-lg">{weather.weather[0].description} ☁️</p>
            <p className="text-4xl font-extrabold mt-2">{weather.main.temp}°C</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
