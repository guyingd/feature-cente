import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
}

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger asChild>
        {trigger}
      </RadixDropdownMenu.Trigger>
      <AnimatePresence>
        <RadixDropdownMenu.Portal>
          <RadixDropdownMenu.Content
            className="min-w-[220px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2"
            sideOffset={5}
            asChild
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {items.map((item, index) => (
                <RadixDropdownMenu.Item
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={item.onClick}
                >
                  {item.icon}
                  {item.label}
                </RadixDropdownMenu.Item>
              ))}
            </motion.div>
          </RadixDropdownMenu.Content>
        </RadixDropdownMenu.Portal>
      </AnimatePresence>
    </RadixDropdownMenu.Root>
  );
} 