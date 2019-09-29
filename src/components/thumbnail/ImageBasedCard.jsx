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
    minHeight: "350px",
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
export default function ImageCard({ onClick }) {
  const classes = useStyles()

  return (
    <Grid item xs={5}>
      <Card className={classes.card}>
        <CardActionArea className={classes.action} onClick={onClick}>
          <CardMedia
            className={classes.media}
            image="/splash.png"
            title="Contemplative Reptile"
          />

          <Grid
            container
            alignItems="center"
            justify="center"
            className={classes.content}
          >
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Lizard
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Lizards are a widespread group of squamate reptiles, with over
                6,000 species, ranging across all continents except Antarctica
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
