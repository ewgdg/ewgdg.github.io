/* eslint-disable react/prop-types */
import React from "react"
import ReactPaginate from "react-paginate"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  pagination: {
    display: "inline-block",
    paddingLeft: "15px",
    paddingRight: "15px",
    fontFamily: "roboto",
    fontSize: "14px",
    margin: "auto",
    marginTop: "10px",
    marginBottom: "10px",
    maxHeight: "100%",
    userSelect: "none",
    cursor: "pointer",
    "@media (max-height: 450px)": {
      "&": {
        marginBottom: "0px",
        marginTop: "2px",
      },
    },
    "& li": {
      display: "inline",
      color: "#337ab7",
      float: "left",
      margin: 0,
      border: "1px solid rgba(122,122,122,0.2)",
      boxSizing: "border-box",
      maxHeight: "100%",
      userSelect: "none",
      "&.prev-border": {
        borderRadius: "5px 0px 0px 5px",
      },
      "&.next-border": {
        borderRadius: "0px 5px 5px 0px",
      },
      "& a": {
        maxHeight: "100%",
        display: "inline-block",
        padding: "0.3em 0.9em",
        textDecoration: "none",
        margin: 0,
        userSelect: "none",
        outline: "none",
        "&.active": {
          backgroundColor: "#337ab7",
          color: "white",
        },
        "&:hover:not(.active)": {
          backgroundColor: "rgba(166,166,166,0.2)",
        },
        "@media (max-height: 450px)": {
          "&": {
            padding: "0.15em 0.6em",
          },
        },
      },
    },
  },
  center: {
    textAlign: "center",
  },
})

function Paginator({ pageCount = 0, handlePageClick, currentPage, style }) {
  const classes = useStyles()
  // const handlePageClick = useCallback(pageData => {
  //   const currentPage = pageData.selected
  //   console.log(currentPage)
  // }, [])

  return (
    <div className={classes.center} style={style}>
      <ReactPaginate
        previousLabel="prev"
        nextLabel="next"
        breakLabel="..."
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={classes.pagination}
        activeLinkClassName="active"
        nextClassName="next-border"
        previousClassName="prev-border"
        forcePage={currentPage}
        style={{ maxHeight: "100%" }}
      />
    </div>
  )
}

export default Paginator
