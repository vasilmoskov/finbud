export interface IncomeDto {
    id?: string,
    amount: number;
    currency: string;
    category: string;
    date?: string;
    document?: string;
    unusual: boolean;
}