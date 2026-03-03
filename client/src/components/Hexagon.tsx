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
      data-testid={`hex-${label}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: delay * 0.06 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className="relative flex items-center justify-center focus:outline-none hex-btn"
    >
      <div className="clip-hexagon hex-border flex items-center justify-center">
        <div className="clip-hexagon hex-inner flex items-center justify-center p-2" style={{ backgroundColor: color }}>
          <span className="text-white text-[10px] sm:text-[11px] font-bold leading-tight text-center drop-shadow-md">
            {label}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
