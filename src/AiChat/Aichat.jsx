import axios from 'axios';
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { FiTrash2, FiSend, FiMenu, FiX } from 'react-icons/fi'; 
import { HiOutlineClipboardCopy } from 'react-icons/hi'; 
import { GiMagicLamp } from "react-icons/gi";

// Lazy load the ReactMarkdown component
const ReactMarkdown = lazy(() => import('react-markdown'));

const Aichat = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [showHistory, setShowHistory] = useState(false); // State for sidebar visibility
  const cache = useRef({});

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const generateAnswer = async (question) => {
    setGeneratingAnswer(true);
    setAnswer('Loading your answer...');

    if (cache.current[question]) {
      setAnswer(cache.current[question]);
      setGeneratingAnswer(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );
      const newAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(newAnswer);
      cache.current[question] = newAnswer;
      if (question.trim() !== '') {
        setSearchHistory(prevHistory => [...prevHistory, question]);
      }
    } catch (error) {
      console.log(error);
      setAnswer('Sorry - Something went wrong. Please try again!');
    }

    setGeneratingAnswer(false);
  };

  const handleSendClick = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const newDebounceTimer = setTimeout(() => {
      if (question.trim() !== '') {
        generateAnswer(question);
      }
    }, 1000); // 1 second debounce period
    setDebounceTimer(newDebounceTimer);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default Enter key behavior (e.g., form submission)
      handleSendClick();
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const removeFromHistory = (index) => {
    setSearchHistory(prevHistory => prevHistory.filter((_, i) => i !== index));
  };

  const copyAnswerToClipboard = () => {
    navigator.clipboard.writeText(answer);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="bg-gray-800 text-gray-300 p-4 shadow-md flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-[#F58840] flex items-center">
          <GiMagicLamp className="mr-2 text-[#F58840] text-3xl" /> IntelliGenie
        </h1>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="lg:hidden text-gray-400 hover:text-white focus:outline-none"
        >
          <FiMenu className="text-2xl" />
        </button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <main className="flex-1 bg-gray-800 text-gray-200 shadow-lg p-6 flex flex-col relative">
          <div className="flex-1 overflow-auto mb-4">
            <div className="space-y-4">
              {/* User question and answer bubbles */}
              <div className="flex flex-col">
                {searchHistory.map((query, index) => (
                  <div key={index} className="flex flex-col mb-2">
                    <div className="bg-gray-700 text-gray-200 p-3 rounded-lg">
                      <ReactMarkdown className="text-lg">{query}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {answer && (
                  <div className="flex flex-col mb-2">
                    <div className="bg-gray-700 text-gray-200 p-3 rounded-lg">
                      <Suspense fallback={<div className="text-gray-400 text-lg">Loading...</div>}>
                        <ReactMarkdown className="text-lg">{answer}</ReactMarkdown>
                      </Suspense>
                      {/* Copy Answer Button */}
                      <button
                        onClick={copyAnswerToClipboard}
                        className="bg-[#F58840] text-white p-2 rounded-md hover:bg-[#e07b39] focus:outline-none flex items-center mt-2"
                      >
                        <HiOutlineClipboardCopy className="inline-block mr-2" /> Copy Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-none flex items-center mt-4">
            {/* Search Bar */}
            <div className="relative flex items-center w-full">
              <input
                required
                type="text"
                className="bg-gray-700 text-gray-200 placeholder-gray-400 rounded-full w-full p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#F58840]"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
              />
              <button
                type="button"
                onClick={handleSendClick}
                className={`absolute right-3 p-2 rounded-full bg-[#F58840] text-gray-200 hover:bg-[#e07b39] transition-all duration-300 ${generatingAnswer ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={generatingAnswer}
              >
                <FiSend className="text-xl" />
              </button>
            </div>
          </div>
        </main>
        {/* Search History Area */}
        <aside
          className={`lg:w-80 lg:block bg-gray-700 shadow-lg p-6 overflow-auto transition-transform duration-300 ease-in-out ${
            showHistory ? 'translate-x-0' : 'translate-x-full'
          } fixed top-0 right-0 h-full lg:static lg:translate-x-0`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#F58840]">Search History</h2>
            <button
              onClick={clearHistory}
              className="text-gray-400 hover:text-red-500 focus:outline-none"
            >
              <FiTrash2 className="text-lg" />
            </button>
            {/* Close Button */}
            <button
              onClick={() => setShowHistory(false)}
              className="lg:hidden text-gray-400 hover:text-white focus:outline-none"
            >
              <FiX className="text-2xl" />
            </button>
          </div>
          <ul className="list-disc list-inside">
            {searchHistory.map((query, index) => (
              <li key={index} className="flex justify-between items-center text-gray-200 mb-2">
                <span>{query}</span>
                <button
                  onClick={() => removeFromHistory(index)}
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <footer className="bg-gray-800 text-gray-400 p-4 text-center">
        <p>© 2024 IntelliGenie. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Aichat;
