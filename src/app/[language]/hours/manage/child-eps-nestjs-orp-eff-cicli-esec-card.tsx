import TipoTrasfertaComponent from "@/components/tipo-trasferta";
import { TipoTrasfertaColors } from "@/constants/theme-colors";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { LinkOrpOrd } from "@/services/api/types/link-orp-ord";
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

interface Props {
  epsNestjsOrpEffCicliEsec: EpsNestjsOrpEffCicliEsec;
  renderOrdCliTrasDialog: (
    linkOrpOrd: Array<LinkOrpOrd>
  ) => React.ReactNode | null;
  onDelete: (id: string) => void;
}

export function ChildEpsNestjsOrpEffCicliEsecCard({
  epsNestjsOrpEffCicliEsec,
  renderOrdCliTrasDialog,
  onDelete,
}: Props) {
  const theme = useTheme();

  const color =
    theme.palette.mode === "dark"
      ? TipoTrasfertaColors[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA].dark
      : TipoTrasfertaColors[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA].light;

  return (
    <Fragment key={epsNestjsOrpEffCicliEsec.id}>
      <Grid key={epsNestjsOrpEffCicliEsec?.id}>
        <Card
          sx={{
            minWidth: 300,
            maxWidth: 360,
            minHeight: "100%",
            padding: theme.spacing(1),
            borderRadius: 1,
            border: `1px solid`,
            borderColor: color.main,
          }}
        >
          <Grid size={{ xs: 12 }}>
            <TipoTrasfertaComponent
              tipotrasferta={epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA}
            >
              {epsNestjsOrpEffCicliEsec.HYPSERV_REQ2_COD_CHIAVE !== null ||
              epsNestjsOrpEffCicliEsec.APP_REQ3_HYPSERV_COD_CHIAVE !== null ? (
                <Icon>
                  <LockTwoToneIcon />
                </Icon>
              ) : (
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
                `Targa mezzo : ${epsNestjsOrpEffCicliEsec?.COD_ART}${
                  epsNestjsOrpEffCicliEsec?.KM?.toString() !== "0"
                    ? ` · ${epsNestjsOrpEffCicliEsec?.KM} Km`
                    : ""
                }`}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h4" textAlign="right">
              {epsNestjsOrpEffCicliEsec?.TEMPO_OPERATORE_SESSANTESIMI?.toString()}
            </Typography>
          </Grid>
        </Card>
      </Grid>
      {epsNestjsOrpEffCicliEsec?.epsNestjsOrpEffCicliEsecChild?.map((child) => (
        <Grid key={child.id}>
          <Card
            sx={(theme) => ({
              minWidth: 300,
              maxWidth: 360,
              minHeight: "100%",
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
                  <Stack direction="column" textAlign="center">
                    <Typography variant="caption">{child?.id ?? ""}</Typography>
                    <Typography variant="caption">
                      {child?.idfk ?? ""}
                    </Typography>
                  </Stack>
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
                    `Targa mezzo : ${epsNestjsOrpEffCicliEsec?.COD_ART}${
                      epsNestjsOrpEffCicliEsec?.KM?.toString() !== "0"
                        ? ` · ${epsNestjsOrpEffCicliEsec?.KM} Km`
                        : ""
                    }`}
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
      ))}
    </Fragment>
  );
}
