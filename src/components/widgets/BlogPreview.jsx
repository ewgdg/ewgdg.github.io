import React from "react"
import StyledTitle from "components/heading/StyledTitle"
import CardContainer from "components/thumbnail/CardContainer"
import MediaCard from "components/thumbnail/MediaCard"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import FlexContainer from "../decorators/FlexContainer"

function BlogPreview() {
  return (
    <FlexContainer>
      <Container>
        <div>
          <StyledTitle title="Blog" />
          <p style={{ textAlign: "center" }}>Know what I am thinking:</p>
        </div>
        <CardContainer style={{ marginBottom: "25px" }}>
          <MediaCard />
          <MediaCard />
        </CardContainer>
        <Grid container justify="center">
          <Button variant="outlined" color="secondary">
            View more
          </Button>
        </Grid>
      </Container>
    </FlexContainer>
  )
}

export default BlogPreview
