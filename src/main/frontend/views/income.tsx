import {Grid, GridColumn, GridSelectionColumn, HorizontalLayout, Icon, VerticalLayout} from "@vaadin/react-components";
import {Avatar} from "@vaadin/react-components/Avatar.js";
import React, {useEffect, useState} from "react";
import Income from "Frontend/generated/com/example/application/data/Income";
import {getAll} from "Frontend/generated/IncomeService";
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";

const amountRenderer = (income: Income) => (
        <span
            {...({
                theme: `badge ${income.amount >= 1000 ? 'success' : 'error'}`,
            } satisfies object)}
        >
        {income.amount.toFixed(2)} $
         </span>
);

export const config: ViewConfig = {
    menu: {order: 2, icon: 'line-awesome/svg/file.svg'},
    title: 'Income',
    loginRequired: true,
};

export default function IncomeView() {
    const gridRef = React.useRef<any>(null);
    const [incomes, setIncomes] = useState<Income[]>([]);
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

        </Grid>
    );
}