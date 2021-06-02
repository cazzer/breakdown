import React from 'react'
import PropTypes from 'prop-types'
import 'beautiful-react-diagrams/styles.css'
import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams'

const elementSize = 200
const elementMargin = 34

const CustomComponentMapper = (Element) => (props: {
  data?: any,
}) => (
  <Element
    actions={props.data?.actions}
    label={props.data?.label}
  />
)

function calculateDepth(id, parentMap, depthMap) {
  const parentId = parentMap[id]
  if (!parentId) {
    return 0
  }

  if (depthMap[parentId]) {
    return depthMap[parentId] + 1
  }

  return calculateDepth(parentId, parentMap, depthMap) + 1
}

export function calculateDepths(items): { [id: string]: number } {
  const itemsWithDepths = []
  let parentMap = {}
  for (const item of items) {
    parentMap[item.id] = item.parent
  }

  let depthMap = {}
  for (const itemId in parentMap) {
    depthMap[itemId] = calculateDepth(itemId, parentMap, depthMap)
  }

  return depthMap
}

export function calculateDimensions(links, depth, size) {

  return {
    coodinates: {},
    height: 0,
    width: depth * size
  }
}

export function extendItemsWithDepths(items, depths) {
  return items.map(item => ({
    ...item,
    depth: depths[item.id]
  }))
}

function createNodes(items: Array<any>, element?: any) {
  let childPosition = elementMargin
  const Element = element ? CustomComponentMapper(element) : null

  // const depths = calculateDepths(items)
  // const itemsWithDepths = extendItemsWithDepths(items, depths)

  const links = []
  const childCount = items.filter(item => !!item.parent).length
  const nodes = items.map(item => {
    if (item.parent) {
      links.push({
        input: item.parent,
        output: item.id
      })
    }

    let coordinates
    if (item.parent) {
      coordinates = [childPosition, elementSize + elementMargin * 2]
      childPosition += (elementSize + elementMargin)
    } else {
      coordinates = [((childCount - 1) * (elementSize + elementMargin)) / 2 + elementMargin, elementMargin]
    }

    return {
      id: item.id,
      content: item.label,
      coordinates,
      data: {
        ...item
      },
      render: Element
    }
  })

  const maxWidth = Object.values(links.reduce((widths, link) => ({
      [link.parent]: (widths[link.parent] || 0) + 1
    }), {})
  )

  return createSchema({
    nodes,
    links
  })
}

export default function Tree({
  element,
  items
}: {
  element?: PropTypes.ReactElementLike
  items: Array<any>
}) {
  const nodes: any = createNodes(items, element)
  const [schema, { onChange }] = useSchema(nodes)
  const maxDepth = Math.max(...nodes.nodes.map(node => node.data.depth)) + 1

  return (
    <div style={{ height: `${maxDepth * (elementSize + elementMargin)}px` }}>
      <Diagram schema={schema} onChange={onChange} />
    </div>
  )
}
