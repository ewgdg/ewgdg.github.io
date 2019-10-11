import React from "react"
import StyledTitle from "components/titles/StyledTitle"
import CardContainer from "components/thumbnail/CardContainer"
import MediaCard from "components/thumbnail/MediaCard"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import FlexContainer from "../sections/FlexContainer"

function BlogPreview() {
  return (
    <FlexContainer>
      <Container style={{ maxHeight: "100%", height: "600px" }}>
        <div style={{ height: "15%" }}>
          <StyledTitle title="Blog" style={{ height: "50%" }} />
          <p
            style={{
              display: "block",
              textAlign: "center",
              height: "50%",
              boxSizing: "border-box",
            }}
          >
            Know what I am thinking:
          </p>
        </div>
        <div style={{ height: "75%" }}>
          <CardContainer style={{ marginBottom: "25px" }}>
            <MediaCard />
            <MediaCard />
          </CardContainer>
        </div>
        <Grid container justify="center" style={{ maxHeight: "10%" }}>
          <Button variant="outlined" color="secondary">
            View more
          </Button>
        </Grid>
      </Container>
    </FlexContainer>
  )
}

export default BlogPreview
