import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { Employee } from "@shared/schema";

interface EmployeeCardProps {
  employee: Employee;
  index: number;
  onClick: () => void;
}

export function EmployeeCard({ employee, index, onClick }: EmployeeCardProps) {
  const initials = employee.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.button
      data-testid={`card-employee-${employee.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
    >
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
        {employee.photo && !employee.photo.includes("placeholder") ? (
          <img
            src={employee.photo}
            alt={employee.name}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-slate-400 font-bold text-lg">${initials}</span>`;
            }}
          />
        ) : (
          <User className="w-6 h-6 text-slate-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 text-[15px] truncate" data-testid={`text-name-${employee.id}`}>
          {employee.name}
        </h3>
        <p className="text-slate-500 text-sm truncate mt-0.5">
          {employee.position}
        </p>
      </div>
      <svg className="w-5 h-5 text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </motion.button>
  );
}
