import { motion } from "framer-motion";
import { Phone, MessageCircle, Send, Mail } from "lucide-react";
import type { Employee } from "@shared/schema";

interface EmployeeCardProps {
  employee: Employee;
  index: number;
}

export function EmployeeCard({ employee, index }: EmployeeCardProps) {
  // Format links appropriately
  const cleanPhone = employee.phone ? employee.phone.replace(/\D/g, '') : '';
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
  const tgLink = employee.phone ? `https://t.me/${employee.phone}` : null;
  const telLink = employee.phone ? `tel:${employee.phone}` : null;
  const emailLink = employee.email ? `mailto:${employee.email}` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.1)] transition-all duration-300 group"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300">
          {employee.photo ? (
            <img 
              src={employee.photo} 
              alt={employee.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">
              {employee.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
          {employee.name}
        </h3>
        <p className="text-slate-500 font-medium text-sm sm:text-base mt-0.5 truncate">
          {employee.position}
        </p>
        <span className="inline-block mt-2 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
          {employee.department}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-row flex-wrap gap-2 sm:gap-3 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-50 sm:border-0">
        {telLink && (
          <ActionBtn href={telLink} icon={Phone} bg="bg-blue-50 hover:bg-blue-100" text="text-blue-600" aria="Call" />
        )}
        {waLink && (
          <ActionBtn href={waLink} icon={MessageCircle} bg="bg-emerald-50 hover:bg-emerald-100" text="text-emerald-600" aria="WhatsApp" />
        )}
        {tgLink && (
          <ActionBtn href={tgLink} icon={Send} bg="bg-sky-50 hover:bg-sky-100" text="text-sky-600" aria="Telegram" />
        )}
        {emailLink && (
          <ActionBtn href={emailLink} icon={Mail} bg="bg-purple-50 hover:bg-purple-100" text="text-purple-600" aria="Email" />
        )}
      </div>
    </motion.div>
  );
}

// Sub-component for individual action buttons
function ActionBtn({ href, icon: Icon, bg, text, aria }: any) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={aria}
      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${bg}`}
    >
      <Icon className={`w-5 h-5 sm:w-5 sm:h-5 ${text}`} />
    </a>
  );
}
