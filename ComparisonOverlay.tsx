import { useCompare } from '../context/ComparisonContext';
import ComparisonTool from './ComparisonTool';
import { AnimatePresence } from 'motion/react';

export default function ComparisonOverlay() {
  const { compareList, clearCompare, isComparing } = useCompare();

  return (
    <AnimatePresence>
      {isComparing && (
        <ComparisonTool products={compareList} onClose={clearCompare} />
      )}
    </AnimatePresence>
  );
}
