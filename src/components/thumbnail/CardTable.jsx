/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, {
  useMemo,
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
} from "react"
import Container from "@material-ui/core/Container"
import TextField from "@material-ui/core/TextField"
import MediaCard from "./MediaCard"
import Paginator from "../others/Paginator"
import CardContainer from "./CardContainer"
import useRestoreComponentState from "../../contexts/useRestoreComponentState"

function CardTable({
  datalist = [],
  itemsPerPage = 4,
  CardComp = MediaCard,
  name,
  uri,
}) {
  const [currentPage, setPage] = useState(0)
  const [keywords, setKeywords] = useState("")
  const filtered = useMemo(() => {
    const regex = new RegExp(
      `(${keywords
        .trim()
        .split(/[.!?\s+-]/g)
        .join("|")})`,
      "i"
    )
    const filtered1 = datalist.filter(data => {
      return data.title && regex.test(data.title)
    })
    const filtered2 = datalist.filter(data => {
      return data.description && regex.test(data.description)
    })
    const filtered3 = datalist.filter(data => {
      return data.tags && data.tags.some(tag => regex.test(tag))
    })

    return [...new Set([...filtered1, ...filtered2, ...filtered3])]
  }, [keywords])
  const prevsItemsPerPage = useRef(itemsPerPage)
  const pageData = useMemo(() => {
    if (prevsItemsPerPage.current !== itemsPerPage) {
      setPage((currentPage * prevsItemsPerPage.current) / itemsPerPage)
      prevsItemsPerPage.current = itemsPerPage
    }
    const startIdx = currentPage * itemsPerPage
    const endIdx = startIdx + itemsPerPage
    return filtered.slice(startIdx, endIdx)
  }, [currentPage, filtered, itemsPerPage])

  const pageCount = useMemo(() => {
    return filtered.length / itemsPerPage
  }, [filtered, itemsPerPage])

  const handlePageClick = useCallback(page => {
    setPage(page.selected)
  })

  const onSearchFieldChange = useCallback(event => {
    const { value } = event.target
    setKeywords(value)
    setPage(0)
  })

  const stateHolder = useRef({ currentPage, keywords })
  stateHolder.current.currentPage = currentPage
  stateHolder.current.keywords = keywords

  const getCurrentState = useCallback(() => {
    const { currentPage, keywords } = stateHolder.current
    return {
      currentPage,
      keywords,
    }
  }, [])

  const historyState = useRestoreComponentState([uri, name], getCurrentState)

  useLayoutEffect(() => {
    if (historyState) {
      setKeywords(historyState.keywords || "")
      setPage(historyState.currentPage || 0)
    }
  }, [])

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        textAlign: "center",
      }}
    >
      {/* search bar */}
      <TextField
        label="Search"
        type="search"
        variant="outlined"
        onChange={onSearchFieldChange}
        value={keywords}
        style={{ marginLeft: "8px", marginRight: "8px" }}
        margin="dense"
      />

      <Container
        style={{
          height: itemsPerPage > 2 ? "90%" : "85%",
          marginTop: itemsPerPage > 2 ? "1%" : "0",
        }}
      >
        <CardContainer>
          {pageData.map((data, i) => (
            <CardComp
              key={i}
              style={{ height: itemsPerPage > 2 ? "45%" : "95%" }}
              title={data.title}
              description={data.description}
              image={data.image}
              onClick={data.onClick}
            />
          ))}
        </CardContainer>
      </Container>
      <Paginator
        style={{
          position: "absolute",
          bottom: "0",
          width: "100%",
        }}
        pageCount={pageCount}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
      />
    </div>
  )
}

export default CardTable
