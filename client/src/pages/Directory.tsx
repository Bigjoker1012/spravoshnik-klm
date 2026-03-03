import { useState, useMemo, useCallback } from "react";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDirectoryData } from "@/hooks/use-employees";
import { Hexagon } from "@/components/Hexagon";
import { EmployeeCard } from "@/components/EmployeeCard";
import { EmployeeDetail } from "@/components/EmployeeDetail";
import type { Employee } from "@shared/schema";

type Screen = "home" | "department" | "detail";

const DEPT_COLORS: Record<string, string> = {
  "1": "#1e3a8a",
  "2": "#10b981",
  "3": "#fb7185",
  "4": "#84cc16",
  "5": "#4338ca",
  "6": "#60a5fa",
  "7": "#eab308",
  "8": "#8b5cf6",
};

const FALLBACK_COLOR = "#6b7280";

export default function Directory() {
  const { data, isLoading, isError } = useDirectoryData();

  const [screen, setScreen] = useState<Screen>("home");
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const employees = data?.employees || [];
  const departments = data?.departments || [];

  const selectedDeptName = useMemo(() => {
    if (!selectedDeptId) return "";
    return departments.find((d) => d.id === selectedDeptId)?.name || "";
  }, [departments, selectedDeptId]);

  const deptEmployees = useMemo(() => {
    if (!selectedDeptId) return [];
    return employees.filter((e) => e.departmentId === selectedDeptId);
  }, [employees, selectedDeptId]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
    );
  }, [employees, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  const findSupervisor = useCallback(
    (emp: Employee): Employee | null => {
      if (!emp.supervisorCode) return null;
      return employees.find((e) => e.employeeCode === emp.supervisorCode) || null;
    },
    [employees]
  );

  const handleDeptClick = (deptId: string) => {
    setSelectedDeptId(deptId);
    setScreen("department");
    setSearchQuery("");
  };

  const handleEmployeeClick = (emp: Employee) => {
    setSelectedEmployee(emp);
    setScreen("detail");
  };

  const handleBack = () => {
    if (screen === "detail") {
      if (isSearching) {
        setSelectedEmployee(null);
        setScreen("home");
      } else {
        setSelectedEmployee(null);
        setScreen("department");
      }
    } else if (screen === "department") {
      setSelectedDeptId(null);
      setScreen("home");
    }
  };

  const handleBackToHome = () => {
    setScreen("home");
    setSelectedDeptId(null);
    setSelectedEmployee(null);
    setSearchQuery("");
  };

  if (screen === "detail" && selectedEmployee) {
    return (
      <EmployeeDetail
        employee={selectedEmployee}
        supervisor={findSupervisor(selectedEmployee)}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] pb-6" style={{ backgroundColor: '#e8f5f0' }}>
      <div className="border-b border-emerald-200 pt-[max(env(safe-area-inset-top),12px)] pb-4 px-4 sticky top-0 z-20" style={{ backgroundColor: '#f0faf6' }}>
        <div className="max-w-lg mx-auto">
          {screen === "department" && !isSearching ? (
            <div className="flex items-center gap-3 mb-4">
              <button
                data-testid="button-back-dept"
                onClick={handleBack}
                className="inline-flex items-center gap-1 text-slate-600 font-semibold text-sm active:scale-95 transition-transform"
              >
                <ArrowLeft className="w-5 h-5" />
                Назад
              </button>
              <h1 className="text-lg font-extrabold text-slate-900 truncate">
                {selectedDeptName}
              </h1>
            </div>
          ) : (
            <h1 className="text-xl font-extrabold text-slate-900 mb-4 text-center">
              Справочник КЛМ
            </h1>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              data-testid="input-search"
              type="text"
              placeholder="Поиск по фамилии или должности..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) {
                  setScreen("home");
                  setSelectedDeptId(null);
                }
              }}
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-[15px]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
            <p className="font-medium text-sm">Загрузка...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 text-red-600 p-5 rounded-2xl border border-red-100 text-center font-medium text-sm">
            Ошибка загрузки данных. Обновите страницу.
          </div>
        ) : isSearching ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                data-testid="button-back-search"
                onClick={handleBackToHome}
                className="inline-flex items-center gap-1 text-slate-600 font-semibold text-sm active:scale-95 transition-transform"
              >
                <ArrowLeft className="w-5 h-5" />
                Назад
              </button>
              <span className="text-xs font-semibold text-slate-400">
                Найдено: {searchResults.length}
              </span>
            </div>
            <div className="space-y-3">
              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium text-sm">Ничего не найдено</p>
                </div>
              ) : (
                searchResults.map((emp, idx) => (
                  <EmployeeCard
                    key={emp.id}
                    employee={emp}
                    index={idx}
                    onClick={() => handleEmployeeClick(emp)}
                  />
                ))
              )}
            </div>
          </div>
        ) : screen === "home" ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="honeycomb"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HoneycombGrid
                departments={departments}
                colors={DEPT_COLORS}
                fallbackColor={FALLBACK_COLOR}
                onDeptClick={handleDeptClick}
              />
            </motion.div>
          </AnimatePresence>
        ) : screen === "department" ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="dept-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {deptEmployees.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="font-medium text-sm">Нет сотрудников в этом отделе</p>
                </div>
              ) : (
                deptEmployees.map((emp, idx) => (
                  <EmployeeCard
                    key={emp.id}
                    employee={emp}
                    index={idx}
                    onClick={() => handleEmployeeClick(emp)}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>
    </div>
  );
}

function HoneycombGrid({
  departments,
  colors,
  fallbackColor,
  onDeptClick,
}: {
  departments: { id: string; name: string }[];
  colors: Record<string, string>;
  fallbackColor: string;
  onDeptClick: (id: string) => void;
}) {
  const sorted = [...departments].sort((a, b) => Number(a.id) - Number(b.id));

  const top = sorted.slice(0, 1);
  const mid1 = sorted.slice(1, 4);
  const mid2 = sorted.slice(4, 7);
  const bottom = sorted.slice(7, 8);

  return (
    <div className="flex flex-col items-center py-2">
      <div className="flex justify-center gap-[2px]">
        {top.map((dept, i) => (
          <Hexagon
            key={dept.id}
            label={dept.name}
            color={colors[dept.id] || fallbackColor}
            onClick={() => onDeptClick(dept.id)}
            delay={i}
          />
        ))}
      </div>
      <div className="flex justify-center gap-[2px]" style={{ marginTop: "min(-3.5vw, -14px)" }}>
        {mid1.map((dept, i) => (
          <Hexagon
            key={dept.id}
            label={dept.name}
            color={colors[dept.id] || fallbackColor}
            onClick={() => onDeptClick(dept.id)}
            delay={i + 1}
          />
        ))}
      </div>
      <div className="flex justify-center gap-[2px]" style={{ marginTop: "min(-3.5vw, -14px)" }}>
        {mid2.map((dept, i) => (
          <Hexagon
            key={dept.id}
            label={dept.name}
            color={colors[dept.id] || fallbackColor}
            onClick={() => onDeptClick(dept.id)}
            delay={i + 4}
          />
        ))}
      </div>
      <div className="flex justify-center gap-[2px]" style={{ marginTop: "min(-3.5vw, -14px)" }}>
        {bottom.map((dept, i) => (
          <Hexagon
            key={dept.id}
            label={dept.name}
            color={colors[dept.id] || fallbackColor}
            onClick={() => onDeptClick(dept.id)}
            delay={i + 7}
          />
        ))}
      </div>
    </div>
  );
}
