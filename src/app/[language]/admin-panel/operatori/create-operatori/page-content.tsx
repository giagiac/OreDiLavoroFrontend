"use client";

import FormSelectExtendedInput from "@/components/form/select-extended/form-select-extended";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePatchArticoliCostiCfService } from "@/services/api/services/articoli-costi-cf";
import {
  ArticoliCostiCf,
  TipoCosto,
} from "@/services/api/types/articoli-costi-cf";
import { Cf } from "@/services/api/types/cf";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { Operatori } from "@/services/api/types/operatori";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";
import EditOperatori from "../edit-operatori";
import { useGetOperatoriQuery } from "../quieries/queries-operatori";
import { usePatchOperatoriService } from "@/services/api/services/operatori";
import { usePatchUserService } from "@/services/api/services/users";
import { User } from "@/services/api/types/user";
import { EditUserFormData } from "../../users/edit/[id]/page-content";

type OperatoriKeys = keyof Operatori;

export type EditOperatoreFormData = {
  operatori?: Operatori | null | undefined;
};

const useValidationEditUserSchema = () => {
  return yup.object().shape({
    operatori: yup.object<Operatori | null | undefined>().notRequired(),
  });
};

export default function FormCreateEdit(props: { user: User }) {
  const { user } = props;
  const [operatori, setOperatori] = useState(user.operatori);

  // const router = useRouter();
  const fetchPostArticoliCostiCf = usePatchArticoliCostiCfService();
  const { t } = useTranslation("admin-panel-users-create");
  // const validationSchema = useValidationEditUserSchema();

  const { enqueueSnackbar } = useSnackbar();

  const validationSchema: yup.ObjectSchema<EditOperatoreFormData> = yup
    .object()
    .shape({
      operatori: yup.object().shape({
        COD_OP: yup.string().required("COD_OP è obbligatorio"),
        NOME_OP: yup.string().required("NOME_OP è obbligatorio"),
      }),
    });

  const methods = useForm<EditOperatoreFormData>({
    resolver: yupResolver(validationSchema), // yupResolver(validationSchema),
    defaultValues: {
      operatori: operatori,
    },
  });

  const { handleSubmit, setError, reset } = methods;

  const fetchPatchUser = usePatchUserService();

  const onChange = async (operatori: Operatori) => {
    const { data, status } = await fetchPatchUser({
      id: user.id,
      data: {
        COD_OP: operatori.COD_OP,
      },
    });
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      enqueueSnackbar("Impossibile salvare", {
        variant: "error",
      });
    }
    if (status === HTTP_CODES_ENUM.OK) {
      enqueueSnackbar("Operatore impostato", {
        variant: "success",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form>
        <EditOperatori onSubmit={onChange} />
      </form>
    </FormProvider>
  );
}
