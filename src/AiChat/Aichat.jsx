import axios from 'axios';
import React, { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import { FiTrash2, FiSend } from 'react-icons/fi'; 
import { HiOutlineClipboardCopy } from 'react-icons/hi'; 
import { GiMagicLamp } from "react-icons/gi";
import debounce from 'lodash.debounce';

// Lazy load the ReactMarkdown component
const ReactMarkdown = lazy(() => import('react-markdown'));

const Aichat = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const cache = useRef({}); // Cache for storing API responses

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Debounced version of the generateAnswer function
  const debouncedGenerateAnswer = useRef(
    debounce(async (question) => {
      setGeneratingAnswer(true);
      setAnswer('Loading your answer...');

      // Check if the answer is in the cache
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

        // Cache the new answer
        cache.current[question] = newAnswer;

        // Update search history
        if (question.trim() !== '') {
          setSearchHistory(prevHistory => [...prevHistory, question]);
        }
      } catch (error) {
        console.log(error);
        setAnswer('Sorry - Something went wrong. Please try again!');
      }

      setGeneratingAnswer(false);
    }, 500)
  ).current;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() !== '') {
      debouncedGenerateAnswer(question);
      setQuestion('');
    }
  };

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const removeFromHistory = useCallback((index) => {
    setSearchHistory(prevHistory => prevHistory.filter((_, i) => i !== index));
  }, []);

  const copyAnswerToClipboard = useCallback(() => {
    navigator.clipboard.writeText(answer);
  }, [answer]);

  return (
    <div className="max-w-screen mx-auto bg-[#161315] min-h-screen px-4 py-8">
      <h1 className="text-4xl font-cinzel font-semibold text-center mb-8 text-[#F58840] flex items-center justify-center">
        <GiMagicLamp className="mr-2 text-[#F58840] text-4xl" /> IntelliGenie
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chat Section */}
        <div className="col-span-2 bg-[#161315] rounded-lg p-4">
          <Suspense fallback={<div className="text-gray-200 md:text-lg mb-4">Loading...</div>}>
            <ReactMarkdown className="text-gray-200 md:text-lg mb-4">{answer}</ReactMarkdown>
          </Suspense>
          <form onSubmit={handleSubmit} className="mb-4 flex items-center">
            <input
              required
              type="text"
              className="border border-gray-300 rounded-full w-full my-2 p-3 mr-2 focus:border-[#F58840] focus:outline-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
            />
            <button
              type="submit"
              className={`bg-[#F58840] text-gray-200 p-3 rounded-full hover:bg-gray-600 transition-all duration-300 ${
                generatingAnswer ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={generatingAnswer}
            >
              <FiSend className="inline-block mr-1 text-xl" />
            </button>
          </form>
          {answer && (
            <button
              onClick={copyAnswerToClipboard}
              className="mt-2 bg-[#F58840] text-white p-2 rounded-md hover:bg-gray-600 focus:outline-none flex items-center"
            >
              <HiOutlineClipboardCopy className="inline-block mr-1" /> Copy Answer
            </button>
          )}
        </div>
        {/* Search History Section */}
        <div className="col-span-1 bg-[#1a151a] min-h-auto border-l border-gray-300 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#F58840]">Search History</h2>
            <button
              onClick={clearHistory}
              className="text-gray-200 hover:text-red-600 focus:outline-none"
            >
              <FiTrash2 className="text-lg" />
            </button>
          </div>
          <ul className="list-disc list-inside h-full overflow-y-auto">
            {searchHistory.map((query, index) => (
              <li key={index} className="flex justify-between items-center text-gray-200">
                <span>{query}</span>
                <div className="flex">
                  <button
                    onClick={() => removeFromHistory(index)}
                    className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Aichat);
