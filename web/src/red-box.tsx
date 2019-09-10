import React from 'react'
import { CubeLoader } from './loading'

export const RedBox = (Component: React.ComponentType) => (
  props: {
    error: string,
    loading: boolean
  }
) => {
  if (props.loading) {
    return <CubeLoader />
  }

  if (props.error) {
    return (
      <pre>{props.error.message}</pre>
    )
  }

  return <Component {...props} />
}
