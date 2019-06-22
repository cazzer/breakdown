import React from 'react'
import Typography from '@material-ui/core/Typography'
import Markdown from 'react-markdown'
import ReactPlayer from 'react-player'

import { guessType } from './type-guesser'
import { withStyles } from '@material-ui/core'

const StyledMarkdown = withStyles(theme => ({
  root: {
    color: theme.palette.primary.contrastText
  }
}))(({ classes, className, source, preview = false }) => (
  <div className={className || classes.root}>
    <Markdown
      source={source}
      disallowedTypes={preview ? ['link'] : []}
      unwrapDisallowed={preview}
    />
  </div>
))
const StyledImage = withStyles(theme => ({
  image: {
    margin: `${theme.spacing(1)}px 0`,
    width: '100%'
  }
}))(({ classes, src}) => (
  <img className={classes.image} src={src} />
))

const StyledPlayer = withStyles(theme => ({
  root: {
    margin: `${theme.spacing(1)}px 0`,
  }
}))(({ classes, url }) => (
  <ReactPlayer
    className={classes.root}
    url={url}
    width={'100%'}
  />
))

const StyledLink = withStyles(theme => ({
  root: {
    color: theme.palette.primary.contrastText,
    textDecoration: 'underline'
  }
}))(({ classes, url }) => (
  <a className={classes.root} href={url} target="_blank">
    {url}
  </a>
))

export default (props: {
  className: String,
  label: String,
  value: String,
  preview?: Boolean
}) => {
  const type = guessType(props.value)
  switch (type) {
    case 'image':
      return <StyledImage src={props.value} />
    case 'markdown':
      return <StyledMarkdown source={props.value} {...props} />
    case 'video':
      return <StyledPlayer url={props.value} />
    case 'link':
      return <StyledLink url={props.value} />
    default:
      return <Typography color="textSecondary">{props.value}</Typography>
  }
}
