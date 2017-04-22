<style lang="less" src="./style.less"></style>
<template>
    <div class="vue-html5-editor" :style="{'z-index':zIndex}" :class="{'full-screen':fullScreen}">
        <div class="toolbar" :style="{'z-index':zIndex+1}" ref="toolbar">
            <ul>
                <template v-for="module in modules">
                    <li v-if="module.show" :title="locale[module.i18n]"
                        @click="activeModule(module)">
                        <span class="icon" :class="module.icon"></span>
                    </li>
                </template>
            </ul>
            <div class="dashboard" v-show="dashboard" :style="dashboardStyle">
                <div v-if="dashboard" :is="dashboard" keep-alive></div>
            </div>
        </div>
        <div class="content" ref="content" contenteditable="true"
             @click="toggleDashboard(dashboard)"
             v-html="content"
             @input="onInput"
             :style="contentStyle"></div>
    </div>
</template>
<script>
    export default {
        props: {
            value: String,
            height: {
                type: Number,
                default: 300,
                validator (val) {
                    return val >= 300
                }
            },
            zIndex: {
                type: Number,
                default: 1000
            },
            autoHeight: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                //locale: {},
                fullScreen: false,
                dashboard: null,
                dashboardStyle: {},
            }
        },
        watch: {
            dashboard(val){
                if (val) {
                    this.computeDashboardStyle()
                }
            },
            fullScreen(val){
                let component = this
                component.$nextTick(function () {
                    component.computeDashboardStyle()
                })
                if (val) {
                    component.parentEl = component.$el.parentNode
                    component.nextEl = component.$el.nextSibling
                    component.$appendTo(document.body)
                    return
                }
                if (component.nextEl) {
                    component.$before(component.nextEl)
                    return
                }
                component.$appendTo(component.parentEl)
            }
        }
        ,
        computed: {
            contentStyle(){
                let style = {}
                if (this.fullScreen) {
                    style.height = window.innerHeight - (this.$refs.toolbar.clientHeight + 1) + "px"
                    return style
                }
                if (!this.autoHeight) {
                    style.height = this.height + 'px'
                    return style
                }
                style["min-height"] = this.height + 'px'
                return style
            },
            content: {
                get() {
                    return this.value;
                },
                set(val) {
                  console.log(val);
                    let content = this.$refs.content.innerHTML
                    if (val != content) {
                      this.$refs.content.innerHTML = val
                    }
                    this.$emit('input', val)
                },
            },
        },
//        watch: {
//            value(val, oldVal) {
//                if (val !== oldVal) this.content = val;
//            },
//            content(val, oldVal) {
//              if (val !== oldVal) this.$emit('input', val);
//            }
//        },
        methods: {
            onInput(e) {
              this.saveCurrentRange()
              this.content = e.target.innerHTML
              this.$nextTick(() => {
                this.restoreSelection()
              })
            },
            computeDashboardStyle(){
                this.dashboardStyle = {'max-height': this.$refs.content.clientHeight + 'px'}
            },
            getContentElement(){
                return this.$refs.content
            },
            toggleFullScreen(){
                this.fullScreen = !this.fullScreen
            },
            toggleDashboard(dashboard){
                this.dashboard == dashboard ? this.dashboard = null : this.dashboard = dashboard
            },
            execCommand(command, arg){
                this.restoreSelection()
                document.execCommand(command, false, arg)
                this.content = this.$refs.content.innerHTML
                this.dashboard = null
            },
            getCurrentRange(){
                return this.range
            },
            saveCurrentRange(){
                let selection = window.getSelection ? window.getSelection() : document.getSelection()
                let range = selection.rangeCount ? selection.getRangeAt(0) : null
              console.log(range);
                if (!range) {
                    return
                }
                if (this.$refs.content.contains(range.startContainer) &&
                        this.$refs.content.contains(range.endContainer)) {
                    this.range = range
                }
            },
            restoreSelection(){
                let selection = window.getSelection ? window.getSelection() : document.getSelection()
                selection.removeAllRanges()
                if (this.range) {
                    selection.addRange(this.range)
                } else {
                    let content = this.$refs.content
                    let div = document.createElement("div")
                    let range = document.createRange()
                    content.appendChild(div)
                    range.setStart(div, 0)
                    range.setEnd(div, 0)
                    selection.addRange(range)
                }
            },
            activeModule(module){
                if (typeof module.handler == "function") {
                    module.handler(this)
                    return
                }
                if (module.hasDashboard) {
                    this.toggleDashboard('dashboard-' + module.name)
                }
            }
        },
        compiled(){
            let editor = this
            editor.modules.forEach(function (module) {
                if (typeof module.init == "function") {
                    module.init(editor)
                }
            })
        },
        mounted() {
          this.$nextTick(() => {
            let component = this
            let content = component.$refs.content
            content.addEventListener("mouseup", component.saveCurrentRange, false)
          content.addEventListener("keyup", component.saveCurrentRange, false)
          content.addEventListener("mouseout", component.saveCurrentRange, false)
          content.addEventListener("keyup", function () {
            component.content = component.$refs.content.innerHTML
          }, false)
          component.touchHandler = function (e) {
            if (component.$refs.content.contains(e.target)) {
              component.saveCurrentRange()
            }
          }
          window.addEventListener("touchend", component.touchHandler, false)
          })
        },
        beforeDestroy(){
            let editor = this
            window.removeEventListener("touchend", editor.touchHandler)
            editor.modules.forEach(function (module) {
                if (typeof module.destroyed == "function") {
                    module.destroyed(editor)
                }
            })
        }
    }
</script>
