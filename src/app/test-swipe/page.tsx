"use client"
import { motion } from 'framer-motion';

export default function TestSwipe() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        style={{
          width: 320,
          height: 400,
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 600,
          color: '#333',
        }}
      >
        Swipe-moi !
      </motion.div>
    </div>
  );
} 