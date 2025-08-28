import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {

    // Counter State
    const [count, setCount] = useState(0);
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

    // Counter Handlers
    function increment() {
        setCount(count + 1);
    }

    function decrement() {
        setCount(count - 1);
    }

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
        <>
        <div className = "max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Weather in Istanbul</h2>
            {weather && <p className="text-xl">🌡️ Temperature: {weather.temperature}°C</p>}
        </div>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Counter App</h2>
            <div className = "flex items-center justify-center space-x-4">
            <button
                onClick = {decrement}
                className = "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
                -
            </button>
            <span className="text-xl font-semibold">{count}</span>
                <button
                    onClick={increment}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                    +
                </button>
                </div>
        </div>

        <div className = "flex flex-col justify-center space-y-8 max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h1 className = "text-3xl font-bold flex justify-center items-center mt-6">My Notes</h1>
            <input
            type = "text"
            value = {inputTodo}
            onChange = {(e) => setInputTodo(e.target.value)}
            className = "w-full h-12 p-2 border border-gray-300 rounded mt-4" 
            placeholder = "Write your notes here...">
            </input>
            <button
                onClick={addTodo}
                className="w-32 mx-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Add Note
            </button>

            <ul className = "mb-4 mt-4">
                {todos.map((todo, index) => (
                    <li key = {index} className="flex justify-between items-center mb-2 bg-gray-100 px-3 py-2 rounded">
                        <span>{todo}</span>
                        <button
                            onClick={() => removeTodo(index)}
                            className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500 transition"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            {todos.length > 0 && (
                <button
                    onClick={clearTodos}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                    Clear All
                </button>
            )}
        </div>

        </>
    )
}