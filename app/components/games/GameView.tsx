import { motion } from "framer-motion";
import { useState } from "react";

export function GameViewCard({ children }: { children: React.ReactNode }) {
  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="mx-auto grid w-4/5 grid-cols-1 gap-4 rounded-md p-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
    >
      {children}
    </motion.div>
  );
}

export function GameViewList({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex w-full flex-col">{children}</div>;
}
