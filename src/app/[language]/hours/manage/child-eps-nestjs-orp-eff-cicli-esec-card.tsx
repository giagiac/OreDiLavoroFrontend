import TipoTrasfertaComponent, {
  backgroundColorsDark,
  backgroundColorsLight,
} from "@/components/tipo-trasferta";
import TipoTrasfertaLeftConnectComponent from "@/components/tipo-trasferta-left-connect";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { LinkOrpOrd } from "@/services/api/types/link-orp-ord";
import DeleteForeverTwoTone from "@mui/icons-material/DeleteForeverTwoTone";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Icon from "@mui/material/Icon";
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
  return (
    <Fragment key={epsNestjsOrpEffCicliEsec.id}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={epsNestjsOrpEffCicliEsec?.id}>
        <Card
          sx={(theme) => ({
            minWidth: 250,
            minHeight: "100%",
            padding: theme.spacing(1),
            borderRadius: 1,
            border: `1px solid ${
              theme.palette.mode === "dark"
                ? backgroundColorsDark[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA]
                : backgroundColorsLight[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA]
            }`,
          })}
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
        <Grid
          key={child.id}
          size={{ xs: 12, sm: 6, md: 4 }}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              position: "relative",
            }}
          >
            {/* Freccia */}
            <Box
              sx={(theme) => ({
                display: { xs: "none", sm: "inline-block" },
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderRight: `15px solid ${
                  theme.palette.mode === "dark"
                    ? backgroundColorsDark[
                        epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA
                      ]
                    : backgroundColorsLight[
                        epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA
                      ]
                }`,
                marginTop: 0,
                position: "absolute",
              })}
              aria-label="freccia sinistra"
            />
            {/* Freccia top per xs */}
            <Box
              sx={(theme) => ({
                display: { xs: "inline-block", sm: "none" },
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: `30px solid ${
                  theme.palette.mode === "dark"
                    ? backgroundColorsDark[
                        epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA
                      ]
                    : backgroundColorsLight[
                        epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA
                      ]
                }`,
                margin: "0 auto",
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
              })}
              aria-label="freccia sopra"
            />
          </div>
          <Card
            sx={(theme) => ({
              minWidth: "100%",
              padding: theme.spacing(1),
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? backgroundColorsDark[
                      epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA
                    ]
                  : backgroundColorsLight[
                      epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA
                    ]
              }`,
            })}
          >
            <Grid container>
              <Grid size={{ xs: 12 }}>
                <TipoTrasfertaLeftConnectComponent
                  tipotrasferta={epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA}
                >
                  <Button
                    disabled={true}
                    variant="contained"
                    // endIcon={<InsertLinkTwoToneIcon />}
                  >
                    {`${child?.id ?? ""} [${child?.idfk ?? ""}]`}
                  </Button>
                </TipoTrasfertaLeftConnectComponent>
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
