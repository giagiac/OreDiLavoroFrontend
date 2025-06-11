"use client";

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import ForwardTwoToneIcon from "@mui/icons-material/ForwardTwoTone";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { useRouter, useSearchParams } from "next/navigation";
import { OperatoreSelected } from "../../manage/opertore-selected";
import TargaMezziTable from "../targa-mezzi-table";

function FormCreateUser() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const COD_OP = searchParams.get("COD_OP");

  // const [userSelected, setUserSelected] = useState<User | null>();
  // const fetchGetMe = useGetMeQuery();
  // useMemo(() => {
  //   const fetchUser = async () => {
  //     if (COD_OP) {
  //       const { data, status } = await fetchGetMe({
  //         COD_OP,
  //       });
  //       if (status === HTTP_CODES_ENUM.OK) {
  //         setUserSelected(data as User);
  //       }
  //     }
  //   };
  //   fetchUser();
  // }, []);

  return (
    <Container maxWidth="md" sx={{ m: 0, p: 1 }}>
      <Grid container>
        <Grid textAlign="right" size={12} mb={1}>
          <OperatoreSelected text="seleziona la targa!" />
        </Grid>
        <Grid size={12}>
          <Grid container>
            <Grid size={{ xs: 12 }} mb={5}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="not_defined"
                label="Fuori sede"
                onClickAction={() => router.back()}
                startIcon={<ArrowBackTwoToneIcon />}
                endIcon={<FlightTakeoffTwoToneIcon />}
              />
            </Grid>
            {/* <Grid size={12}>
              <Grid container justifyContent="center" alignItems="center">
                <Grid size={{ xs: 12 }}>
                  <NumericKeypadKm
                    onChange={(value) => {
                      setKm(value);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid> */}
            <Grid size={12} pt={3}>
              <TargaMezziTable
                childrenCallBack={(COD_ART) => (
                  <ButtonTipoTrasferta
                    tipoTrasfertaButton="fuori_sede_button"
                    onClickAction={async () => {
                      router.push(
                        `step2_FuoriSede?COD_ART=${COD_ART}&KM=${0}&COD_OP=${COD_OP}`
                      );
                    }}
                    icon={<ForwardTwoToneIcon />}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

function CreateUser() {
  return <FormCreateUser />;
}

export default withPageRequiredAuth(CreateUser, {
  roles: [RoleEnum.ADMIN, RoleEnum.AUTISTA, RoleEnum.USER, RoleEnum.BADGE],
});
