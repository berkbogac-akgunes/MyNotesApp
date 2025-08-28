import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
    
    // To-Do State
    const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem("todos");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
    const [inputTodo, setInputTodo] = useState("")
    const [weather, setWeather] = useState()

    useEffect(() => {
        axios.get("https://api.open-meteo.com/v1/forecast?latitude=41.0&longitude=29.0&current_weather=true")
        .then(res => {
            console.log("Weather API Response:", res.data);
            setWeather(res.data.current_weather);
        })
        .catch(err => {
            console.error("Error from Weather API:", err);
        })
    }, []);

    // 2) Her değişimde storage'a yaz
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos])

    //To-Do Handlers
    function addTodo() {
        const t = inputTodo.trim();
        if (!t) return;
        setTodos([...todos, t]);
        setInputTodo("");
    }

    function removeTodo(index) {
        setTodos(todos.filter((_, i) => i !== index));
    }

    function clearTodos() {
        setTodos([]);
    }

    return(
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Banner */}
        <div className="w-full sticky top-0 z-10 bg-slate-800/80 backdrop-blur border-b border-white/10">
          <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
            {/* Weather */}
            {weather && (
            <div className="flex items-center gap-3">
                <span className="text-3xl">🌡️</span>
                <div>
                <p className="font-bold">Istanbul</p>
                <p className="text-sm text-white/70">
                    {weather.temperature}°C • {weather.windspeed} m/s
                </p>
                </div>
            </div>
            )}

        {/* Countdown */}
        <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full">
          <span className="text-xl">📝</span>
          <span className="font-semibold">{todos.length} Notes & To-Do's</span>
        </div>
      </div>
    </div>

    {/* Notes */}
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white/10 rounded-2xl shadow-xl border border-white/10">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={inputTodo}
          onChange={(e) => setInputTodo(e.target.value)}
          className="flex-1 h-12 px-3 rounded-lg border border-white/20 bg-white/5 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Write your notes here..."
        />
        <button
          onClick={addTodo}
          className="px-4 h-12 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo, index) => (
          <li
            key={index}
            className="flex justify-between items-center px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/20 transition"
          >
            <span>{todo}</span>
            <button
              onClick={() => removeTodo(index)}
              className="px-2 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <button
          onClick={clearTodos}
          className="mt-4 w-full px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white"
        >
          Clear All
        </button>
      )}
    </div>
  </div>
)}