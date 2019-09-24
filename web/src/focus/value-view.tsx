import React from 'react'
import Typography from '@material-ui/core/Typography'
import Markdown from 'react-markdown'
import ReactPlayer from 'react-player'

import { guessType } from './type-guesser'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      margin: `${theme.spacing(1)}px 0`,
      width: '100%'
    },
    link: {
      color: theme.palette.primary.light,
      textDecoration: 'underline'
    },
    root: {
      color: theme.palette.primary.contrastText
    },
    player: {
      margin: `${theme.spacing(1)}px 0`
    }
  })
)

const StyledMarkdown = ({
  className = null,
  source,
  preview = false
}) => {
  const classes = useStyles({})
  return (
    <div className={className || classes.root}>
      <Markdown
        source={source}
        disallowedTypes={preview ? ['link'] : []}
        unwrapDisallowed={preview}
      />
    </div>
  )
}

const StyledImage = ({ src }) => {
  const classes = useStyles({})
  return (
    <img className={classes.image} src={src} />
  )
}

const StyledPlayer = ({ url }) => {
  const classes = useStyles({})
  return (
    <ReactPlayer
      className={classes.player}
      url={url}
      width={'100%'}
    />
  )
}

const StyledLink = ({ url }) => {
  const classes = useStyles({})
  return (
    <a className={classes.link} href={url} target="_blank">
      {url}
    </a>
  )
}

export default (props: {
  className?: string,
  value: string,
  preview?: boolean
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
