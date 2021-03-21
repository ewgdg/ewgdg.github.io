import React from "react";
import HeaderContainer from "../components/header/HeaderContainer";

function BlogPagePreview({ jumbotronProps }) {
  return (
    <HeaderContainer
      headerProps={{ color: "white", position: "absolute" }}
      jumbotronProps={jumbotronProps} />
  );
}

export default BlogPagePreview;
