"use client";
import React, { useState, useEffect } from 'react';

const Typewriter = ({ textArray, delay, infinite, pauseTime }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [arrayIndex, setArrayIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (currentIndex <= textArray[arrayIndex].length) {
      timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + textArray[arrayIndex][currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
    } else {
      // Pause before starting the next text
      timeout = setTimeout(() => {
        if (arrayIndex < textArray.length - 1) {
          setArrayIndex(prevIndex => prevIndex + 1);
        } else if (infinite) {
          setArrayIndex(0);
        }
        setCurrentIndex(0);
        setCurrentText('');
      }, pauseTime); // Wait for a bit before switching text
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, arrayIndex, textArray, delay, infinite, pauseTime]);

  return <span>{currentText}</span>;
};

export default Typewriter;
