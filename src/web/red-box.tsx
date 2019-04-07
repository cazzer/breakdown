import React from 'react'

export const RedBox = (Component: React.ComponentType) => (
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

  return <Component {...props} />
}
