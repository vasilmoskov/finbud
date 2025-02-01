import { ConfirmDialog } from "@vaadin/react-components";

interface Props {
    message: string
    opened: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDeleteDialog({message, opened, onConfirm, onCancel}: Props) {
    return (
        <ConfirmDialog
            header="Confirm Delete"
            cancelButtonVisible
            confirmText="Delete"
            opened={opened}
            onConfirm={onConfirm}
            onCancel={onCancel}
        >
            {message}
        </ConfirmDialog>
    );
}