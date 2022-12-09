import { createApp } from 'vue'
import { createPinia } from 'pinia'

//import './assets/main.css'
import './assets/base.css'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'

//////////////////////////////////////////////

import "element-plus/theme-chalk/src/index.scss"

import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"

import DemoTabs from "./components/docs_c/DemoTabs.vue" 
import SliderZoom from "./components/docs_c/SliderZoom.vue"
import ColorPicker from "./components/docs_c/ColorPicker.vue"
import BoxSelectionPanel from "./components/docs_c/BoxSelectionPanel.vue"
import NodeConfigPanel from "./components/docs_c/NodeConfigPanel.vue"
import LabelConfigPanel from "./components/docs_c/LabelConfigPanel.vue"
import LabelBackgroundConfigPanel from "./components/docs_c/LabelBackgroundConfigPanel.vue"
import FocusConfigPanel from "./components/docs_c/FocusConfigPanel.vue"
import EdgeConfigPanel from "./components/docs_c/EdgeConfigPanel.vue"
import MultipleEdgeConfigPanel from "./components/docs_c/MultipleEdgeConfigPanel.vue"
import EdgeMarkerConfigPanel from "./components/docs_c/EdgeMarkerConfigPanel.vue"
import EdgeMarginGapConfigPanel from "./components/docs_c/EdgeMarginGapConfigPanel.vue"
import SummarizedEdgeLabelConfigPanel from "./components/docs_c/SummarizedEdgeLabelConfigPanel.vue"
import EdgeSelfLoopPanel from "./components/docs_c/EdgeSelfLoopPanel.vue"
import PathConfigPanel from "./components/docs_c/PathConfigPanel.vue"
import PathStrokeConfigPanel from "./components/docs_c/PathStrokeConfigPanel.vue"
import GridPanel from "./components/docs_c/GridPanel.vue"

import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElColorPicker,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect,
  ElSlider,
  ElTabs,
  ElTabPane,
  ElIcon,
  ElUpload,
} from "element-plus"

////////////////////////////////////////////////////////////////////////


const app = createApp(App)

app.use(createPinia())
app.use(VNetworkGraph)
app.use(ElementPlus)
///////////////////////////////////////////////////////////////////////////
app.component("el-button", ElButton)
app.component("el-card", ElCard)
app.component("el-checkbox", ElCheckbox)
app.component("el-color-picker", ElColorPicker)
app.component("el-input", ElInput)
app.component("el-input-number", ElInputNumber)
app.component("el-option", ElOption)
app.component("el-select", ElSelect)
app.component("el-slider", ElSlider)
app.component("el-tabs", ElTabs)
app.component("el-tab-pane", ElTabPane)
app.component("el-icon", ElIcon)

// custom components
app.component("demo-tabs", DemoTabs)
app.component("el-slider-custom-zoom", SliderZoom)
app.component("el-color-picker-custom", ColorPicker)
app.component("demo-box-selection-panel", BoxSelectionPanel)
app.component("demo-node-config-panel", NodeConfigPanel)
app.component("demo-label-config-panel", LabelConfigPanel)
app.component("demo-label-background-config-panel", LabelBackgroundConfigPanel)
app.component("demo-focus-config-panel", FocusConfigPanel)
app.component("demo-edge-config-panel", EdgeConfigPanel)
app.component("demo-multiple-edge-config-panel", MultipleEdgeConfigPanel)
app.component("demo-edge-marker-config-panel", EdgeMarkerConfigPanel)
app.component("demo-edge-margin-gap-config-panel", EdgeMarginGapConfigPanel)
app.component(
  "demo-summarized-edge-label-config-panel",
  SummarizedEdgeLabelConfigPanel
)
app.component("demo-edge-self-loop-config-panel", EdgeSelfLoopPanel)
app.component("demo-path-config-panel", PathConfigPanel)
app.component("demo-path-stroke-config-panel", PathStrokeConfigPanel)
app.component("demo-grid-panel", GridPanel)

/////////////////////////////////////////////////////////////////////



app.mount('#app')
import "bootstrap/dist/js/bootstrap.js"