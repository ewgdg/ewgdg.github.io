'use client'

/* eslint-disable react/prop-types */
import React, { useCallback } from "react"
import Modal from "@mui/material/Modal"
import Backdrop from "@mui/material/Backdrop"
import Fade from "@mui/material/Fade"
import Box from "@mui/material/Box"
import TextLink from "../others/text-link"


function TransitionsModal({
  open,
  handleClose,
  title,
  description,
  links,
  children,
}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{
        backdrop: Backdrop,
      }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      <Fade in={open}>
        <Box
          sx={{
            backgroundColor: 'white',
            border: '2px solid #000',
            boxShadow: 24,
            padding: '16px 32px',
            maxWidth: '75%',
            width: '700px',
            position: 'relative',
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          {title && (
            <h2 id="modal-title" style={{ marginTop: 0 }}>
              {title}
            </h2>
          )}
          {description && (
            <div id="modal-description">
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: 'inherit' }}>
                <TextLink text={description} links={links} />
              </pre>
            </div>
          )}
          {children}
        </Box>
      </Fade>
    </Modal>
  )
}

export const useModalController = () => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return [open, handleOpen, handleClose]
}

export default TransitionsModal
