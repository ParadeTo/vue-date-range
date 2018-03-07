<template>
  <span class="cell month-cell" :class="{'selected': isSelected}">
    <span class="cell-text">
      {{ month }}
    </span>
  </span>
</template>
<script type="text/ecmascript-6">
  import locals from './locals.js'

  export default {
    props: ["monthIndex", "date", "lang"],
    computed: {
      month () {
        const { monthIndex, lang } = this
        return locals[lang].months.abbr[monthIndex]
      },
      isSelected () {
        const { monthIndex, date } = this
        return date.month() === Number(monthIndex)
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "./_var.less";

  .ayou-day-cell {

  }
</style>
