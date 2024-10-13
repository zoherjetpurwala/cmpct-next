import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TextUI = () => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const urls = ["/${code}", "/${header}/${code}"];
  const fullText = urls[loopNum % urls.length];

  useEffect(() => {
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.substring(0, prev.length - 1));
        setTypingSpeed(30);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setDisplayText((prev) => fullText.substring(0, prev.length + 1));
        setTypingSpeed(100);
      }, typingSpeed);
    }

    if (!isDeleting && displayText === fullText) {
      setTimeout(() => setIsDeleting(true), 1000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, typingSpeed, fullText]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="text-black text-3xl font-mono tracking-tight flex flex-col gap-2"
    >
      <span className="font-bold relative z-10 text-xl md:text-xl bg-clip-text text-transparent bg-gradient-to-b to-[90%] from-blue-500 to-blue-900 text-center font-sans  break-words">
        Compact URL:
      </span>

      <div className="text-lg text-gray-600 max-w-2xl mx-auto w-full overflow-hidden break-words">
        https://cmpct.in
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-lg font-semibold text-blue-800 break-all"
        >
          {displayText}
        </motion.span>
      </div>
      <span className="blinking-cursor">|</span>
    </motion.div>
  );
};

export default TextUI;
