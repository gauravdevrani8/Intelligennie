import React from 'react';
import Spline from '@splinetool/react-spline';
import { PiChatCenteredDotsThin } from "react-icons/pi";
import { MdArrowForward } from "react-icons/md";
import { GiMagicLamp } from "react-icons/gi";
import backgroundVideo from '../assets/background2.mp4';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative flex flex-col text-white items-center md:h-[100vh]  h-screen overflow-hidden bg-black font-sans">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute bottom-0 top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Top Bar with Logo and Download Button */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center p-4 md:p-8">
        <div className="flex items-center text-2xl md:text-3xl font-bold text-secondary font-mono">
          <GiMagicLamp className="mr-2" /> IntelliGenie
        </div>
        <Link to="/download-app">
          <button className="button border-2 border-secondary hidden md:block text-secondary bg-white hover:bg-secondary hover:text-white transition duration-300 ease-in-out py-1 px-2 md:py-4 md:px-6 rounded-full shadow-lg">
            Download App
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-between w-full h-full px-6 md:px-10 py-6 md:py-0 z-20">
        {/* Left Side Content */}
        <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-5xl font-semibold mb-2 md:mb-4">
            <span className="font-mono ">Hi, I'm </span> <span className="text-primary font-mono">IntelliGenie</span>
          </h1>
          <p className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 text-accent">
            Your Intelligent Chatbot Assistant
          </p>
          <p className="text-sm md:text-lg mb-4 md:mb-8 text-accent">
            Helping you navigate through tasks and providing quick responses to all your queries.
          </p>
          <Link to="/aichat">
            <button className="button border flex border-primary text-primary bg-white hover:text-white hover:bg-secondary transition duration-300 ease-in-out py-3 px-6 md:py-4 md:px-7 rounded-full shadow-lg">
              Get Started <MdArrowForward className="text-xl md:text-2xl ml-2" />
            </button>
          </Link>
          <PiChatCenteredDotsThin className="text-xl md:text-2xl text-primary hover:text-white transition duration-300" />
        </div>

        {/* Right Side Spline Animation */}
        <div className="relative md:w-1/2 md:h-full hidden md:flex h-72 w-full p-4 md:p-0  justify-center items-center z-10">
          <Spline scene="https://prod.spline.design/ychAIh7nCMgkmC9T/scene.splinecode" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
