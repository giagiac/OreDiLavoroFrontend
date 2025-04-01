"use client";

import { NumericKeypad } from "@/components/numeric-keypad-ore";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePostUserService } from "@/services/api/services/users";
import { FileEntity } from "@/services/api/types/file-entity";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { OrpEffCicli } from "@/services/api/types/orp-eff-cicli";
import { Role, RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import CameraAltTwoToneIcon from "@mui/icons-material/CameraAltTwoTone";
import {
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid2";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";
import { useGetOrpEffCicliQuery } from "../../queries/queries-orp-eff-cicli";

type OrpEffCicliKeys = keyof OrpEffCicli;

type CreateFormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirmation: string;
  photo?: FileEntity;
  role: Role;
};

const useValidationSchema = () => {
  const { t } = useTranslation("admin-panel-users-create");

  return yup.object().shape({
    email: yup
      .string()
      .email(t("admin-panel-users-create:inputs.email.validation.invalid"))
      .required(
        t("admin-panel-users-create:inputs.firstName.validation.required")
      ),
    firstName: yup
      .string()
      .required(
        t("admin-panel-users-create:inputs.firstName.validation.required")
      ),
    lastName: yup
      .string()
      .required(
        t("admin-panel-users-create:inputs.lastName.validation.required")
      ),
    password: yup
      .string()
      .min(6, t("admin-panel-users-create:inputs.password.validation.min"))
      .required(
        t("admin-panel-users-create:inputs.password.validation.required")
      ),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t(
          "admin-panel-users-create:inputs.passwordConfirmation.validation.match"
        )
      )
      .required(
        t(
          "admin-panel-users-create:inputs.passwordConfirmation.validation.required"
        )
      ),
    role: yup
      .object()
      .shape({
        id: yup.mixed<string | number>().required(),
        name: yup.string(),
      })
      .required(t("admin-panel-users-create:inputs.role.validation.required")),
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

function FormCreateUser() {
  const params = useParams<{ type: string }>();
  const searchParams = useSearchParams();

  const type = params.type;

  const router = useRouter();
  const fetchPostUser = usePostUserService();
  const { t } = useTranslation("admin-panel-users-create");
  const validationSchema = useValidationSchema();

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<CreateFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      passwordConfirmation: "",
      role: {
        id: RoleEnum.USER,
      },
      photo: undefined,
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPostUser(formData);
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
      router.push("/admin-panel/users");
    }
  });

  let prepareLink = "/hours/manage/start";
  let prepareText = "In sede";
  let buttonColor: "primary" | "secondary" | "info" = "secondary"; // Customizable button color

  switch (type) {
    case "in_giornata":
      prepareLink = "/hours/manage/step1_FuoriSede";
      prepareText = "In giornata";
      buttonColor = "primary";
      break;
    case "in_giornata_dopo_21":
      prepareLink = "/hours/manage/step1_FuoriSede";
      prepareText = "In giornata dopo le 21:00";
      buttonColor = "primary";
      break;
    case "fuori_sede_andata":
      prepareText = "Fuori sede andata";
      prepareLink = "/hours/manage/step2_FuoriSede";
      buttonColor = "primary";
      break;
    case "fuori_sede_ritorno":
      prepareText = "Fuori sede ritorno";
      prepareLink = "/hours/manage/step2_FuoriSede";
      buttonColor = "primary";
      break;
    case "ancora_in_missione_5":
      prepareText = "Ancora in missione 5 Km";
      prepareLink = "/hours/manage/step2_FuoriSede";
      buttonColor = "primary";
      break;
    case "ancora_in_missione_10":
      prepareText = "Ancora in missione 10 Km";
      prepareLink = "/hours/manage/step2_FuoriSede";
      buttonColor = "primary";
      break;
    case "ancora_in_missione_15":
      prepareText = "Ancora in missione 15 Km";
      prepareLink = "/hours/manage/step2_FuoriSede";
      buttonColor = "primary";
      break;
    case "ancora_in_missione_20":
      prepareText = "Ancora in missione 20 Km";
      prepareLink = "/hours/manage/step2_FuoriSede";
      buttonColor = "primary";
      break;
    case "step1_KmAutista":
      prepareText = "Km Autista";
      prepareLink = "/hours/manage/step1_KmAutista";
      buttonColor = "info";
      break;
  }

  const [codiceBreveValue, setCodiceBreve] = useState("2414014-1");
  const [multipleScannerDetected, setMultipleScannerDetected] =
    useState<String | null>(null);

  const handleCustomInputChange = (event: any) => {
    const target = event.target as HTMLInputElement;

    if (event.key === "Enter") {
      // Logica per gestire l'invio a capo
      console.log("Invio a capo rilevato:", target.value);
      setFilters([
        {
          columnName: "CODICE_BREVE",
          value: target.value,
          id: Math.random(),
        },
      ]);
      return;
    }

    setCodiceBreve(target.value);
  };

  const [isScannerOpen, setScannerOpen] = useState(false);

  const handleOpenScanner = () => setScannerOpen(true);
  const handleCloseScanner = () => setScannerOpen(false);

  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: OrpEffCicliKeys;
  }>({ order: SortEnum.ASC, orderBy: "DOC_RIGA_ID" });

  const [filters, setFilters] = useState<Array<FilterItem<OrpEffCicli>>>([
    { columnName: "CODICE_BREVE", value: codiceBreveValue, id: Math.random() },
  ]);

  const [othersFilters, setOthersFilters] = useState<Array<OthersFiltersItem>>(
    []
  );

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isFetched } =
    useGetOrpEffCicliQuery({
      sort: { order, orderBy },
      filters,
      othersFilters,
    });

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as OrpEffCicli[]) ??
      ([] as OrpEffCicli[]);

    return removeDuplicatesFromArrayObjects(result, "DOC_RIGA_ID");
  }, [data, filters]);

  const kmAutista = () => {
    const COD_ART = searchParams.get("COD_ART");
    const KM = searchParams.get("KM");
  };

  return (
    <FormProvider {...methods}>
      <Container maxWidth="md">
        <form onSubmit={onSubmit} autoComplete="create-new-user">
          <Grid
            container
            spacing={2}
            mb={3}
            mt={3}
            justifyContent="center"
            alignItems="center"
          >
            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                size="large"
                style={{ height: 50, fontSize: "1.5rem" }}
                color={buttonColor} // Use customizable button color
                onClick={() => {
                  router.push(prepareLink);
                }}
                startIcon={<ArrowBackTwoToneIcon />}
              >
                {prepareText}
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid size={{ xs: 12 }}>
              <FormControl sx={{}} variant="outlined" fullWidth>
                <InputLabel htmlFor="filled-adornment-codce-breve">
                  Codice Breve
                </InputLabel>
                <FilledInput
                  id="filled-adornment-codce-breve"
                  value={codiceBreveValue}
                  onChange={(e) => handleCustomInputChange(e)} // Passa esplicitamente l'evento
                  onKeyDown={(e) => handleCustomInputChange(e)} // Passa esplicitamente l'evento
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleOpenScanner}>
                        <CameraAltTwoToneIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Dialog
                open={isScannerOpen}
                onClose={handleCloseScanner}
                fullWidth
              >
                <DialogContent>
                  <Scanner
                    onScan={(result) => {
                      if (result.length == 1) {
                        setCodiceBreve(result[0].rawValue);
                        setFilters([
                          {
                            columnName: "CODICE_BREVE",
                            value: result[0].rawValue,
                            id: Math.random()
                          },
                        ]);
                        handleCloseScanner();
                        setMultipleScannerDetected(null);
                      } else if (result.length > 1) {
                        {
                          setMultipleScannerDetected(
                            result.map((item) => item.rawValue).join(", ")
                          );
                        }
                      }
                    }}
                  />
                  <Typography
                    variant="h6"
                    align="center"
                    gutterBottom
                    sx={{ mt: 2 }}
                  >
                    {multipleScannerDetected}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseScanner} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            {isFetched && (
              <>
                {result.length == 0 && (
                  <Grid size={{ xs: 12 }} textAlign="center">
                    <Typography variant="h3" color="error">
                      Nessuna commessa trovata
                    </Typography>
                  </Grid>
                )}
                {result.length > 0 &&
                  result[0].orpEff != null &&
                  result[0].orpEff.STATUS == 2 && (
                    <Grid size={{ xs: 12 }} textAlign="center">
                      <Typography variant="h3" color="error">
                        Commessa chiusa
                      </Typography>
                    </Grid>
                  )}
                {/* DETTAGLIO COMMESSE - possono essere liste - ma improbabile */}
                {result.length > 0 &&
                  result[0].orpEff != null &&
                  result[0].orpEff.STATUS != 2 &&
                  result.map((item) => (
                    <Grid size={{ xs: 12 }} key={item.DOC_RIGA_ID}>
                      <Typography variant="h4" gutterBottom textAlign="center">
                        {item?.DOC_ID} · {item?.orpEff?.COD_ART}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        textAlign="center"
                      >
                        {item?.orpEff?.DES_PROD}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        textAlign="center"
                      >
                        {item?.DES_CICLO?.replace(
                          item?.orpEff?.DES_PROD || "",
                          ""
                        )}
                      </Typography>
                      <NumericKeypad
                        onNumberChange={(value) => {
                          // setTempoOreOperatore(value);
                        }}
                      />
                      <Button
                        style={{
                          width: "100%",
                          height: 50,
                          fontSize: "1.5rem",
                        }}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          router.push(`/hours/manage`);
                        }}
                      >
                        CONFERMA
                      </Button>
                    </Grid>
                  ))}
              </>
            )}
            {/* COMMESSA CHIUSA... */}
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

function CreateUser() {
  return <FormCreateUser />;
}

export default withPageRequiredAuth(CreateUser);
