import React from "react";
import HeaderContainer from "../components/header/HeaderContainer";


const IndexPagePreview = ({ jumbotronProps }) => {
  return (
    <div>
      <HeaderContainer
        headerProps={{ color: "white", position: "absolute" }}
        jumbotronProps={jumbotronProps} />
    </div>
  );
};

export default IndexPagePreview;