/* eslint-disable react/prop-types */
import React from "react"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"

export default function MediaCard({
  onClick,
  image,
  style,
  title,
  description,
}) {
  return (
    <Grid item xs={5} style={{ height: "450px", maxHeight: "100%", ...style }}>
      <Card sx={{ maxWidth: "100%", backgroundColor: "transparent", height: "100%" }}>
        <CardActionArea onClick={onClick} sx={{ height: "90%" }}>
          {image ? (
            <CardMedia
              sx={{ height: "65%" }}
              image={
                image.childImageSharp ? image.childImageSharp.fluid.src : image
              }
              title={title}
            />
          ) : (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ height: "65%", backgroundColor: "white" }}
              title={title}
            >
              <div style={{ margin: "5%" }}>
                <h1>
                  <strong>{title}</strong>
                </h1>
              </div>
            </Grid>
          )}
          <CardContent sx={{ height: "35%", overflow: "hidden" }}>
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
              color="text.secondary"
              component="p"
              style={{ height: "50%", overflow: "hidden" }}
            >
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ height: "10%" }}>
          <Button size="small" color="primary" onClick={onClick}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}
