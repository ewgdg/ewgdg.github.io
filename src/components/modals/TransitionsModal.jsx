/* eslint-disable react/prop-types */
import React, { useCallback } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import TextLink from "../others/TextLink"

const useStyles = makeStyles({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "white",
    border: "2px solid #000",
    // boxShadow: theme.shadows[5],
    padding: "16px 32px",
    maxWidth: "75%",
    width: "700px",
  },
})

function TransitionsModal({
  open,
  handleClose,
  title,
  description,
  links,
  children,
}) {
  const classes = useStyles()

  return (
    <div>
      {/* <button type="button" onClick={handleOpen}>
        react-transition-group
      </button> */}
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            {title && <h2 id="transition-modal-title">{title}</h2>}
            {description && (
              <pre style={{ whiteSpace: "pre-wrap" }}>
                <TextLink text={description} links={links} />
              </pre>
            )}
            {children}
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

export const useModalController = () => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return [open, handleOpen, handleClose]
}

export default TransitionsModal
