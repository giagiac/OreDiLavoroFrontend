import TipoTrasfertaComponent from "@/components/tipo-trasferta";
import { TipoTrasfertaColors } from "@/constants/theme-colors";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";

import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";

interface Props {
  epsNestjsOrpEffCicliEsec: EpsNestjsOrpEffCicliEsec;
}

export function ChildEpsNestjsOrpEffCicliEsecCardMini({
  epsNestjsOrpEffCicliEsec,
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

  const theme = useTheme();

  const color =
    theme.palette.mode === "dark"
      ? TipoTrasfertaColors[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA].dark
      : TipoTrasfertaColors[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA].light;

  return (
    <>
      <Card
        sx={(theme) => ({
          minWidth: 200,
          width: 220,
          padding: theme.spacing(1),
          borderRadius: 1,
          border: `1px solid`,
          borderColor: color.main,
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
                <Stack direction="column" textAlign="center">
                  <Typography variant="caption">
                    {epsNestjsOrpEffCicliEsec?.id ?? ""}
                  </Typography>
                </Stack>
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
                    `Targa mezzo : ${epsNestjsOrpEffCicliEsec?.artAna?.DES_ART} · ${epsNestjsOrpEffCicliEsec?.KM} Km`}
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
            minWidth: 200,
            width: 220,
            padding: theme.spacing(1),
            borderRadius: 1,
            border: `1px solid`,
            borderColor: color.main,
          })}
        >
          <Grid container>
            <Grid size={{ xs: 12 }}>
              <TipoTrasfertaComponent tipotrasferta={child.TIPO_TRASFERTA}>
                <Stack direction="column" textAlign="center">
                  <Typography variant="caption">{child?.id}</Typography>
                  <Typography variant="caption">[{child?.idfk}]</Typography>
                </Stack>
              </TipoTrasfertaComponent>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2">
                {" "}
                {/* Scaled down from body1 */}
                {child?.orpEffCicli?.linkOrpOrd?.map(
                  (it) => it.ordCliRighe?.cf.RAG_SOC_CF
                )}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }} container alignItems="center" spacing={1}>
              <Grid size={{ xs: 10 }}>
                <Typography variant="caption">{child?.DOC_RIGA_ID}</Typography>
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
                    {child?.orpEffCicli?.orpEff.DES_PROD}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" textAlign="right">
                    {child?.COD_ART !== null &&
                      `Targa mezzo : ${child?.artAna?.DES_ART} · ${child?.KM} Km`}
                  </Typography>
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" textAlign="right">
                {child?.TEMPO_OPERATORE_SESSANTESIMI?.toString()}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      ))}
    </>
  );
}
