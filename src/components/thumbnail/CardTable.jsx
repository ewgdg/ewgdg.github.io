/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { useMemo, useCallback, useState } from "react"
import MediaCard from "components/thumbnail/MediaCard"
import Container from "@material-ui/core/Container"
import TextField from "@material-ui/core/TextField"
import Paginator from "../others/Paginator"
import CardContainer from "./CardContainer"

function CardTable({ datalist = [], itemsPerPage = 4, CardComp = MediaCard }) {
  const pageCount = useMemo(() => {
    return datalist.length / itemsPerPage
  }, [datalist, itemsPerPage])
  const [currentPage, setPage] = useState(0)
  const [keywords, setKeywords] = useState([])
  const filtered = useMemo(() => {
    const regex = new RegExp(`(${keywords.join("|")})`, "i")
    const startIdx = currentPage * itemsPerPage
    const endIdx = startIdx + itemsPerPage
    return datalist.slice(startIdx, endIdx).filter(data => {
      return regex.test(data)
    })
  }, [currentPage, keywords])

  const handlePageClick = useCallback(page => {
    console.log(page)
    setPage(page.selected)
  })
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <TextField
        id="outlined-search"
        label="Search field"
        type="search"
        margin="normal"
        variant="outlined"
      />
      <Container style={{ height: "80%" }}>
        <CardContainer>
          {filtered.map((data, i) => (
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
