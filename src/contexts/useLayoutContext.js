import LayoutContext from "contexts/LayoutContext"
import { useContext } from "react"

export default function useLayoutContext() {
  return useContext(LayoutContext)
}
