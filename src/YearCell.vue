<template>
  <span class="v-date-cell v-date-year-cell" :class="{'v-date-selected': isSelected}">
    <span class="v-date-cell-text">
      {{ year }}
    </span>
  </span>
</template>
<script type="text/ecmascript-6">
  import locals from './locals.js'

  export default {
    props: ["year", "date", "range"],
    computed: {
      isSelected () {
        const { date, year, range } = this
        if (range) {
          const { startDate, endDate } = range
          const startYear = startDate.year()
          const endYear = endDate.year()
          return Number(year) >= startYear && Number(year) <= endYear
        }
        if (date) {
          return date.year() === Number(year)
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "./_var.less";
  .v-date-year-cell {
    width: 25%;
    height: 33.33%;
  }
</style>
