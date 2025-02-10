import { Button, Icon } from "@vaadin/react-components";
import TransactionDto from "Frontend/generated/com/example/application/dto/TransactionDto";

interface Props {
  transaction: TransactionDto;
  onEdit: (transaction: TransactionDto) => void;
  onDelete: (transaction: TransactionDto) => void;
  visualizeDocument: (document: string) => void;
  onRemoveDocument: (transaction: TransactionDto) => void;
}

export default function TransactionButtonRenderer({ transaction, onEdit, onDelete, visualizeDocument, onRemoveDocument }: Props) {
  return (
    <div>
      <Button title='Edit' theme="icon" onClick={() => onEdit(transaction)}>
        <Icon icon="vaadin:edit" />
      </Button>
      <Button title='Delete' theme="icon" onClick={() => onDelete(transaction)}>
        <Icon icon="vaadin:trash" />
      </Button>
      {transaction.document && (
        <>
          <Button title='View Document' theme="icon" onClick={() => visualizeDocument(transaction.document?.content!)}>
            <Icon icon="vaadin:file-text-o" />
          </Button>
          <Button title='Remove Document' theme="icon" onClick={() => onRemoveDocument(transaction)}>
            <Icon icon="vaadin:file-remove" />
          </Button>
        </>
      )}
    </div>
  );
}
