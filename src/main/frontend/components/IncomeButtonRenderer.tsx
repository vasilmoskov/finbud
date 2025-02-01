import React from 'react';
import { Button, Icon } from "@vaadin/react-components";
import { IncomeDto } from 'Frontend/types/IncomeDto';

interface IncomeButtonRendererProps {
  income: IncomeDto;
  onEdit: (income: IncomeDto) => void;
  onDelete: (income: IncomeDto) => void;
  visualizeDocument: (document: string) => void;
  onRemoveDocument: (income: IncomeDto) => void;
}

const IncomeButtonRenderer: React.FC<IncomeButtonRendererProps> = ({ income, onEdit, onDelete, visualizeDocument, onRemoveDocument }) => (
  <div>
    <Button title='Edit' theme="icon" onClick={() => onEdit(income)}>
      <Icon icon="vaadin:edit" />
    </Button>
    <Button title='Delete' theme="icon" onClick={() => onDelete(income)}>
      <Icon icon="vaadin:trash" />
    </Button>
    {income.document && (
      <>
        <Button title='View Document' theme="icon" onClick={() => visualizeDocument(income.document?.content!)}>
          <Icon icon="vaadin:file-text-o" />
        </Button>
        <Button title='Remove Document' theme="icon" onClick={() => onRemoveDocument(income)}>
          <Icon icon="vaadin:file-remove" />
        </Button>
      </>
    )}
  </div>
);

export default IncomeButtonRenderer;