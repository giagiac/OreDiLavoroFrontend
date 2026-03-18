import { NumericKeypad } from "@/components/numeric-keypad-ore";
import TipoTrasfertaComponent from "@/components/tipo-trasferta";
import { TipoTrasfertaColors } from "@/constants/theme-colors";
import { Cf } from "@/services/api/types/cf";
import { CfComm } from "@/services/api/types/cfComm";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { EpsNestjsOrpEffCicliEsecChild } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec-child";
import { OrdCli } from "@/services/api/types/ord-cli";
import { OrdCliRighe } from "@/services/api/types/ord-cli-righe";
import { RoleEnum } from "@/services/api/types/role";
import useAuth from "@/services/auth/use-auth";
import DeleteForeverTwoTone from "@mui/icons-material/DeleteForeverTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import FileUploadTwoToneIcon from "@mui/icons-material/FileUploadTwoTone";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid2";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Fragment, useState } from "react";

interface Props {
  epsNestjsOrpEffCicliEsec: EpsNestjsOrpEffCicliEsec;
  onUpdate?: (
    id: string,
    TEMPO_OPERATORE: string | null,
    idfk?: string
  ) => Promise<boolean>;
  onDisable?: (
    id: string,
    prev_HYPSERV_REQ2_COD_CHIAVE_DELETED: number | null | undefined,
    idfk?: string
  ) => Promise<boolean>;
  onDelete?: (id: string) => void;
  onSendHG?: (id: string) => void;
}

export function ChildEpsNestjsOrpEffCicliEsecCard({
  epsNestjsOrpEffCicliEsec,
  onUpdate,
  onDisable,
  onDelete,
  onSendHG,
}: Props) {
  const { user } = useAuth();
  const theme = useTheme();

  const color =
    theme.palette.mode === "dark"
      ? TipoTrasfertaColors[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA].dark
      : TipoTrasfertaColors[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA].light;

  const [editOpen, setEditOpen] = useState<EpsNestjsOrpEffCicliEsec | null>(
    null
  );
  const [editOpenChild, setEditOpenChild] =
    useState<EpsNestjsOrpEffCicliEsecChild | null>(null);

  const [tempoOreOperatore, setTempoOreOperatore] = useState<string | null>(
    null
  );

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const isSentHG =
    epsNestjsOrpEffCicliEsec.HYPSERV_REQ2_COD_CHIAVE !== null ||
    epsNestjsOrpEffCicliEsec.APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM !== null ||
    epsNestjsOrpEffCicliEsec.APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA !==
      null;

  return (
    <Fragment>
      <Dialog
        open={editOpen !== null || editOpenChild !== null}
        onClose={() => {
          setEditOpen(null);
          setEditOpenChild(null);
        }}
        maxWidth="sm"
        fullScreen={fullScreen}
      >
        <DialogTitle>{`Modifica le ore inserite`}</DialogTitle>
        <DialogContent>
          <NumericKeypad
            onNumberChange={(value) => {
              setTempoOreOperatore(value);
            }}
          />
          <Stack direction="column" spacing={1} alignItems="center" mt={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                height: 56,
                fontSize: "1.5rem",
              }}
              onClick={async () => {
                if (onUpdate) {
                  // Type guard for EpsNestjsOrpEffCicliEsec
                  if (editOpen) {
                    const result = await onUpdate(
                      editOpen?.id,
                      tempoOreOperatore
                    );
                    if (result) {
                      setEditOpen(null);
                      setEditOpenChild(null);
                      setTempoOreOperatore(null);
                    }
                  } else if (editOpenChild) {
                    const result = await onUpdate(
                      editOpenChild?.id,
                      tempoOreOperatore,
                      editOpenChild.idfk
                    );
                    if (result) {
                      setEditOpen(null);
                      setEditOpenChild(null);
                      setTempoOreOperatore(null);
                    }
                  }
                }
              }}
            >
              Conferma
            </Button>
            <Button
              sx={{
                height: 56,
                fontSize: "1.5rem",
              }}
              color="warning"
              variant="outlined"
              onClick={() => {
                setEditOpen(null);
                setEditOpenChild(null);
                setTempoOreOperatore(null);
              }}
            >
              ANNULLA
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <Card
          sx={{
            height: "100%",
            padding: theme.spacing(1),
            borderRadius: 1,
            border: `1px solid`,
            borderColor: color.main,
            position: "relative",
            "&::after": epsNestjsOrpEffCicliEsec.HYPSERV_REQ2_COD_CHIAVE_DELETED
              ? {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: 0,
                  background: `linear-gradient(-45deg, transparent calc(48% - 1px), red calc(50% - 1px), red calc(48% + 1px), transparent calc(50% + 1px))`,
                  pointerEvents: "none",
                }
              : {},
          }}
        >
          <Grid container>
            <Grid size={{ xs: 12 }}>
              <TipoTrasfertaComponent
                tipotrasferta={epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA}
              >
                <>
                  {isSentHG ? (
                    // l'esecuzione è stata già processata e non si può fare nessuna modifica (in futuro l'operatore potrà cancellare... liberando il lavoro su HG)
                    <Stack
                      direction="row"
                      textAlign="center"
                      spacing={1}
                      alignItems="center"
                    >
                      <Typography variant="caption">
                        {epsNestjsOrpEffCicliEsec?.id}
                      </Typography>
                      <Icon>
                        <LockTwoToneIcon />
                      </Icon>
                    </Stack>
                  ) : (
                    <Stack direction="row" textAlign="center" spacing={1}>
                      {(user?.role?.id === RoleEnum.ADMIN ||
                        user?.role?.id === RoleEnum.CANTIERE) && (
                        <>
                          {onSendHG && (
                            // solo gli amministratori possono inviare il lavoro ad HG
                            <Button
                              sx={{
                                backgroundColor: theme.palette.augmentColor({
                                  color: {
                                    main: color.main,
                                  },
                                  mainShade: 900,
                                }).main,
                                color: theme.palette.getContrastText(
                                  color.main
                                ),
                                "&:hover": {
                                  backgroundColor: color.hover,
                                },
                              }}
                              onClick={() => {
                                onSendHG(epsNestjsOrpEffCicliEsec?.id);
                              }}
                              variant="contained"
                              endIcon={<FileUploadTwoToneIcon />}
                            >
                              HG
                            </Button>
                          )}
                        </>
                      )}
                      {onDelete !== undefined ? (
                        // visualizzazione per operatore e admin in data odierna (l'operatore sulla data odienna può ancora cancellare roba)
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
                      ) : (
                        // visualizzazione specifica per storico operatore (non è ancora stato processato da HG ma lui nel passato non può andarsi a cancellare roba)
                        <Stack
                          direction="row"
                          textAlign="center"
                          spacing={1}
                          alignItems="center"
                        >
                          <Typography variant="caption">
                            {epsNestjsOrpEffCicliEsec?.id}
                          </Typography>
                          <Icon>
                            <LockTwoToneIcon />
                          </Icon>
                        </Stack>
                      )}
                    </Stack>
                  )}
                </>
              </TipoTrasfertaComponent>
            </Grid>
            {epsNestjsOrpEffCicliEsec?.orpEffCicli !== null && (
              <>
                <Grid size={{ xs: 12 }}>
                  {/* se ODP collegato a OC direttamente allora mostro le informazioni del cliente e la DES_SEDE */}
                  {(epsNestjsOrpEffCicliEsec?.orpEffCicli?.linkOrpOrd?.length ??
                    0) > 0 ? (
                    <Fragment>
                      <Typography>
                        {
                          epsNestjsOrpEffCicliEsec?.orpEffCicli?.linkOrpOrd?.[0]
                            ?.ordCliRighe?.cf.RAG_SOC_CF
                        }
                      </Typography>
                      <Typography>
                        {
                          epsNestjsOrpEffCicliEsec?.orpEffCicli?.linkOrpOrd?.[0]
                            ?.ordCliRighe?.ordCli.cfComm?.DES_SEDE
                        }
                      </Typography>
                      <CfContainer
                        ordCliRighe={
                          epsNestjsOrpEffCicliEsec?.orpEffCicli?.linkOrpOrd?.[0]
                            ?.ordCliRighe
                        }
                      />
                    </Fragment>
                  ) : (
                    // se ODP collegato a OC indirettamente mostro il CF dell'OC padre
                    (epsNestjsOrpEffCicliEsec?.orpEffPadre?.linkOrpOrd
                      ?.length ?? 0) > 0 && (
                      <Fragment>
                        <Typography>
                          {
                            epsNestjsOrpEffCicliEsec?.orpEffPadre
                              ?.linkOrpOrd?.[0]?.ordCliRighe?.cf.RAG_SOC_CF
                          }
                        </Typography>
                        <Typography>
                          {
                            epsNestjsOrpEffCicliEsec?.orpEffPadre
                              ?.linkOrpOrd?.[0]?.ordCliRighe?.ordCli.cfComm
                              ?.DES_SEDE
                          }
                        </Typography>
                        <CfContainer
                          ordCliRighe={
                            epsNestjsOrpEffCicliEsec?.orpEffPadre
                              ?.linkOrpOrd?.[0]?.ordCliRighe
                          }
                        />
                      </Fragment>
                    )
                  )}
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1" mt={1}>
                {epsNestjsOrpEffCicliEsec?.DOC_RIGA_ID}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" mt={1}>
                {epsNestjsOrpEffCicliEsec?.orpEffCicli?.orpEff.DES_PROD}
              </Typography>
              {epsNestjsOrpEffCicliEsec?.orpEffCicli?.orpEff.DES_PROD !==
                epsNestjsOrpEffCicliEsec?.orpEffCicli?.DES_CICLO && (
                <Typography variant="body1" mt={1}>
                  {epsNestjsOrpEffCicliEsec?.orpEffCicli?.DES_CICLO}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" textAlign="right" mt={1}>
                {epsNestjsOrpEffCicliEsec?.COD_ART !== null &&
                  `Targa mezzo : ${epsNestjsOrpEffCicliEsec?.artAna?.DES_ART} · ${epsNestjsOrpEffCicliEsec?.KM} Km`}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={1}
              >
                {onUpdate !== undefined &&
                  (!isSentHG || user?.role?.id === RoleEnum.ADMIN) && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setEditOpen(epsNestjsOrpEffCicliEsec)}
                      sx={{ float: "left", mr: 1, minWidth: 36, p: 0.5 }}
                      aria-label="Modifica"
                    >
                      <EditTwoToneIcon />
                    </Button>
                  )}
                {onDisable !== undefined && (
                  <FormControlLabel
                    labelPlacement="bottom"
                    control={
                      <Switch
                        checked={
                          epsNestjsOrpEffCicliEsec.HYPSERV_REQ2_COD_CHIAVE_DELETED ===
                          null
                        }
                        onChange={() => {
                          onDisable(
                            epsNestjsOrpEffCicliEsec.id,
                            epsNestjsOrpEffCicliEsec.HYPSERV_REQ2_COD_CHIAVE_DELETED
                          );
                        }}
                      />
                    }
                    label=""
                  />
                )}
                <Typography variant="h4" textAlign="right">
                  {epsNestjsOrpEffCicliEsec?.TEMPO_OPERATORE_SESSANTESIMI?.toString()}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      {epsNestjsOrpEffCicliEsec?.epsNestjsOrpEffCicliEsecChild?.map((child) => {
        const isChildSentHG =
          child.APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM !== null ||
          child.APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA !==
            null ||
          child.HYPSERV_REQ2_COD_CHIAVE !== null;
        return (
          <Grid key={child.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              sx={(theme) => ({
                height: "100%",
                padding: theme.spacing(1),
                border: `1px solid`,
                borderColor: color.main,
                position: "relative",
                "&::after": child.HYPSERV_REQ2_COD_CHIAVE_DELETED
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      top: 0,
                      background: `linear-gradient(-45deg, transparent calc(48% - 1px), red calc(50% - 1px), red calc(48% + 1px), transparent calc(50% + 1px))`,
                      pointerEvents: "none",
                    }
                  : {},
              })}
            >
              <Grid container>
                <Grid size={{ xs: 12 }}>
                  <TipoTrasfertaComponent tipotrasferta={child.TIPO_TRASFERTA}>
                    {isChildSentHG ? (
                      <>
                        <Stack
                          direction="row"
                          textAlign="center"
                          spacing={1}
                          alignItems="center"
                        >
                          <Stack direction="column" textAlign="center">
                            <Typography variant="caption">
                              {child?.id ?? ""}
                            </Typography>
                            <Typography variant="caption">
                              [{child?.idfk}]
                            </Typography>
                          </Stack>
                          <Icon>
                            <LockTwoToneIcon />
                          </Icon>
                        </Stack>
                      </>
                    ) : (
                      <Stack direction="column" textAlign="center">
                        <Typography variant="caption">
                          {child?.id ?? ""}
                        </Typography>
                        <Typography variant="caption">
                          [{child?.idfk}]
                        </Typography>
                      </Stack>
                    )}
                  </TipoTrasfertaComponent>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Grid size={{ xs: 12 }}>
                    {/* se ODP collegato a OC direttamente allora mostro le informazioni del cliente e la DES_SEDE */}
                    {(child?.orpEffCicli?.linkOrpOrd?.length ?? 0) > 0 ? (
                      <Fragment>
                        <Typography>
                          {
                            child?.orpEffCicli?.linkOrpOrd?.[0]?.ordCliRighe?.cf
                              .RAG_SOC_CF
                          }
                        </Typography>
                        <Typography>
                          {
                            child?.orpEffCicli?.linkOrpOrd?.[0]?.ordCliRighe
                              ?.ordCli.cfComm?.DES_SEDE
                          }
                        </Typography>
                        <CfContainer
                          ordCliRighe={
                            child?.orpEffCicli?.linkOrpOrd?.[0]?.ordCliRighe
                          }
                        />
                      </Fragment>
                    ) : (
                      // se ODP collegato a OC indirettamente mostro il CF dell'OC padre
                      (child?.orpEffPadre?.linkOrpOrd?.length ?? 0) > 0 && (
                        <Fragment>
                          <Typography>
                            {
                              child?.orpEffPadre?.linkOrpOrd?.[0]?.ordCliRighe
                                ?.cf.RAG_SOC_CF
                            }
                          </Typography>
                          <Typography>
                            {
                              child?.orpEffPadre?.linkOrpOrd?.[0]?.ordCliRighe
                                ?.ordCli.cfComm?.DES_SEDE
                            }
                          </Typography>
                          <CfContainer
                            ordCliRighe={
                              child?.orpEffPadre?.linkOrpOrd?.[0]?.ordCliRighe
                            }
                          />
                        </Fragment>
                      )
                    )}
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption">
                    {child?.DOC_RIGA_ID}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2">
                    {child?.orpEffCicli?.orpEff.DES_PROD}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" textAlign="right">
                    {child?.COD_ART !== null &&
                      `Targa mezzo : ${child?.artAna?.DES_ART} · ${child?.KM} Km`}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={1}
                  >
                    {onUpdate !== undefined &&
                      (!isChildSentHG || user?.role?.id === RoleEnum.ADMIN) &&
                      (() => {
                        return (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              setEditOpenChild(child);
                            }}
                            sx={{ float: "left", mr: 1, minWidth: 36, p: 0.5 }}
                            aria-label="Modifica"
                          >
                            <EditTwoToneIcon />
                          </Button>
                        );
                      })()}
                    {onDisable !== undefined && (
                      <FormControlLabel
                        labelPlacement="bottom"
                        control={
                          <Switch
                            checked={
                              child.HYPSERV_REQ2_COD_CHIAVE_DELETED === null
                            }
                            onChange={() => {
                              onDisable(
                                child.id,
                                child.HYPSERV_REQ2_COD_CHIAVE_DELETED,
                                child.idfk
                              );
                            }}
                          />
                        }
                        label=""
                      />
                    )}
                    <Typography variant="h4" textAlign="right">
                      {child?.TEMPO_OPERATORE_SESSANTESIMI?.toString()}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        );
      })}
    </Fragment>
  );
}

interface PropsCfContainer {
  ordCliRighe?: OrdCliRighe | null;
}

const CfContainer = ({ ordCliRighe }: PropsCfContainer) => {
  const [selectedOrdCli, setSelectedOrdCli] = useState<OrdCli | null>(null);
  const [selectedCf, setSelectedCf] = useState<Cf | null>(null);

  if (!ordCliRighe) {
    return (
      <Typography color="error" variant="h6">
        Errore riferimento ordClicRighe
      </Typography>
    );
  }

  const ordCli = ordCliRighe?.ordCli;

  const cfComm = ordCli.cfComm;

  const handleOpen = (ordCli: OrdCli) => {
    setSelectedOrdCli(ordCli);
  };
  const handleClose = () => {
    setSelectedOrdCli(null);
  };

  const handleOpenCf = (cf: Cf) => {
    setSelectedCf(cf);
  };
  const handleCloseCf = () => {
    setSelectedCf(null);
  };

  if (ordCli.NUM_SEDE === null || cfComm === null) {
    const cf = ordCliRighe?.cf;

    return (
      <Fragment>
        <Button
          variant="outlined"
          onClick={() => cf && handleOpenCf(cf)}
          fullWidth
          disabled={!cf} // Optionally disable the button if cf is undefined
        >
          {cf?.INDI_CF || "No Title"}
        </Button>
        <Dialog
          open={selectedCf !== null}
          onClose={handleCloseCf}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>{`${selectedCf?.INDI_CF || "No Title"}`}</DialogTitle>
          <DialogContent>
            <Table size="small">
              <TableBody>
                {(Object.keys(selectedCf || {}) as (keyof Cf)[]).map((key) => {
                  const value = selectedCf?.[key];
                  if (value === null || value === undefined) return null;
                  return (
                    <TableRow key={key}>
                      <TableCell align="left">
                        <Typography variant="caption">{key}</Typography>
                      </TableCell>
                      <TableCell align="left" style={{ width: 300 }}>
                        <Typography variant="subtitle2">
                          {String(value)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCf} color="primary">
              Chiudi
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }

  // si c'è sede commerciale

  return (
    <Fragment>
      <Button
        variant="outlined"
        onClick={() => handleOpen(ordCli)}
        fullWidth
        disabled={!ordCli.NUM_SEDE} // Optionally disable the button if NUM_DEST is undefined
      >
        {`${cfComm?.NUM_SEDE} · ${cfComm?.DES_SEDE}` || "No Title"}
      </Button>
      <Dialog
        open={selectedOrdCli !== null}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {`${selectedOrdCli?.cfComm?.NUM_SEDE} · ${selectedOrdCli?.cfComm?.DES_SEDE || "No Title"}`}
        </DialogTitle>
        <DialogContent>
          <Table size="small">
            <TableBody>
              {(
                Object.keys(selectedOrdCli?.cfComm || {}) as (keyof CfComm)[]
              ).map((key) => {
                const value = selectedOrdCli?.cfComm?.[key];
                if (value === null || value === undefined) return null;
                return (
                  <TableRow key={key}>
                    <TableCell align="left">
                      <Typography variant="caption">{key}</Typography>
                    </TableCell>
                    <TableCell align="left" style={{ width: 300 }}>
                      <Typography variant="subtitle2">
                        {String(value)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
