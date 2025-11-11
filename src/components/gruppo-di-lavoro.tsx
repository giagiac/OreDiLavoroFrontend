import { EpsNestjsOrpEffCicliEsecFailed } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec-failed";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

interface GruppoDiLavoroProps {
  item: EpsNestjsOrpEffCicliEsecFailed;
}

/**
 * Componente per visualizzare i valori del gruppo di lavoro.
 * Mostra gli operatori e le informazioni correlate.
 *
 * @param {GruppoDiLavoroProps} props - Le props del componente.
 * @param {EpsNestjsOrpEffCicliEsecFailed} props.item - L'oggetto contenente i dati dell'operatore.
 * @returns {JSX.Element} Il componente GruppoDiLavoro.
 */
export function GruppoDiLavoro({ item }: GruppoDiLavoroProps) {
  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      sx={{ width: "100%", p: 1, borderBottom: "1px solid #eee" }}
    >
      {item.gruppoDiLavoro && item.gruppoDiLavoro.length > 0 && (
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" display="block" gutterBottom>
            Gruppo di Lavoro:
          </Typography>
          {item.gruppoDiLavoro.map((membro, index) => (
            <Grid
              container
              key={membro.id || index}
              spacing={1}
              sx={{ ml: 2, mb: 1 }}
            >
              {membro.operatori && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2">
                    {membro.operatori.NOME_OP}
                    {membro.COD_OP ? ` (${membro.COD_OP})` : ""}
                  </Typography>
                </Grid>
              )}
              {membro.TEMPO_OPERATORE && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="textSecondary">
                    Tempo Operatore: {membro.TEMPO_OPERATORE.toString()}
                  </Typography>
                </Grid>
              )}
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
}
