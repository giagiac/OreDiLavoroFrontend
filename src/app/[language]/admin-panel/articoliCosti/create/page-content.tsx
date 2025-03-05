"use client";

import FormTextInput from "@/components/form/text-input/form-text-input";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePatchArticoliCostiService } from "@/services/api/services/articoliCosti";
import { CfComm } from "@/services/api/types/cfComm";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";

type CreateFormData = {
  costo1?: number | undefined;
  costo2?: number | undefined;
};

const useValidationSchema = () => {
  // const { t } = useTranslation("admin-panel-users-create");

  return yup.object().shape({
    costo1: yup.number(),
    costo2: yup.number(),
  });
};

function CreateUserFormActions() {
  const { t } = useTranslation("admin-panel-users-create");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("admin-panel-users-create:actions.submit")}
    </Button>
  );
}

export default function FormCreateUser(cfComm: CfComm) {
  // const router = useRouter();
  const fetchPostUser = usePatchArticoliCostiService();
  const { t } = useTranslation("admin-panel-users-create");
  const validationSchema = useValidationSchema();

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<CreateFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      costo1: Number(cfComm?.articoliCosti?.costo1 || 0),
      costo2: Number(cfComm?.articoliCosti?.costo2?.toString() || 0),
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);
    const { data, status } = await fetchPostUser({
      CF_COMM_ID: cfComm.CF_COMM_ID,
      data: {
        costo1: formData.costo1?.toString(),
        costo2: formData.costo2?.toString(),
      },
    });
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof CreateFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `admin-panel-users-create:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar(t("admin-panel-users-create:alerts.user.success"), {
        variant: "success",
      });
      // router.push("/admin-panel/users");
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} autoComplete="create-new-user">
        <Grid container direction={"row"}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormTextInput<CreateFormData>
              name="costo1"
              testId="costo1"
              label={t("admin-panel-users-create:inputs.firstName.label")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <FormTextInput<CreateFormData>
              name="costo2"
              testId="costo2"
              label={t("admin-panel-users-create:inputs.lastName.label")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <CreateUserFormActions />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
