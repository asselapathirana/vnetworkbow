import { reactive, ref, computed } from "vue"
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import * as vNG from "v-network-graph"

export interface Node extends vNG.Node {
  selectable: boolean
  draggable: boolean
  size: number
  color: string
}

export const networkStore = defineStore('counter', () => {

  const nodes: Nodes = reactive(useStorage('nodes',{
    node1: { name: "N1", selectable: true, draggable: true, size: 15, width: 30, height:15, color: "blue", type:"rect", id:"node1"},
    FIXED: { name: "N2" , selectable: true, draggable: false, size: 15, width: 30, height:15, color: "red", type:"circle", id:"FIXED"},
    node3: { name: "N3" , selectable: true, draggable: true, size: 15, width: 30, height:15, color: "blue", type:"rect", id:"node3"},
  }))
  
  const edges: vNG.Edges = reactive(useStorage('edges',{
    edge1: { source: "node1", target: "FIXED" , width:2, color:"black"},
    edge2: { source: "FIXED", target: "node3", width:2, color:"black"},
  }))
  
  const layouts: vNG.Layouts = reactive(useStorage('layouts',{
    nodes: {
      node1: { x: -50, y: 50 },
      FIXED: { x: 0, y: 0 },
      node3: { x: 50, y: 50 },
    },
  }))


  
  /* 
  1. In Node and Edge configuration, instead of concrete values,
  // you can specify functions that return a configuration value
  // with each node or edge as an argument.
  // In addition, custom types for Node and Edge can be explicitly
  // specified in `defineConfigs` to specify the argument types
  // for callback functions.
   2. But then we can not wrap the entire configs as useStorage. Instead we only wrap hardcoded parts with useStorage. 

  */

  const configs = reactive(
    vNG.defineConfigs<Node, Edge>({
      node: {
        normal: {
          type: node => node.type,
          radius: node => node.size, // Use the value of each node object
          color: node => node.color,
          width: node => node.width,
          height: node => node.height
        },
        hover: {
          radius: node => node.size + 2,
          color: node => node.color,
        },
        label: useStorage('configs_nodes_label',{
          visible: true,
          fontFamily: undefined,
          fontSize: 11,
          lineHeight: 1.1,
          color: "#000000",
          margin: 4,
          direction: "south",
          text: "name",
  
        }),
        focusring: useStorage('configs_node_focusring',{
          color: "darkgray",
        }),
        selectable: node => node.selectable,
        draggable: node => node.draggable,
      },
      edge: useStorage('configs_edge',{
        selectable: true,
        normal: {
          width: 3,
          color: "#4466cc",
          dasharray: "0",
          linecap: "butt",
          animate: false,
          animationSpeed: 50,
        },
        hover: {
          width: 4,
          color: "#3355bb",
          dasharray: "0",
          linecap: "butt",
          animate: false,
          animationSpeed: 50,
        },
        selected: {
          width: 3,
          color: "#dd8800",
          dasharray: "6",
          linecap: "round",
          animate: false,
          animationSpeed: 50,
        },
        gap: 5,
        type: "straight",
        margin: 2,
        marker: {
          source: {
            type: "none",
            width: 4,
            height: 4,
            margin: -1,
            units: "strokeWidth",
            color: null,
          },
          target: {
            type: "arrow",
            width: 4,
            height: 4,
            margin: -1,
            units: "strokeWidth",
            color: null,
          },
        },
      }),
    
      view: useStorage('configs_view',{
        scalingObjects: true,
        minZoomLevel: 0.1,
        maxZoomLevel: 16,
      }),
      
    })
  )
  

  return {
    nodes,
    edges,
    layouts,
    configs,
  }
})
