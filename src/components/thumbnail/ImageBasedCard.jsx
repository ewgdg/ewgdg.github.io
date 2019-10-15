/* eslint-disable react/prop-types */
import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardActionArea from "@material-ui/core/CardActionArea"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"

const useStyles = makeStyles({
  card: {
    maxWidth: "100%",
    backgroundColor: "transparent",
    maxHeight: "100%",
    height: "350px",
  },
  media: {
    height: "100%",
  },
  action: { height: "100%" },
  content: {
    opacity: 0,
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    top: "0",
    left: "0",
    zIndex: "12",
    width: "100%",
    height: "100%",
    transition: "0.75s",
    "$action:hover &": {
      opacity: 1,
    },
  },
})

/* return a card that shows description on hover */
export default function ImageCard({
  onClick,
  style,
  image,
  title,
  description,
}) {
  const classes = useStyles()

  return (
    <Grid item xs={5} style={{ height: "400px", ...style }}>
      <Card className={classes.card}>
        <CardActionArea className={classes.action} onClick={onClick}>
          {image ? (
            <CardMedia
              className={classes.media}
              image={
                image.childImageSharp ? image.childImageSharp.fluid.src : image
              }
              title={title}
            />
          ) : (
            <Grid
              container
              justify="center"
              alignItems="center"
              className={classes.media}
              title={title}
              style={{ backgroundColor: "white" }}
            >
              <div style={{ margin: "5%" }}>
                <h1>
                  <strong>{title}</strong>
                </h1>
              </div>
            </Grid>
          )}

          <Grid
            container
            alignItems="center"
            justify="center"
            className={classes.content}
          >
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {title}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                {description}
              </Typography>
            </CardContent>
          </Grid>
        </CardActionArea>
        {/* <CardActions>
          <Button size="small" color="primary" onClick={onClick}>
            Learn More
          </Button>
        </CardActions> */}
      </Card>
    </Grid>
  )
}
