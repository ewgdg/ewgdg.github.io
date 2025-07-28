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

import MediaCard from "./media-card"
import Paginator from "../others/paginator"
import CardDivision from "./card-division"
import { useRestoreComponentStateToBeforeRouting } from "../../lib/contexts/use-restore-component-state"
// import SlideInSection from "../sections/SlideInSection"
import { debounce } from "../../lib/performance/throttle"
import FadeInSection from "../sections/fade-in-section"

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
    let prevKeywords = ""
    filterRef.current = (keywordsCopy) => {
      if (keywordsCopy === prevKeywords) return
      // If the keywords are the same as the previous
      prevKeywords = keywordsCopy
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

      setFiltered(newFiltered)
      setPage(0) // Reset to first page on filter change
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

  useEffect(() => {
    if (prevsItemsPerPage.current !== itemsPerPage) {
      setPage(Math.floor((currentPage * prevsItemsPerPage.current) / itemsPerPage))
      prevsItemsPerPage.current = itemsPerPage
    }
  }, [itemsPerPage, currentPage])

  const pageData = useMemo(() => {
    const startIdx = currentPage * itemsPerPage
    const endIdx = startIdx + itemsPerPage
    return filtered.slice(startIdx, endIdx)
  }, [currentPage, filtered, itemsPerPage])

  // mem the component to prevent refresh the animation
  const displayedComponent = useMemo(() => {
    return (
      <CardDivision>
        {pageData.map(data => (
          <CardComp
            key={data.title}
            style={{ height: itemsPerPage > 2 ? "45%" : "90%" }}
            title={data.title}
            description={data.description}
            image={data.image}
            onClick={data.onClick}
          />
        ))}
      </CardDivision>
    )
  }, [pageData, itemsPerPage, CardComp])

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

  const historyState = useRestoreComponentStateToBeforeRouting([uri, name], getCurrentState)
  const isRestoredRef = useRef(false) 

  useEffect(() => {
    if (isRestoredRef.current) return
    isRestoredRef.current = true
    if (!historyState) return

    // Restore state from history only if different
    const restoredKeywords = historyState.keywords || ""
    const restoredPage = historyState.currentPage || 0

    setKeywords(restoredKeywords)
    stateContainer.current.keywords = restoredKeywords
    setPage(restoredPage)
    stateContainer.current.currentPage = restoredPage

  }, [historyState])

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
          height: itemsPerPage > 2 ? "85%" : "80%",
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
