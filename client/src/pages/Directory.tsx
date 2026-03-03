import { useState, useMemo } from "react";
import { Search, ArrowLeft, Users, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEmployees } from "@/hooks/use-employees";
import { Hexagon } from "@/components/Hexagon";
import { EmployeeCard } from "@/components/EmployeeCard";

const DEPARTMENTS = [
  { name: 'Администрация', color: '#1e3a8a' }, // Deep Blue
  { name: 'ВЭД', color: '#10b981' },           // Emerald
  { name: 'Ветпрепараты', color: '#fb7185' },  // Rose
  { name: 'Агропродукты', color: '#84cc16' },  // Lime
  { name: 'Сырье', color: '#4338ca' },         // Indigo
  { name: 'Кадры', color: '#60a5fa' },         // Blue
  { name: 'Финансы', color: '#eab308' },       // Yellow
  { name: 'Хоз. служба', color: '#8b5cf6' },   // Violet
];

export default function Directory() {
  const { data: employees, isLoading, isError } = useEmployees();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const isFiltered = searchQuery.length > 0 || selectedDept !== null;

  // Filter logic
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    
    return employees.filter(emp => {
      // Filter by department if selected
      if (selectedDept && emp.department !== selectedDept) {
        return false;
      }
      
      // Filter by search query if typed
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        return (
          emp.name.toLowerCase().includes(q) || 
          emp.position.toLowerCase().includes(q)
        );
      }
      
      return true;
    });
  }, [employees, searchQuery, selectedDept]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedDept(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-100 pt-10 pb-6 px-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              KLM Directory
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent text-slate-900 rounded-2xl shadow-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
          {!isFiltered ? (
            <motion.div 
              key="hexagons"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
              className="mb-12 overflow-hidden"
            >
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 text-center">
                Browse by Department
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-4 justify-items-center">
                {DEPARTMENTS.map((dept, idx) => (
                  <Hexagon 
                    key={dept.name}
                    label={dept.name}
                    color={dept.color}
                    onClick={() => setSelectedDept(dept.name)}
                    delay={idx}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="back-btn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              className="mb-6 flex items-center justify-between"
            >
              <button 
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад к сотам
              </button>
              
              <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                Found: <span className="text-slate-900 font-bold">{filteredEmployees.length}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
              <p className="font-medium">Loading directory...</p>
            </div>
          ) : isError ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center font-medium">
              Failed to load employees. Please try refreshing the page.
            </div>
          ) : filteredEmployees.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white border border-slate-100 border-dashed p-12 rounded-3xl text-center shadow-sm"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No employees found</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
              <button 
                onClick={handleClearFilters}
                className="mt-6 text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-4"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            filteredEmployees.map((emp, idx) => (
              <EmployeeCard key={emp.id} employee={emp} index={idx} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
