export interface Entry {
    date: string;
    id: string;
    title: string;
    pictureUrl: string;
    description: string;
}
export function toEntry(doc): Entry {
    return { id: doc.id, ...doc.data() };
}