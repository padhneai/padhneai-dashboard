import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  submitting: 'idle' | 'loading' | 'success';
  mode: 'add' | 'edit';
}

export default function LoadingOverlay({ submitting, mode }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {submitting !== 'idle' && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 right-0 bottom-0 top-0 inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-700 font-semibold">
              {mode === 'edit'
                ? submitting === 'loading'
                  ? 'Updating Paper...'
                  : 'Update Successful!'
                : submitting === 'loading'
                  ? 'Publishing Paper...'
                  : 'Published Successfully!'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
