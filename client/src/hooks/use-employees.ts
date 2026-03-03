import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useDirectoryData() {
  return useQuery({
    queryKey: [api.employees.list.path],
    queryFn: async () => {
      const res = await fetch(api.employees.list.path, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      return api.employees.list.responses[200].parse(data);
    },
  });
}
