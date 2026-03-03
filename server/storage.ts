import { type Employee, type Department } from "@shared/schema";

export interface IStorage {
  getData(): Promise<{ employees: Employee[]; departments: Department[] }>;
}

function parseCSVRow(row: string): string[] {
  const cols: string[] = [];
  let inQuotes = false;
  let current = '';
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      cols.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  cols.push(current.trim());
  return cols;
}

export class MemStorage implements IStorage {
  private cache: { employees: Employee[]; departments: Department[] } | null = null;
  private cacheTime: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  async getData(): Promise<{ employees: Employee[]; departments: Department[] }> {
    if (this.cache && Date.now() - this.cacheTime < this.CACHE_TTL) {
      return this.cache;
    }

    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1nualyTma75WZ4eZlVuPEPMDqz94qmCx5blby-9tZCOU/export?format=csv';
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }
    const data = await response.text();
    const rows = data.split('\n').slice(1);

    const employees: Employee[] = [];
    const departments: Department[] = [];
    let inLegend = false;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.trim()) continue;

      const cols = parseCSVRow(row);

      if (cols[2] === 'Код отдела' && cols[3] === 'Наименование') {
        inLegend = true;
        continue;
      }

      if (inLegend) {
        const code = cols[2]?.trim();
        const name = cols[3]?.trim();
        if (code && name) {
          departments.push({ id: code, name });
        }
        continue;
      }

      const name = cols[0]?.trim();
      if (!name) continue;

      let photo = cols[10]?.trim() || undefined;
      if (photo && photo.includes('drive.google.com/file/d/')) {
        const match = photo.match(/\/d\/([^/]+)/);
        if (match) {
          photo = `https://lh3.googleusercontent.com/d/${match[1]}`;
        }
      }

      employees.push({
        id: String(i),
        name,
        position: cols[1]?.trim() || '',
        employeeCode: cols[2]?.trim() || '',
        supervisorCode: cols[3]?.trim() || '',
        departmentId: cols[4]?.trim() || '',
        workPhone: cols[5]?.trim() || undefined,
        personalPhone: cols[6]?.trim() || undefined,
        internalExt: cols[7]?.trim() || undefined,
        email: cols[8]?.trim() || undefined,
        birthday: cols[9]?.trim() || undefined,
        photo,
      });
    }

    this.cache = { employees, departments };
    this.cacheTime = Date.now();
    return this.cache;
  }
}

export const storage = new MemStorage();
