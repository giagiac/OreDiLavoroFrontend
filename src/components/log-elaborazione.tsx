import { AppReq3HypServ } from "@/services/api/types/app-req3-hypserv";
import { HypServReq2 } from "@/services/api/types/hyp-serv-req2";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface LogElaborazioneProps {
  item: HypServReq2 | AppReq3HypServ;
  // onAcknowledge: (codiceChiave: string) => void;
  btnLabel: string;
  text?: string | null;
}

/**
 * Componente generico per visualizzare i log di elaborazione da HypServReq2 o AppReq3HypServ.
 * Mostra il messaggio di esito, la data di fine elaborazione e un pulsante per confermare la presa visione.
 *
 * @param {LogElaborazioneProps} props - Le props del componente.
 * @param {HypServReq2 | AppReq3HypServ} props.item - L'oggetto contenente i dati del log.
 * @param {(codiceChiave: string) => void} props.onAcknowledge - Callback eseguita al click del pulsante di conferma.
 * @returns {JSX.Element} Il componente LogElaborazione.
 */
export function LogElaborazione({ item, btnLabel }: LogElaborazioneProps) {
  const dataFineElab = item.DATAORA_FINE_ELAB
    ? format(new Date(item.DATAORA_FINE_ELAB), "EEE dd MMM yy (HH:mm)", {
        locale: it,
      })
    : "N/A";

  // const handleAcknowledge = () => {
  //   debugger;
  //   onAcknowledge(item.COD_CHIAVE);
  // };

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: "100%", p: 1, borderBottom: "1px solid #eeeeee2e" }}
    >
      <Grid size={{ xs: 12, sm: 8 }}>
        <Typography variant="body2" color="error">
          {item.STRINGA_ESITO_ELAB}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }} container spacing={1} alignItems="center">
        <Grid size={{ xs: 6, sm: 12, md: 6 }} textAlign={{ sm: "right" }}>
          <Typography variant="caption">{dataFineElab}</Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 12, md: 6 }} textAlign="right">
          <Typography>{btnLabel}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
