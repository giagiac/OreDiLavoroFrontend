"use client";

import { useSnackbar } from "@/hooks/use-snackbar";
import { usePatchUserService } from "@/services/api/services/users";
import { Cf } from "@/services/api/types/cf";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { User } from "@/services/api/types/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import EditCf from "../edit-cf-origin-default";

// type CfKeys = keyof Cf;

export type EditCfFormData = {
  cf?: Pick<Cf, "COD_CF"> | null | undefined;
};

export default function FormCreateEdit(props: { user: User }) {
  const { user } = props;
  const [cf] = useState(user.cfOriginDefault);

  // const router = useRouter();
  // const fetchPostArticoliCostiCf = usePatchArticoliCostiCfService();
  // const { t } = useTranslation("admin-panel-users-create");
  // const validationSchema = useValidationEditUserSchema();

  const { enqueueSnackbar } = useSnackbar();

  const validationSchema: yup.ObjectSchema<EditCfFormData> = yup
    .object()
    .shape({
      cf: yup.object().shape({
        COD_CF: yup.string().required("COD_CF è obbligatorio"),
      }),
    });

  const methods = useForm<EditCfFormData>({
    resolver: yupResolver(validationSchema), // yupResolver(validationSchema),
    defaultValues: {
      cf: cf,
    },
  });

  // const { handleSubmit, setError, reset } = methods;

  const fetchPatchUser = usePatchUserService();

  const onChange = async (cf: Cf | null) => {
    if (cf !== null) {
      const { status } = await fetchPatchUser({
        id: user.id,
        data: {
          CF_ORIGIN_DEFAULT: cf.COD_CF,
        },
      });
      if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        enqueueSnackbar("Impossibile salvare", {
          variant: "error",
        });
      }
      if (status === HTTP_CODES_ENUM.OK) {
        enqueueSnackbar("Cliente aggiornato", {
          variant: "success",
        });
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form>
        <EditCf onSubmit={onChange} />
      </form>
    </FormProvider>
  );
}
