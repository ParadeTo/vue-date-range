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
    // month is moment object
    props: ["moment", "date", "lang", "range"],
    computed: {
      month () {
        const { moment, lang } = this
        const monthIndex = moment.month()
        return locals[lang].months.abbr[monthIndex]
      },
      isSelected () {
        const { moment, date, range } = this
        if (range) {
          const { startDate, endDate } = range
          const diff1 = moment.diff(startDate, "months")
          const diff2 = moment.diff(endDate, "months")
          if (diff1 >= 0 && diff2 <= 0) {
            return !(diff2 === 0 && moment.month() !== endDate.month())
          }
          return false
        }
        if (date) {
          return date.format('YYYY-MM') === moment.format('YYYY-MM')
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "./_var.less";
  .month-cell {
    width: 25%;
    height: 33.33%;
  }
</style>
