'use client';

import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function TiltCard({ children, className = '', style }: TiltCardProps) {
  const [transform, setTransform] = useState('perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)');

  return (
    <motion.article
      className={`tilt-card ${className}`}
      style={{ ...style, transform }}
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 12;
        const rotateX = ((0.5 - y / rect.height) * 12);
        setTransform(`perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(18px)`);
      }}
      onPointerLeave={() => setTransform('perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)')}
    >
      {children}
    </motion.article>
  );
}
