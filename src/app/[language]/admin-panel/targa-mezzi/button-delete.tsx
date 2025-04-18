"use client";

import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useDeleteTargaMezziService } from "@/services/api/services/targa-mezzi";
import { TargaMezzi } from "@/services/api/types/targa-mezzi";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";

export function ButtonDelete({
  targaMezzi,
  refetch,
}: {
  targaMezzi: TargaMezzi;
  refetch: () => void;
}) {
  const { enqueueSnackbar } = useSnackbar();

  const fetchPostTargaMezzi = useDeleteTargaMezziService();

  const { confirmDialog } = useConfirmDialog();

  const handleDelete = async (targaMezzi: TargaMezzi) => {
    const isConfirmed = await confirmDialog({
      title: "Targa mezzo",
      message: "Vuoi confermare la cancellazione?",
    });

    if (isConfirmed) {
      await fetchPostTargaMezzi({
        id: targaMezzi.id,
      });
      enqueueSnackbar("Articolo rimosso", {
        variant: "success",
      });
      refetch();
    }
  };

  return (
    <Button
      onClick={() => {
        handleDelete(targaMezzi);
      }}
    >
      <ClearIcon />
    </Button>
  );
}
