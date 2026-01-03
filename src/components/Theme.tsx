import {useState, useEffect} from 'react';
import {Sun, Moon} from 'lucide-react';
import type {Theme} from '../types';


const getPreferredTheme = (): Theme => {
    if (localStorage.theme === "dark") return "dark";
    if (localStorage.theme === "light") return "light";
    return window.matchMedia("(prefers-color-scheme: dark").matches ? "dark" : "light";
};

const ThemeToggle = () => {
    const [theme, setTheme] = useState<Theme>(getPreferredTheme());

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
        localStorage.theme = theme;
    };

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.theme = theme;
    }, [theme]);


    return (
        <button
        onClick={() => toggleTheme()}
        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        aria-label="Toggle dark mode"
        >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-orange-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
        </button>
    );
}


export default ThemeToggle;