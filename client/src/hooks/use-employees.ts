import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// Using the exact route contract provided in the manifest
export function useEmployees() {
  return useQuery({
    queryKey: [api.employees.list.path],
    queryFn: async () => {
      const res = await fetch(api.employees.list.path, { credentials: "include" });
      
      if (!res.ok) {
        throw new Error("Failed to fetch employees");
      }
      
      const data = await res.json();
      // Validate using the schema provided in routes manifest
      return api.employees.list.responses[200].parse(data);
    },
  });
}
