import * as RadixTabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab = tabs[0]?.id }: TabsProps) {
  return (
    <RadixTabs.Root defaultValue={defaultTab}>
      <RadixTabs.List className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.id}
            value={tab.id}
            className="group relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 outline-none cursor-pointer"
          >
            {tab.label}
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
              transition={{ duration: 0.3 }}
            />
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {tabs.map((tab) => (
        <RadixTabs.Content
          key={tab.id}
          value={tab.id}
          className="mt-4 focus:outline-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab.content}
          </motion.div>
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
} 