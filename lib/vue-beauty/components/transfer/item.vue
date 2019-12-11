<script>
export default {
  props: {
    item: {},
    value: { type: Boolean, default: false },
    render: {}
  },
  render (h) {
    const vm = this
    // 勾选的动作应该在外面拿到第四个参数 vmItem.$emit('check', item)
    return vm.render(h, vm.item, vm.value, vm)
  }
}
</script>
