"use client";

import type { Data } from "@measured/puck";
import { Puck, Render } from "@measured/puck";
import config from "../../../puck.config";
import { AppBar, Box, Button, Dialog, IconButton, Modal, Slide, Toolbar, Typography } from "@mui/material";
import { forwardRef, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [currentData, setCurrentData] = useState(data);
  const onPublish = async (data) => { 
    setCurrentData(data);
    await fetch("/puck/api", {
      method: "post",
      body: JSON.stringify({ data, path }),
    });
  }
  return (

    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              X
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Sound
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Render config={config} data={currentData} />
      </Dialog>
      <Puck
        config={config}
        data={data}
        onPublish={onPublish}
      />
    </div>
  );
}
