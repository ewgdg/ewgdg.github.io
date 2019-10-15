/* eslint-disable react/prop-types */
import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardActionArea from "@material-ui/core/CardActionArea"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"

const useStyles = makeStyles({
  card: {
    maxWidth: "100%",
    backgroundColor: "transparent",
    height: "100%",
  },
  actionArea: {
    height: "90%",
  },
  media: {
    height: "65%",
  },
  content: {
    height: "35%",
    overflow: "hidden",
  },
  action: {
    height: "10%",
  },
})

export default function MediaCard({
  onClick,
  image,
  style,
  title,
  description,
}) {
  const classes = useStyles()
  return (
    <Grid item xs={5} style={{ height: "450px", maxHeight: "100%", ...style }}>
      <Card className={classes.card}>
        <CardActionArea onClick={onClick} className={classes.actionArea}>
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
          <CardContent className={classes.content}>
            <Typography
              gutterBottom
              variant="h6"
              component="h2"
              style={{ height: "50%", overflow: "hidden" }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ height: "50%", overflow: "hidden" }}
            >
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className={classes.action}>
          <Button size="small" color="primary" onClick={onClick}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}
