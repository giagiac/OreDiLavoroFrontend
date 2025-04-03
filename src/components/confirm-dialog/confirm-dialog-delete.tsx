"use client";

import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useSnackbar } from "@/hooks/use-snackbar";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";

export function ButtonDeleteConfirm<T>({
  item,
  refetch,
  useDeleteService,
  confirmTitle,
  confirmMessage,
  successMessage,
}: {
  item: T;
  refetch: () => void;
  useDeleteService: () => (params: { id: string }) => Promise<void>;
  confirmTitle: string;
  confirmMessage: string;
  successMessage: string;
}) {
  const { enqueueSnackbar } = useSnackbar();

  const fetchDeleteService = useDeleteService();

  const { confirmDialog } = useConfirmDialog();

  const handleDelete = async (item: T & { id: string }) => {
    const isConfirmed = await confirmDialog({
      title: confirmTitle,
      message: confirmMessage,
    });

    if (isConfirmed) {
      await fetchDeleteService({
        id: item.id,
      });
      enqueueSnackbar(successMessage, {
        variant: "success",
      });
      refetch();
    }
  };

  return (
    <Button
      onClick={() => {
        handleDelete(item as any);
      }}
    >
      <ClearIcon />
    </Button>
  );
}
