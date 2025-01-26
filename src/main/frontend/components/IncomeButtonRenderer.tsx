import React from 'react';
import { Button, Icon } from "@vaadin/react-components";
import { IncomeDto } from 'Frontend/types/IncomeDto';

interface IncomeButtonRendererProps {
  income: IncomeDto;
  onEdit: (income: IncomeDto) => void;
  onDelete: (income: IncomeDto) => void;
  visualizeDocument: (document: string) => void;
}

const IncomeButtonRenderer: React.FC<IncomeButtonRendererProps> = ({ income, onEdit, onDelete, visualizeDocument }) => (
  <div>
    {income.document && (
      <Button theme="icon" onClick={() => visualizeDocument(income.document!)}>
        <Icon icon="vaadin:file-text-o" />
      </Button>
    )}
    <Button theme="icon" onClick={() => onEdit(income)}>
      <Icon icon="vaadin:edit"/>
    </Button>
    <Button theme="icon" onClick={() => onDelete(income)}>
      <Icon icon="vaadin:trash"/>
    </Button>
  </div>
);

export default IncomeButtonRenderer;