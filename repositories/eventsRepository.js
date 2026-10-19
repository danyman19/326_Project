import { readFile, writeFile } from 'fs/promises';

const DATA_FILE = "events.json";
export const getAll = async() => {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
}

export const save = async (events) => {
    await writeFile(DATA_FILE, JSON.stringify(events, null, 2));
}