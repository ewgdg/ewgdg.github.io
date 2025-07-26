/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, {
  useMemo,
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react"
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"

import MediaCard from "./MediaCard"
import Paginator from "../others/Paginator"
import CardDivision from "./CardDivision"
import useRestoreComponentStateToBeforeUnmounting from "../../contexts/useRestoreComponentState"
// import SlideInSection from "../sections/SlideInSection"
import { debounce } from "../../utils/throttle"
import FadeInSection from "../sections/FadeInSection"

function CardTable({
  datalist = [],
  itemsPerPage = 4,
  CardComp = MediaCard,
  name,
  uri,
}) {
  const [currentPage, setPage] = useState(0)
  const [keywords, setKeywords] = useState("")
  const [filtered, setFiltered] = useState(datalist)
  const debouncedFilterRef = useRef()
  const filterRef = useRef()

  // Create debounced filter function
  useEffect(() => {
    filterRef.current = (keywordsCopy) => {
      let newFiltered
      if (keywordsCopy) {
        const regex = new RegExp(
          `(${keywordsCopy
            .trim()
            .split(/[.!?,&^%$#@()+-]/g)
            .reduce(
              (accum, current, idx, arr) =>
                `${accum}\\b${current.trim()}${idx < arr.length - 1 ? "|" : ""
                }`,
              ""
            )})`,
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

        newFiltered = [
          ...new Set([...filtered1, ...filtered2, ...filtered3]),
        ].sort(
          (a, b) =>
            Date.parse(b.publicationDate) - Date.parse(a.publicationDate)
        )
      } else {
        newFiltered = datalist
      }

      setPage(0)
      setFiltered(newFiltered)
    }
    debouncedFilterRef.current = debounce(filterRef.current, 300)
    return () => {
      debouncedFilterRef.current = null
      filterRef.current = null
    }
  }, [datalist])

  // Apply filter when keywords change
  useEffect(() => {
    if (debouncedFilterRef.current) {
      debouncedFilterRef.current(keywords)
    }
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

  // mem the component to prevent refresh the animation
  const calculateDisplayedComponent = useCallback((pageData, itemsPerPage) => {
    return (
      <CardDivision>
        {pageData.map(data => (
          <CardComp
            key={data.title}
            style={{ height: itemsPerPage > 2 ? "45%" : "95%" }}
            title={data.title}
            description={data.description}
            image={data.image}
            onClick={data.onClick}
          />
        ))}
      </CardDivision>
    )
  }, [])
  const [displayedComponent, setDisplayedComponent] = useState(null)
  useLayoutEffect(() => {
    setDisplayedComponent(calculateDisplayedComponent(pageData, itemsPerPage))
  }, [currentPage, filtered, itemsPerPage, calculateDisplayedComponent, pageData])

  const pageCount = useMemo(() => {
    return filtered.length / itemsPerPage
  }, [filtered, itemsPerPage])

  const handlePageClick = useCallback(page => {
    setPage(page.selected)
  }, [])

  const onSearchFieldChange = useCallback(event => {
    if (!event.target) return
    const { value } = event.target
    setKeywords(value)
  }, [])

  const stateContainer = useRef({ currentPage, keywords })
  stateContainer.current.currentPage = currentPage
  stateContainer.current.keywords = keywords

  const getCurrentState = useCallback(() => {
    const { currentPage, keywords } = stateContainer.current
    return {
      currentPage,
      keywords,
    }
  }, [])

  const historyState = useRestoreComponentStateToBeforeUnmounting([uri, name], getCurrentState)

  useLayoutEffect(() => {
    if (historyState) {
      // Restore state from history
      const keywords = historyState.keywords || ""
      stateContainer.current = {
        currentPage: historyState.currentPage || 0,
        keywords,
      }
      setKeywords(keywords)
      // immediately filter with the restored keywords
      if (filterRef.current) {
        filterRef.current(keywords)
      }
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
        <FadeInSection style={{ height: "100%" }}>
          {displayedComponent}
        </FadeInSection>
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
