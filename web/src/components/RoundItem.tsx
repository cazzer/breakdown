import React, {  useState } from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'

const transitionRight = {
  0: [0, 0],
  1: [-16, -20],
  2: [-12, -16],
  3: [4, 0]
}

const defaultTransitionDuration = 100

const RoundButton = styled.div`
  width: 200px;
  height: 200px;
  background-color: gray;
  border-radius: 100px;
  color: white;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .slide-right {
    right: ${props => transitionRight[props.rightActionCount || 0][1]}px;
  }

  .slide-right.enter {
    opacity: 0;
    right: ${props => transitionRight[props.rightActionCount || 0][0]}px;
  }
  .slide-right.enter-active {
    opacity: 1;
    transition: all linear ${defaultTransitionDuration}ms;
    right: ${props => transitionRight[props.rightActionCount || 0][1]}px;
  }
  .slide-right.exit {
    opacity: 1;
    right: ${props => transitionRight[props.rightActionCount || 0][1]}px;
  }
  .slide-right.exit-active {
    opacity: 0;
    transition: all linear ${defaultTransitionDuration}ms;
    right: ${props => transitionRight[props.rightActionCount || 0][0]}px;
  }
`

const Label = styled.div`
`

const Action = styled.button`
  margin: 4px 0;
  width: 54px;
  height: 54px;
  border-radius: 27px;
  border: none;
  position: relative;
`

const ActionGroup = styled.div`
  height: 100%;
  width: 54px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${Action}:nth-child(2)${Action}:last-child {
    right: 0;
  }

  ${Action}:nth-child(2) {
    right: -20px;
  }
`

export type Action = {
  callback?: Function
  icon?: string
  label: string
  link?: string
  position?: 'bottom' | 'right'
}

export default function RoundItem({
  label,
  actions
}: {
  label: string
  actions?: Array<Action>
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const mouseOver = () => {
    setIsOpen(true)
  }

  const mouseOut = () => {
    setIsOpen(false)
  }

  const rightActions = actions.filter(
    action => !action.position || action.position === 'right'
  )

  const bottomActions = actions.filter(
    action => action.position === 'bottom'
  )

  return (
    <RoundButton
      rightActionCount={rightActions ? rightActions.length : 0}
      bottomActionCount={bottomActions ? bottomActions.length : 0}
      onMouseOver={mouseOver}
      onMouseLeave={mouseOut}
    >
      <Label>{label}</Label>
      {rightActions && (
        <CSSTransition
          in={isOpen}
          className="slide-right"
          unmountOnExit
          timeout={defaultTransitionDuration}
        >
          <ActionGroup>
            {rightActions.map(action => (
              <Action key={action.label}>{action.label}</Action>
            ))}
          </ActionGroup>
        </CSSTransition>
      )}
      {bottomActions && (
        <CSSTransition
          in={isOpen}
          className="slide-right"
          unmountOnExit
          timeout={defaultTransitionDuration}
        >
          <ActionGroup>
            {bottomActions.map(action => (
              <Action key={action.label}>{action.label}</Action>
            ))}
          </ActionGroup>
        </CSSTransition>
      )}
    </RoundButton>
  )
}
