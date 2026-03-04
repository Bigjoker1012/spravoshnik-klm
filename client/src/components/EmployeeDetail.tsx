import { motion } from "framer-motion";
import { Phone, MessageCircle, Send, Mail, User, ArrowLeft } from "lucide-react";
import type { Employee } from "@shared/schema";

interface EmployeeDetailProps {
  employee: Employee;
  supervisor: Employee | null;
  onBack: () => void;
}

export function EmployeeDetail({ employee, supervisor, onBack }: EmployeeDetailProps) {
  const initials = employee.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  const phoneForLinks = employee.workPhone || employee.personalPhone;
  const cleanPhone = phoneForLinks ? phoneForLinks.replace(/\D/g, "") : "";

  const actions = [
    {
      available: !!phoneForLinks,
      href: `tel:${phoneForLinks}`,
      icon: Phone,
      label: "Позвонить",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      available: !!cleanPhone,
      href: `https://wa.me/${cleanPhone}`,
      icon: MessageCircle,
      label: "WhatsApp",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      available: !!cleanPhone,
      href: `https://t.me/+${cleanPhone}`,
      icon: Send,
      label: "Telegram",
      bg: "bg-sky-50",
      text: "text-sky-600",
    },
    {
      available: !!employee.email,
      href: `mailto:${employee.email}`,
      icon: Mail,
      label: "E-mail",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pb-20" style={{ backgroundColor: '#e8f5f0' }}
    >
      <div className="bg-white border-b border-slate-100 pt-4 pb-4 px-4 sticky top-0 z-20">
        <div className="max-w-lg mx-auto">
          <button
            data-testid="button-back-detail"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4 border-4 border-white shadow-lg">
            {employee.photo && !employee.photo.includes("placeholder") ? (
              <img
                src={employee.photo}
                alt={employee.name}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-slate-400 font-bold text-2xl">${initials}</span>`;
                }}
              />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900" data-testid="text-employee-name">
            {employee.name}
          </h2>
          <p className="text-slate-500 font-medium mt-1">{employee.position}</p>
        </div>

        <div className="space-y-3">
          {employee.workPhone && (
            <InfoRow label="Тел. рабочий" value={employee.workPhone} />
          )}
          {employee.personalPhone && (
            <InfoRow label="Тел. личный" value={employee.personalPhone} />
          )}
          {employee.internalExt && (
            <InfoRow label="Внутренний" value={employee.internalExt} />
          )}
          {employee.email && (
            <InfoRow label="E-mail" value={employee.email} />
          )}
          {employee.birthday && (
            <InfoRow label="День рождения" value={employee.birthday} />
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {actions.filter(a => a.available).map((action) => (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`button-action-${action.label.toLowerCase()}`}
              className={`${action.bg} rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform`}
            >
              <action.icon className={`w-6 h-6 ${action.text}`} />
              <span className={`font-bold text-sm ${action.text}`}>{action.label}</span>
            </a>
          ))}
        </div>

        {supervisor && (
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2">
            <span className="text-xs text-slate-400">Руководитель:</span>
            <span className="text-xs text-slate-500" data-testid="text-supervisor-name">
              {supervisor.name}, {supervisor.position}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-slate-100 flex justify-between items-center gap-2">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right truncate">{value}</span>
    </div>
  );
}
