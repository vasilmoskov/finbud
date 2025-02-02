import { DocumentDto } from "./DocumentDto";

export interface Transaction {
    id?: string,
    amount: number;
    currency: string;
    category: string;
    date?: string;
    document: DocumentDto | null;
    unusual: boolean;
}