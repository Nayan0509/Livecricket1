import React from "react";
import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] } },
};

export function MotionGrid({ style, children }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={style}>
      {children}
    </motion.div>
  );
}

export function MotionItem({ children }) {
  return <motion.div variants={item}>{children}</motion.div>;
}
