import { useContext } from "react"
import LayoutContext from "./LayoutContext"

export default function useLayoutContext() {
  return useContext(LayoutContext)
}
