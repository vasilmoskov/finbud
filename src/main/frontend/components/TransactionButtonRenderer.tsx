import { Button } from "@vaadin/react-components";
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
        <i className="fa-solid fa-pen" style={{ marginLeft: '0.5rem' }}></i>
      </Button>
      <Button title='Delete' theme="icon" onClick={() => onDelete(transaction)}>
        <i className="fa-solid fa-trash" style={{ marginLeft: '0.5rem' }}></i>
      </Button>
      {transaction.document && (
        <>
          <Button title='View Document' theme="icon" onClick={() => visualizeDocument(transaction.document?.content!)}>
            <i className="fa-solid fa-file-image" style={{ marginLeft: '0.5rem' }}></i>
          </Button>
          <Button title='Remove Document' theme="icon" onClick={() => onRemoveDocument(transaction)}>
            <i className="fa-solid fa-file-circle-xmark" style={{ marginLeft: '0.5rem' }}></i>
          </Button>
        </>
      )}
    </div>
  );
}
