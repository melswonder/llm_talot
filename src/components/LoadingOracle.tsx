"use client";

import { motion } from "framer-motion";

export default function LoadingOracle() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4 py-12"
    >
      <motion.div
        className="text-5xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {"\u{1F52E}"}
      </motion.div>
      <p className="text-lg text-foreground/70">運命を読み解いています...</p>
    </motion.div>
  );
}
