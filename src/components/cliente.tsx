import { OrpEffCicli } from "@/services/api/types/orp-eff-cicli";
import Typography from "@mui/material/Typography";
import React, { Fragment } from "react";

type ClienteProps = {
  item: OrpEffCicli;
};

const Cliente: React.FC<ClienteProps> = ({ item }) => {
  return (
    <>
      {(item?.linkOrpOrd?.length ?? 0) > 0 ? (
        <Fragment>
          <Typography variant="h4" gutterBottom>
            {item?.linkOrpOrd?.[0]?.ordCliRighe?.cf.RAG_SOC_CF}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {item?.linkOrpOrd?.[0]?.ordCliRighe?.ordCli.cfComm?.DES_SEDE}
          </Typography>
        </Fragment>
      ) : (
        <>
          {(item?.orpEffCicliPadre?.linkOrpOrd?.length ?? 0) > 0 ? (
            <Fragment>
              <Typography variant="h4" gutterBottom>
                {
                  item?.orpEffCicliPadre?.linkOrpOrd?.[0]?.ordCliRighe?.cf
                    .RAG_SOC_CF
                }
              </Typography>
              <Typography variant="h4" gutterBottom>
                {
                  item?.orpEffCicliPadre?.linkOrpOrd?.[0]?.ordCliRighe?.ordCli
                    .cfComm?.DES_SEDE
                }
              </Typography>
            </Fragment>
          ) : (
            <Typography variant="caption">Nessun ordine associato</Typography>
          )}
        </>
      )}
    </>
  );
};

export default Cliente;
