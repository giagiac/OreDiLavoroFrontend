"use client";

import { useSnackbar } from "@/hooks/use-snackbar";
import { useDeleteTargaMezziService } from "@/services/api/services/targa-mezzi";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { TargaMezzi } from "@/services/api/types/targa-mezzi";
import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export function ButtonDelete({
  targaMezzi,
  refetch
}: {
  targaMezzi: TargaMezzi;
  refetch: () => void;
}) {
  const { enqueueSnackbar } = useSnackbar();

  const schema = yup.object().shape({
    targaMezzi: yup.object().shape({
      COD_ART: yup.string().notRequired(),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      targaMezzi: {
        COD_ART: "",
      },
    },
  });

  const { handleSubmit, setError, reset } = methods;

  const fetchPostTargaMezzi = useDeleteTargaMezziService();

  const handleDelete = async (targaMezzi: TargaMezzi) => {
    const { status } = await fetchPostTargaMezzi({
      id: targaMezzi.id,
    });
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      setError("targaMezzi", {
        type: "manual",
        message: `Errore cancellazione dati...`,
      });
      return;
    }
    if (status === HTTP_CODES_ENUM.OK) {
      enqueueSnackbar("Articolo rimosso", {
        variant: "success",
      });
      refetch()
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
