import * as fs from 'fs';
import * as path from 'path';

export interface Record {
    id: number | string;
    name: string;
    email: string;
    phone: string;
    age: number | string;
    // Add more fields as needed
}

class CSVDatabase {
    private filePath: string;
    private headers = 'id,name,email,phone,age'; // CSV header

    constructor(filePath: string) {
        this.filePath = filePath;
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, this.headers + '\n', 'utf-8');
        }
    }

    private readData(): Record[] {
        const data: Record[] = [];
        const lines = fs.readFileSync(this.filePath, 'utf-8').split('\n');
        for (const line of lines.slice(1)) {
            const [id, name, email, phone, age] = line.split(',');
            data.push({ id, name, email, phone, age });
        }
        return data;
    }

    getAll(): Record[] {
        return this.readData();
    }

    findById(id: string): Record | undefined {
        const data = this.readData();
        return data.find((record) => record.id === id);
    }

    find(query: Partial<Record>): Record[] {
        const data = this.readData();
        const entries = Object.entries(query);
        return data.filter((record) => {
            return entries.every(([key, value]) => {
                return record[key as keyof Record] === value;
            });
        });
    }

    insert(record: Omit<Record, 'id'>) {
        const data = this.readData();
        const newRecord = { id: data.length + 1, ...record }
        data.push(newRecord);
        this.writeData(data);
        return { success: true, record: newRecord }
    }

    update(id: string, updatedFields: Partial<Record>) {
        const data = this.readData();
        const recordIndex = data.findIndex((record) => record.id === id);
        if (recordIndex !== -1) {
            data[recordIndex] = { ...data[recordIndex], ...updatedFields };
            this.writeData(data);
            return { success: true }
        } else {
            return { success: false, message: 'Record not found' }
        }
    }

    delete(id: string): void {
        const data = this.readData();
        const newData = data.filter((record) => record.id !== id);
        this.writeData(newData);
    }

    private writeData(data: Record[]): void {
        const lines: string[] = [];
        lines.push(this.headers); // CSV header
        data.forEach((record) => {
            lines.push(`${record.id},${record.name},${record.email},${record.phone},${record.age}`);
        });
        fs.writeFileSync(this.filePath, lines.join('\n'), 'utf-8');
    }
}

const db = new CSVDatabase('data.csv');
export default db;

// db.insert({ name: 'John Doe', email: 'affan@gmail.com', phone: '1234567890', age: 20 });