// import create from 'zustand';
// import { deleteIncome, getAll, addIncome } from "Frontend/generated/IncomeServiceImpl";
// import IncomeEntity from "Frontend/generated/com/example/application/data/IncomeEntity";
// import { format } from 'date-fns';
//
// interface IncomeDto {
//     id?: string,
//     amount: string;
//     category: string;
//     date?: string;
// }
// interface IncomeState {
//     incomes: IncomeDto[];
//     confirmDialogOpened: boolean;
//     addDialogOpened: boolean;
//     selectedIncome: IncomeDto | null;
//     newIncome: IncomeDto;
//     setIncomes: (incomes: IncomeDto[]) => void;
//     setConfirmDialogOpened: (opened: boolean) => void;
//     setAddDialogOpened: (opened: boolean) => void;
//     setSelectedIncome: (income: IncomeDto | null) => void;
//     setNewIncome: (income: IncomeDto) => void;
//     fetchIncomes: () => void;
//     handleEdit: (income: IncomeDto) => void;
//     handleDelete: (income: IncomeDto) => void;
//     confirmDelete: () => void;
//     addIncome: () => void;
// }
//
// export const useIncomeStore = create<IncomeState>((set, get) => ({
//     incomes: [],
//     confirmDialogOpened: false,
//     addDialogOpened: false,
//     selectedIncome: null,
//     newIncome: { id: '', amount: '', category: 'Other', date: '' },
//     setIncomes: (incomes) => set({ incomes }),
//     setConfirmDialogOpened: (opened) => set({ confirmDialogOpened: opened }),
//     setAddDialogOpened: (opened) => set({ addDialogOpened: opened }),
//     setSelectedIncome: (income) => set({ selectedIncome: income }),
//     setNewIncome: (income) => set({ newIncome: income }),
//
//     fetchIncomes: async () => {
//         const incomes = await getAll();
//         const mappedIncomes = incomes.map(mapIncomeEntityToDto);
//         set({ incomes: mappedIncomes });
//     },
//
//     handleEdit: (income) => {
//         set({
//             newIncome: {
//                 id: income.id || '',
//                 amount: income.amount,
//                 category: income.category,
//                 date: income.date || '',
//             },
//             addDialogOpened: true,
//         });
//     },
//
//     handleDelete: (income) => {
//         set({
//             selectedIncome: income,
//             confirmDialogOpened: true,
//         });
//     },
//
//     confirmDelete: async () => {
//         const { selectedIncome, incomes, setIncomes, setSelectedIncome, setConfirmDialogOpened } = get();
//         if (selectedIncome) {
//             const previousIncomes = [...incomes];
//             const updatedIncomes = incomes.filter(i => i.id !== selectedIncome.id);
//             setIncomes(updatedIncomes);
//             try {
//                 await deleteIncome(selectedIncome.id!);
//             } catch {
//                 setIncomes(previousIncomes);
//             }
//             setSelectedIncome(null);
//             setConfirmDialogOpened(false);
//         }
//     },
//
//     addIncome: async () => {
//         const { newIncome, incomes, setIncomes, setNewIncome, setAddDialogOpened } = get();
//         const income: IncomeDto = {
//             amount: newIncome.amount,
//             category: newIncome.category,
//             date: format(new Date(), "dd MMM yyyy HH:mm:ss"),
//         };
//
//         const previousIncomes = [...incomes];
//         setIncomes([...incomes, income]);
//         setNewIncome({ id: '', amount: '', category: 'Other', date: '' });
//         setAddDialogOpened(false);
//
//         try {
//             const savedIncome = await addIncome(newIncome.amount, newIncome.category.toUpperCase());
//             income.id = savedIncome.id;
//             setIncomes([...incomes, income]);
//         } catch {
//             setIncomes(previousIncomes);
//             setNewIncome({ amount: income.amount, category: income.category, date: income.date });
//             setAddDialogOpened(true);
//         }
//     }
// }));
//
// const mapIncomeEntityToDto = (income: IncomeEntity): IncomeDto => ({
//     id: income.id,
//     amount: income.amount + "",
//     category: formatCategory(income.category),
//     date: income.date ? format(new Date(income.date), "dd MMM yyyy HH:mm:ss") : ''
// });
//
// const categoriesMap: Record<string, string> = {
//     'SALARY': 'Salary',
//     'SAVINGS': 'Savings',
//     'DEPOSIT': 'Deposit',
//     'OTHER': 'Other'
// };
//
// const formatCategory = (category: string): string => categoriesMap[category] || category;
