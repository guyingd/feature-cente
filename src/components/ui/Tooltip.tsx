import * as RadixTooltip from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <AnimatePresence>
          <RadixTooltip.Portal>
            <RadixTooltip.Content
              sideOffset={5}
              className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {content}
                <RadixTooltip.Arrow className="fill-gray-900" />
              </motion.div>
            </RadixTooltip.Content>
          </RadixTooltip.Portal>
        </AnimatePresence>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
} 