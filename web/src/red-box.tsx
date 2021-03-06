import React from 'react'
import { CubeLoader } from './loading'

interface RedBoxProps {
  error: any,
  loading: boolean,
  [key: string]: any
}

export const RedBox = (Component: React.ComponentType<any>) => (
  props: RedBoxProps
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
