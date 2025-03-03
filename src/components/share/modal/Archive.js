import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Unarchive } from "@mui/icons-material";
export default function ConfirmationModal({
  onConfirm,
  isOpen,
  confirmMessage,
  confirmTitle,
  archive,
  onClose,
}) {
  console.log("abc", archive);

  return (
    <>
      <Dialog open={isOpen} onClose={onClose}>
        <div className="dark-purple-bg theme-border-light pb-3">
          <DialogTitle className="text-center theme-color">
            {confirmTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="!text-white">
              {confirmMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!justify-center">
            <Button
              onClick={onClose}
              color="primary"
              className="theme-color-bg !text-black !normal-case"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              autoFocus
              className="!bg-red-900 !text-white !normal-case"
            >
              {archive == 1 ? "Archive" : "Unarchive"}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
}
