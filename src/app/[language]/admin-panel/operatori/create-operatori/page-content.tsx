"use client";

import { useSnackbar } from "@/hooks/use-snackbar";
import { usePatchUserService } from "@/services/api/services/users";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { Operatori } from "@/services/api/types/operatori";
import { User } from "@/services/api/types/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import EditOperatori from "../edit-operatori";

// type OperatoriKeys = keyof Operatori;

export type EditOperatoreFormData = {
  operatori?: Operatori | null | undefined;
};

// const useValidationEditUserSchema = () => {
//   return yup.object().shape({
//     operatori: yup.object<Operatori | null | undefined>().notRequired(),
//   });
// };

export default function FormCreateEdit(props: { user: User }) {
  const { user } = props;
  const [operatori] = useState(user.operatori);

  // const router = useRouter();
  // const fetchPostArticoliCostiCf = usePatchArticoliCostiCfService();
  // const { t } = useTranslation("admin-panel-users-create");
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

  // const { handleSubmit, setError, reset } = methods;

  const fetchPatchUser = usePatchUserService();

  const onChange = async (operatori: Operatori) => {
    const { status } = await fetchPatchUser({
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
        <EditOperatori join={false} onSubmit={onChange} />
      </form>
    </FormProvider>
  );
}
