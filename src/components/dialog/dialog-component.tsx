import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

type GenericDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  content: React.ReactElement;
  actions?: React.ReactElement;
};

const DialogComponent: React.FC<GenericDialogProps> = ({
  open,
  onClose,
  title,
  content,
  actions,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{content}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
      {!actions && (
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Chiudi
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DialogComponent;