import React from 'react'
import { Typography } from '@material-ui/core';

export const RedBox = (component) => (
  props: React.Props<Object>
) => {
  if (props.loading) {
    return <div>Loading...</div>
  }

  if (props.error) {
    return (
      <pre>{props.error.message}</pre>
    )
  }

  return <component {...props} />
}
