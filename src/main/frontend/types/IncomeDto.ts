import { DocumentDto } from "./DocumentDto";

export interface IncomeDto {
    id?: string,
    amount: number;
    currency: string;
    category: string;
    date?: string;
    document: DocumentDto | null;
    unusual: boolean;
}