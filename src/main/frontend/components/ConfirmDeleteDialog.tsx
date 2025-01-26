import { ConfirmDialog } from "@vaadin/react-components";

interface Props {
    opened: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDeleteDialog({opened, onConfirm, onCancel}: Props) {
    return (
        <ConfirmDialog
            header="Confirm Delete"
            cancelButtonVisible
            confirmText="Delete"
            opened={opened}
            onConfirm={onConfirm}
            onCancel={onCancel}
        >
            Are you sure you want to delete this income?
        </ConfirmDialog>
    );
}