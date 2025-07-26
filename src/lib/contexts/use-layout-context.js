import { useContext } from "react"
import LayoutContext from "./layout-context"

export default function useLayoutContext() {
  return useContext(LayoutContext)
}
