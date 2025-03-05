import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddQuote from "@/app/quote/add/page";
import EditQuotes from "@/app/quote/[edit]/quoteEdit";

export default function QuoteModal({ open, close }) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ padding: "0" }}>
          <EditQuotes title="Edit Quote" />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Disagree</Button>
          <Button onClick={close} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
