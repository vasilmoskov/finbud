import { ViewConfig } from '@vaadin/hilla-file-router/types.js';

export const config: ViewConfig = {
  menu: { order: 0, icon: 'line-awesome/svg/globe-solid.svg' },
  title: 'Dashboards',
  loginRequired: true,
};

export default function DashboardsView() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-l text-center box-border">
      <img style={{ width: '200px' }} src="images/empty-plant.png" />
      <h2>Vizualize Dashboards with Incomes and Expenses</h2>
    </div>
  );
}
