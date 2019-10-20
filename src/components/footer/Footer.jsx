/* eslint-disable react/jsx-one-expression-per-line */
import React from "react"
import EmailRoundedIcon from "@material-ui/icons/EmailRounded"
import IconButton from "@material-ui/core/IconButton"

function Footer({ className }) {
  return (
    <footer
      style={{
        textAlign: "center",
        backgroundColor: "#1a1a1a",
        padding: "10vh 6vw",
        margin: "0",
        display: "block",
        width: "100%",
        maxHeight: "350px",
      }}
      className={className}
    >
      <p style={{ color: "white", fontSize: "1.5rem" }}>
        Let me show you how I solve problems.
      </p>
      <p style={{ opacity: 0.6, color: "white" }}>
        <small>
          © {new Date().getFullYear()} Xian Zhang, Built with{" "}
          <a href="https://www.gatsbyjs.org" style={{ color: "white" }}>
            Gatsby
          </a>
        </small>
      </p>
      <div>
        <IconButton
          color="primary"
          onClick={() => {
            window.location.href = "m&a&i#l#&t#o:$x#&i$a$n&#$.$z$#5$1#&$2$#^$#g$m#a$i&$l#$.$c#o&#m$"
              .replace(/\^/g, "@")
              .replace(/[#&$]/g, "")
          }}
        >
          <EmailRoundedIcon htmlColor="white" />
        </IconButton>
      </div>
    </footer>
  )
}

export default Footer
