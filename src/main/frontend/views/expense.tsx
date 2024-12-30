import { ViewConfig } from '@vaadin/hilla-file-router/types.js';

export const config: ViewConfig = {
  menu: { order: 2, icon: 'line-awesome/svg/file.svg' },
  title: 'Expenses',
  loginRequired: true,
};

export default function ExpenseView() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-l text-center box-border">
      <img style={{ width: '200px' }} src="images/empty-plant.png" />
      <h2>This place is planed for expenses view</h2>
    </div>
  );
}
