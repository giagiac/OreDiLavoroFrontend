import TipoTrasfertaComponent, {
  backgroundColorsDark,
  backgroundColorsLight,
} from "@/components/tipo-trasferta";
import TipoTrasfertaLeftConnectComponent from "@/components/tipo-trasferta-left-connect";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { LinkOrpOrd } from "@/services/api/types/link-orp-ord";
import DeleteForeverTwoTone from "@mui/icons-material/DeleteForeverTwoTone";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useState } from "react";

interface Props {
  epsNestjsOrpEffCicliEsec: EpsNestjsOrpEffCicliEsec;
  renderOrdCliTrasDialog: (
    linkOrpOrd: Array<LinkOrpOrd>
  ) => React.ReactNode | null;
  onDelete: (id: string) => void;
}

export function ChildEpsNestjsOrpEffCicliEsecCardMini({
  epsNestjsOrpEffCicliEsec,
  renderOrdCliTrasDialog,
  onDelete,
}: Props) {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [childContentVisible, setChildContentVisible] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
  };

  const toggleChildContentVisibility = (childId: string) => {
    setChildContentVisible((prev) => ({
      ...prev,
      [childId]: !prev[childId],
    }));
  };

  return (
    <>
      <Card
        sx={(theme) => ({
          minWidth: 250,
          padding: theme.spacing(1),
          borderRadius: 1,
          border: `1px solid ${
            theme.palette.mode === "dark"
              ? backgroundColorsDark[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA]
              : backgroundColorsLight[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA]
          }`,
        })}
      >
        <Grid container>
          <Grid size={{ xs: 12 }}>
            <TipoTrasfertaComponent
              tipotrasferta={epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA}
            >
              {epsNestjsOrpEffCicliEsec.HYPSERV_REQ2_COD_CHIAVE !== null ||
              epsNestjsOrpEffCicliEsec.APP_REQ3_HYPSERV_COD_CHIAVE !== null ? (
                <Icon sx={{ fontSize: "1rem" }}>
                  {" "}
                  {/* Scaled down icon size */}
                  <LockTwoToneIcon fontSize="small" /> {/* Using small icon */}
                </Icon>
              ) : (
                <Button
                  onClick={() => {
                    onDelete(epsNestjsOrpEffCicliEsec?.id);
                  }}
                  variant="contained"
                  size="small" // Using small button size
                  endIcon={<DeleteForeverTwoTone fontSize="small" />} // Using small icon
                >
                  {epsNestjsOrpEffCicliEsec?.id}
                </Button>
              )}
            </TipoTrasfertaComponent>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2">
              {" "}
              {/* Scaled down from body1 */}
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
          <Grid size={{ xs: 12 }} container alignItems="center" spacing={1}>
            <Grid size={{ xs: 10 }}>
              <Typography variant="caption">
                {epsNestjsOrpEffCicliEsec?.DOC_RIGA_ID}
              </Typography>
            </Grid>
            <Grid size={{ xs: 2 }} textAlign={"right"}>
              <IconButton
                size="small"
                onClick={toggleContentVisibility}
                aria-label={
                  isContentVisible ? "Nascondi contenuto" : "Mostra contenuto"
                }
              >
                {isContentVisible ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </IconButton>
            </Grid>
          </Grid>
          {isContentVisible && (
            <>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption">
                  {epsNestjsOrpEffCicliEsec?.orpEffCicli?.orpEff.DES_PROD}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" textAlign="right">
                  {epsNestjsOrpEffCicliEsec?.COD_ART !== null &&
                    `Targa mezzo : ${epsNestjsOrpEffCicliEsec?.COD_ART}${
                      epsNestjsOrpEffCicliEsec?.KM?.toString() !== "0"
                        ? ` · ${epsNestjsOrpEffCicliEsec?.KM} Km`
                        : ""
                    }`}
                </Typography>
              </Grid>
            </>
          )}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" textAlign="right">
              {epsNestjsOrpEffCicliEsec?.TEMPO_OPERATORE_SESSANTESIMI?.toString()}
            </Typography>
          </Grid>
        </Grid>
      </Card>
      {epsNestjsOrpEffCicliEsec?.epsNestjsOrpEffCicliEsecChild?.map((child) => (
        <Card
          key={child.id}
          sx={(theme) => ({
            minWidth: 250,
            padding: theme.spacing(1),
            borderRadius: 1,
            border: `1px solid ${
              theme.palette.mode === "dark"
                ? backgroundColorsDark[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA]
                : backgroundColorsLight[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA]
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
                  size="small" // Using small button size
                >
                  {`${child?.id ?? ""} [${child?.idfk ?? ""}]`}
                </Button>
              </TipoTrasfertaLeftConnectComponent>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2">
                {" "}
                {/* Scaled down from body1 */}
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
            <Grid size={{ xs: 12 }} container alignItems="center" spacing={1}>
              <Grid size={{ xs: 10 }}>
                <Typography variant="caption">
                  {epsNestjsOrpEffCicliEsec?.DOC_RIGA_ID}
                </Typography>
              </Grid>
              <Grid size={{ xs: 2 }} textAlign={"right"}>
                <IconButton
                  size="small"
                  onClick={() => toggleChildContentVisibility(child.id)}
                  aria-label={
                    childContentVisible[child.id]
                      ? "Nascondi contenuto"
                      : "Mostra contenuto"
                  }
                >
                  {childContentVisible[child.id] ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </IconButton>
              </Grid>
            </Grid>
            {childContentVisible[child.id] && (
              <>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption">
                    {epsNestjsOrpEffCicliEsec?.orpEffCicli?.orpEff.DES_PROD}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" textAlign="right">
                    {epsNestjsOrpEffCicliEsec?.COD_ART !== null &&
                      `Targa mezzo : ${epsNestjsOrpEffCicliEsec?.COD_ART}${
                        epsNestjsOrpEffCicliEsec?.KM?.toString() !== "0"
                          ? ` · ${epsNestjsOrpEffCicliEsec?.KM} Km`
                          : ""
                      }`}
                  </Typography>
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" textAlign="right">
                {epsNestjsOrpEffCicliEsec?.TEMPO_OPERATORE_SESSANTESIMI?.toString()}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      ))}
    </>
  );
}
