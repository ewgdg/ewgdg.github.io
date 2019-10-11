/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import PersistedLayout from "./src/components/layouts/PersistedLayout"

export default ({ element, props }) => {
  return <PersistedLayout {...props}>{element}</PersistedLayout>
}
