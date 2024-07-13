import {
    ConfirmDialog,
    Grid,
    GridColumn,
    GridSelectionColumn,
    HorizontalLayout,
    Icon,
    VerticalLayout
} from "@vaadin/react-components";
import {Avatar} from "@vaadin/react-components/Avatar.js";
import React, {useEffect, useState} from "react";
import IncomeEntity from "Frontend/generated/com/example/application/data/IncomeEntity";
import {getAll, deleteIncome} from "Frontend/generated/IncomeServiceImpl";
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import {Button} from "@vaadin/react-components/Button.js";

export const config: ViewConfig = {
    menu: {order: 2, icon: 'line-awesome/svg/file.svg'},
    title: 'Incomes',
    loginRequired: true,
};

const amountRenderer = (income: IncomeEntity) => (
    <span
        {...({
            theme: `badge ${income.amount >= 1000 ? 'success' : 'error'}`,
        } satisfies object)}
    >
        {income.amount.toFixed(2)} $
         </span>
);

const buttonRenderer = (income: IncomeEntity, onDelete: (income: IncomeEntity) => void) => (
    <Button theme="icon" onClick={() => onDelete(income)}>
        <Icon icon="vaadin:trash"/>
    </Button>
);

export default function IncomeView() {
    const gridRef = React.useRef<any>(null);
    const [incomes, setIncomes] = useState<IncomeEntity[]>([]);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<IncomeEntity | null>(null);

    const handleDelete = (income: IncomeEntity) => {
        setSelectedIncome(income);
        setDialogOpened(true);
    };

    const confirmDelete = () => {
        if (selectedIncome) {
            const previousIncomes = [...incomes];
            const updatedIncomes = incomes.filter(i => i.id !== selectedIncome.id);
            setIncomes(updatedIncomes);
            deleteIncome(selectedIncome.id).catch(() => setIncomes(previousIncomes));

            setSelectedIncome(null);
            setDialogOpened(false);
        }
    };

    useEffect(() => {
        getAll().then((incomes) => {
            setIncomes(incomes)
        });

        // Workaround for https://github.com/vaadin/react-components/issues/129
        setTimeout(() => {
            gridRef.current?.recalculateColumnWidths();
        }, 100);
    }, []);

    return (
        <>
            <Grid items={incomes} ref={gridRef}>
                <GridSelectionColumn/>

                <GridColumn header="Amount" autoWidth>
                    {({item}) => amountRenderer(item)}
                </GridColumn>

                <GridColumn header="Date" autoWidth>
                    {({item}) => item.date}
                </GridColumn>

                <GridColumn header="Category" autoWidth>
                    {({item}) => item.category}
                </GridColumn>

                <GridColumn autoWidth>
                    {({item}) => buttonRenderer(item, handleDelete)}
                </GridColumn>
            </Grid>

            <ConfirmDialog
                header="Confirm Delete"
                cancelButtonVisible
                confirmText="Delete"
                opened={dialogOpened}
                onConfirm={confirmDelete}
                onCancel={() => setDialogOpened(false)}
            >
                Are you sure you want to delete this income?
            </ConfirmDialog>
        </>
    );
}