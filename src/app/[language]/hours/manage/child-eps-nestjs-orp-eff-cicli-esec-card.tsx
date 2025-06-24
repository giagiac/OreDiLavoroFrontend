import TipoTrasfertaComponent from "@/components/tipo-trasferta";
import { TipoTrasfertaColors } from "@/constants/theme-colors";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { LinkOrpOrd } from "@/services/api/types/link-orp-ord";
import { RoleEnum } from "@/services/api/types/role";
import useAuth from "@/services/auth/use-auth";
import DeleteForeverTwoTone from "@mui/icons-material/DeleteForeverTwoTone";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import FileUploadTwoToneIcon from "@mui/icons-material/FileUploadTwoTone";
interface Props {
  epsNestjsOrpEffCicliEsec: EpsNestjsOrpEffCicliEsec;
  renderOrdCliTrasDialog: (
    linkOrpOrd: Array<LinkOrpOrd>
  ) => React.ReactNode | null;
  onDelete: (id: string) => void;
  onSendHG?: (id: string) => void;
}

export function ChildEpsNestjsOrpEffCicliEsecCard({
  epsNestjsOrpEffCicliEsec,
  renderOrdCliTrasDialog,
  onDelete,
  onSendHG,
}: Props) {
  const { user } = useAuth();
  const theme = useTheme();

  const color =
    theme.palette.mode === "dark"
      ? TipoTrasfertaColors[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA].dark
      : TipoTrasfertaColors[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA].light;

  return (
    <Fragment key={epsNestjsOrpEffCicliEsec.id}>
      <Grid
        key={epsNestjsOrpEffCicliEsec?.id}
        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
      >
        <Card
          sx={{
            height: "100%",
            padding: theme.spacing(1),
            borderRadius: 1,
            border: `1px solid`,
            borderColor: color.main,
          }}
        >
          <Grid container>
            <Grid size={{ xs: 12 }}>
              <TipoTrasfertaComponent
                tipotrasferta={epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA}
              >
                {epsNestjsOrpEffCicliEsec.HYPSERV_REQ2_COD_CHIAVE !== null ||
                epsNestjsOrpEffCicliEsec.APP_REQ3_HYPSERV_COD_CHIAVE !==
                  null ? (
                  <Icon>
                    <LockTwoToneIcon />
                  </Icon>
                ) : (
                  <Stack direction="row" textAlign="center" spacing={1}>
                    {user?.role?.id === RoleEnum.ADMIN && (
                      <Button
                        sx={{
                          backgroundColor: theme.palette.augmentColor({
                            color: {
                              main: color.main,
                            },
                            mainShade: 900,
                          }).main,
                          color: theme.palette.getContrastText(color.main),
                          "&:hover": {
                            backgroundColor: color.hover,
                          },
                        }}
                        onClick={() => {
                          if (onSendHG) {
                            onSendHG(epsNestjsOrpEffCicliEsec?.id);
                          }
                        }}
                        variant="contained"
                        endIcon={<FileUploadTwoToneIcon />}
                      >
                        HG
                      </Button>
                    )}
                    <Button
                      sx={{
                        backgroundColor: theme.palette.augmentColor({
                          color: {
                            main: color.main,
                          },
                          mainShade: 900,
                        }).main,
                        color: theme.palette.getContrastText(color.main),
                        "&:hover": {
                          backgroundColor: color.hover,
                        },
                      }}
                      onClick={() => {
                        onDelete(epsNestjsOrpEffCicliEsec?.id);
                      }}
                      variant="contained"
                      endIcon={<DeleteForeverTwoTone />}
                    >
                      {epsNestjsOrpEffCicliEsec?.id}
                    </Button>
                  </Stack>
                )}
              </TipoTrasfertaComponent>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1">
                {epsNestjsOrpEffCicliEsec?.orpEffCicli?.linkOrpOrd?.map(
                  (it) => it.ordCliRighe?.cf.RAG_SOC_CF
                )}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              {epsNestjsOrpEffCicliEsec?.orpEffCicli?.linkOrpOrd &&
                renderOrdCliTrasDialog(
                  epsNestjsOrpEffCicliEsec?.orpEffCicli.linkOrpOrd
                )}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption">
                {epsNestjsOrpEffCicliEsec?.DOC_RIGA_ID}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2">
                {epsNestjsOrpEffCicliEsec?.orpEffCicli?.orpEff.DES_PROD}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" textAlign="right">
                {epsNestjsOrpEffCicliEsec?.COD_ART !== null &&
                  `Targa mezzo : ${epsNestjsOrpEffCicliEsec?.artAna?.DES_ART} · ${epsNestjsOrpEffCicliEsec?.KM} Km`}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" textAlign="right">
                {epsNestjsOrpEffCicliEsec?.TEMPO_OPERATORE_SESSANTESIMI?.toString()}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      {epsNestjsOrpEffCicliEsec?.epsNestjsOrpEffCicliEsecChild?.map((child) => (
        <Grid key={child.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Card
            sx={(theme) => ({
              height: "100%",
              padding: theme.spacing(1),
              border: `1px solid`,
              borderColor: color.main,
            })}
          >
            <Grid container>
              <Grid size={{ xs: 12 }}>
                <TipoTrasfertaComponent
                  tipotrasferta={epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA}
                >
                  {child.HYPSERV_REQ2_COD_CHIAVE !== null ||
                  child.APP_REQ3_HYPSERV_COD_CHIAVE !== null ? (
                    <Icon>
                      <LockTwoToneIcon />
                    </Icon>
                  ) : (
                    <Stack direction="column" textAlign="center">
                      <Typography variant="caption">
                        {child?.id ?? ""}
                      </Typography>
                      <Typography variant="caption">[{child?.idfk}]</Typography>
                    </Stack>
                  )}
                </TipoTrasfertaComponent>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1">
                  {epsNestjsOrpEffCicliEsec?.orpEffCicli?.linkOrpOrd?.map(
                    (it) => it.ordCliRighe?.cf.RAG_SOC_CF
                  )}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                {epsNestjsOrpEffCicliEsec?.orpEffCicli?.linkOrpOrd &&
                  renderOrdCliTrasDialog(
                    epsNestjsOrpEffCicliEsec?.orpEffCicli.linkOrpOrd
                  )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption">
                  {epsNestjsOrpEffCicliEsec?.DOC_RIGA_ID}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2">
                  {epsNestjsOrpEffCicliEsec?.orpEffCicli?.orpEff.DES_PROD}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" textAlign="right">
                  {epsNestjsOrpEffCicliEsec?.COD_ART !== null &&
                    `Targa mezzo : ${epsNestjsOrpEffCicliEsec?.artAna?.DES_ART} · ${child?.KM} Km`}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h4" textAlign="right">
                  {child?.TEMPO_OPERATORE_SESSANTESIMI?.toString()}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      ))}
    </Fragment>
  );
}
