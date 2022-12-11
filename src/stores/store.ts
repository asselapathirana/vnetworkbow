import { reactive, ref, computed, watch, onUnmounted } from "vue"
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import * as vNG from "v-network-graph"
import { buildLocaleContext } from "element-plus"

/* clear local storage for debugging */
//localStorage.clear();

/* //with this way of iterating it
for(var i=0, len=localStorage.length; i<len; i++) {
  var key = localStorage.key(i);
  var value = localStorage[key];
  console.log(key + " => " + value);
}
*/

export interface Node extends vNG.Node {
  selectable: boolean
  draggable: boolean
  size: number
  color: string
}

export const networkStore = defineStore('counter', () => {


  var clearLocalStorage =ref(false)
  /*
  onMounted(() => {
    window.addEventListener('keyup', onKeyPress)
  })
  */

  onUnmounted( () => {if (clearLocalStorage.value){
    console.log("Finally clearing local storage!".repeat(100))
    localStorage.clear()
    }
  })

  const zoomLevel = reactive(useLocalStorage("zoomLevel",3), { mergeDefaults: false })
  const snap = reactive(useLocalStorage("snap",true), { mergeDefaults: false })

  watch(snap, () => {
    location.reload()
  })

  const appearance = reactive( useLocalStorage("appearance",
  {
    escal:{color:'khaki',
            size:30, 
            height:30, 
            type:"rect",
          },
    empty:{color:'LightBlue',
          size:30, 
          height:30, 
          type:"rect",
        },
    hazard:{color:'red',
            size:15, 
            height:30, 
            type:"circle",
            },
    cause:{color:'blue',
            size:30, 
            height:30, 
            type:"rect",
            },
    effect:{color:'purple',
            size:30, 
            height:30, 
            type:"rect",
            },
    control:{color:'grey',
            size:10, 
            height:30, 
            type:"rect",
            },
  },
  { mergeDefaults: true }))


  
  const nextNodeIndex = computed(() => {
    var nl=Object.keys(nodes.value).map(id => parseInt(id.replace(/\D/g, ""))).filter(n=>!Number.isNaN(n))
    var ind = Math.max(...nl) +1 
    //console.log("ind:", ind)

    return ind
})

const nextEdgeIndex = computed(() => {
  var nl = Object.keys(edges.value).map(id => parseInt(id.replace(/\D/g, ""))).filter(n=>!Number.isNaN(n))
  var ind = Math.max(...nl) +1 
  //console.log("ind:", ind)
  //console.log("edges:", Object.keys(edges.value))
  return ind
})


  const nodes: Nodes = reactive(useLocalStorage('nodes',{
  //  N_1: { name: "Cause", selectable: true, draggable: true, kind:'cause',  id:"N-1"},
  //  FIXED: { name: "Hazard" , selectable: true, draggable: false, kind:'hazard' ,  id:"FIXED"},
  //  N_2: { name: "Effect" , selectable: true, draggable: true, kind:'effect' ,  id:"N-2"},
  //  N_3: { name: "Control 1" , selectable: true, draggable: true, kind:'control' ,  id:"N-3"},
  //  N_4: { name: "Control 2" , selectable: true, draggable: true, kind:'control' ,  id:"N-4"},
  }, { mergeDefaults: false }))
  
  const edges: vNG.Edges = reactive(useLocalStorage('edges',{
  //  edge1: { source: "N_1", target: "N_3" , width:2, color:"black"},
  //  edge2: { source: "N_3", target: "FIXED", width:2, color:"black"},
  //  edge3: { source: "FIXED", target: "N_4" , width:2, color:"black"},
  //  edge4: { source: "N_4", target: "N_2", width:2, color:"black"},
  }, { mergeDefaults: false } ))
  
  const layouts: vNG.Layouts = reactive(useLocalStorage('layouts',{
    nodes: {
    //  N_1: { x: -100, y: 100 },
    //  FIXED: { x: 0, y: 0 },
    //  N_2: { x: 100, y: 100 },
    //  N_3: {x: -50, y:50},
    //  N_4: {x: 50, y:50},
    },
  }, { mergeDefaults: false }))


  
  /* 
  1. In Node and Edge configuration, instead of concrete values,
  // you can specify functions that return a configuration value
  // with each node or edge as an argument.
  // In addition, custom types for Node and Edge can be explicitly
  // specified in `defineConfigs` to specify the argument types
  // for callback functions.
   2. But then we can not wrap the entire configs as useLocalStorage. Instead we only wrap hardcoded parts with useLocalStorage. 

  */

  function getkind(x){
    return (x.kind === undefined) ? "empty" : x.kind
  }

  const configs_view=reactive(useLocalStorage('configs_view',{
    scalingObjects: true,
    minZoomLevel: 0.1,
    maxZoomLevel: 16,
  }, { mergeDefaults: false } ))


  const configs = reactive(
    vNG.defineConfigs<Node, Edge>({
      node: {
        normal: {
          type: node => appearance.value[getkind(node)].type,
          radius: node => appearance.value[getkind(node)].size,
          color: node => appearance.value[getkind(node)].color,
          width: node => appearance.value[getkind(node)].size,
          height: node => appearance.value[getkind(node)].height
        },
        hover: {
          radius: node => appearance.value[getkind(node)].size + 2,
          color: node => appearance.value[getkind(node)].color,
        },
        label: useLocalStorage('configs_nodes_label',{
          visible: true,
          fontFamily: 'sans-serif',
          fontSize: 8,
          lineHeight: 1.1,
          color: "#000000",
          margin: 4,
          direction: "south",
          text: "name",
  
        }, { mergeDefaults: false }),
        focusring: useLocalStorage('configs_node_focusring',{
          color: "darkgray",
        }, { mergeDefaults: false }),
        selectable: node => node.selectable,
        draggable: node => node.draggable,
      },
      edge: useLocalStorage('configs_edge',{
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
      }, { mergeDefaults: false }),
    
      view: {
        scalingObjects: configs_view.value.scalingObjects,
        minZoomLevel: configs_view.value.minZoomLevel,
        maxZoomLevel: configs_view.value.maxZoomLevel,
        layoutHandler: snap.value? new vNG.GridLayout({grid: 15 }): new vNG.SimpleLayout()
      } ,
      
    })
  )

  const getLocalStorage = computed(() => {
    const ls={}
    for(var i=0;i<localStorage.length; i++) {
      var key = localStorage.key( i )
      ls[key]=JSON.parse(localStorage.getItem( key ) )
    }
    return ls
  })
  

  function setLocalStorage(jsonobj){
   var ls=JSON.parse(jsonobj)
   console.log("jsonobj:")
   window.localStorage.clear()
   for(const key in ls) {
      console.log("key:", key)
      const str=typeof ls[key]=="string"? ls[key]: JSON.stringify(ls[key])
      window.localStorage.setItem(key,str)
    } 
    console.log("Localstorage: ", window.localStorage)
    clearLocalStorage.value=true
    location.reload()
  }


  function loadFile(event) {
    
    var reader = new FileReader();
    reader.onload = function(event) {
      var textFromFileLoaded = reader.result
      setLocalStorage(textFromFileLoaded)
      
    }
    const txt=reader.readAsText(event.target.files[0]);  
    
  }

  function readExample(){
    
    fetch('/vnetworkbow//examples/bow_tie_template.json')
      .then(res => res.text())
      .then((out) => {
          console.log('Output: ', out);
          setLocalStorage(out)
  }).catch(err => console.error(err));
  
  }

  
  return {
    nodes,
    edges,
    layouts,
    configs,
    zoomLevel,
    getLocalStorage,
    setLocalStorage,
    nextNodeIndex,
    nextEdgeIndex,
    appearance,
    loadFile,
    snap,
    readExample,
  }
}, 


)
