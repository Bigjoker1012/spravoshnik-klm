import { motion } from "framer-motion";

interface HexagonProps {
  label: string;
  color: string;
  onClick: () => void;
  delay?: number;
}

export function Hexagon({ label, color, onClick, delay = 0 }: HexagonProps) {
  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay: delay * 0.05 
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 rounded-full"
    >
      <div 
        className="w-[100px] h-[115px] clip-hexagon flex items-center justify-center p-3 transition-colors duration-300 shadow-xl"
        style={{ backgroundColor: color }}
      >
        <span className="text-white text-xs font-semibold leading-tight text-center drop-shadow-md">
          {label}
        </span>
      </div>
    </motion.button>
  );
}
