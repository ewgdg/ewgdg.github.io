/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { useMemo, useCallback, useState } from "react"
import MediaCard from "components/thumbnail/MediaCard"
import Container from "@material-ui/core/Container"
import TextField from "@material-ui/core/TextField"
import Paginator from "../others/Paginator"
import CardContainer from "./CardContainer"

function CardTable({ datalist = [], itemsPerPage = 4, CardComp = MediaCard }) {
  const [currentPage, setPage] = useState(0)
  const [keywords, setKeywords] = useState([])
  const filtered = useMemo(() => {
    const regex = new RegExp(`(${keywords.join("|")})`, "i")
    return datalist.filter(data => {
      return regex.test(data)
    })
  }, [keywords])
  const pageData = useMemo(() => {
    const startIdx = currentPage * itemsPerPage
    const endIdx = startIdx + itemsPerPage
    return filtered.slice(startIdx, endIdx)
  }, [currentPage, filtered])

  const pageCount = useMemo(() => {
    return filtered.length / itemsPerPage
  }, [filtered, itemsPerPage])

  const handlePageClick = useCallback(page => {
    console.log(page)
    setPage(page.selected)
  })

  const onSearchFieldChange = useCallback(event => {
    const { value } = event.target
    setKeywords(value.split(/[.!?\s+-]/g))
    setPage(0)
  })
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        textAlign: "center",
      }}
    >
      <TextField
        label="Search"
        type="search"
        margin="normal"
        variant="outlined"
        onChange={onSearchFieldChange}
        style={{ marginLeft: "8px", marginRight: "8px" }}
      />

      <Container style={{ height: "80%" }}>
        <CardContainer>
          {pageData.map((data, i) => (
            <CardComp key={i} style={{ height: "45%" }} />
          ))}
        </CardContainer>
      </Container>
      <Paginator
        style={{ position: "absolute", bottom: "0", width: "100%" }}
        pageCount={pageCount}
        handlePageClick={handlePageClick}
      />
    </div>
  )
}

export default CardTable
