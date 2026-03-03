import { type Employee } from "@shared/schema";

export interface IStorage {
  getEmployees(): Promise<Employee[]>;
}

export class MemStorage implements IStorage {
  async getEmployees(): Promise<Employee[]> {
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1nualyTma75WZ4eZlVuPEPMDqz94qmCx5blby-9tZCOU/export?format=csv';
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }
    const data = await response.text();
    
    // Parse CSV handling quotes if needed
    const rows = data.split('\n').slice(1);
    
    return rows.map((row, idx) => {
      // Basic CSV split that ignores commas inside quotes
      const cols = [];
      let inQuotes = false;
      let current = '';
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cols.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      cols.push(current);

      return {
        id: String(idx),
        name: cols[1]?.replace(/^"|"$/g, '').trim() || '',
        position: cols[2]?.replace(/^"|"$/g, '').trim() || '',
        department: cols[3]?.replace(/^"|"$/g, '').trim() || '',
        phone: cols[5]?.replace(/^"|"$/g, '').trim() || undefined,
        email: cols[6]?.replace(/^"|"$/g, '').trim() || undefined,
        photo: cols[8]?.replace(/^"|"$/g, '').trim() || 'https://via.placeholder.com/100',
      };
    }).filter(e => e.name && e.name.trim() !== '');
  }
}

export const storage = new MemStorage();
