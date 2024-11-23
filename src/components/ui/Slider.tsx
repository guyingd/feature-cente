import * as RadixSlider from '@radix-ui/react-slider';
import { motion } from 'framer-motion';

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label
}: SliderProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <RadixSlider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
      >
        <RadixSlider.Track className="relative h-1 grow rounded-full bg-gray-200 dark:bg-gray-700">
          <RadixSlider.Range className="absolute h-full rounded-full bg-purple-600 dark:bg-purple-400" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className="block w-5 h-5 bg-white dark:bg-gray-200 shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          asChild
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        </RadixSlider.Thumb>
      </RadixSlider.Root>
    </div>
  );
} 