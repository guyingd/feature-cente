import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <motion.div
      {...fadeIn}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
} 