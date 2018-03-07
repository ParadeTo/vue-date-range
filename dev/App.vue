<template>
  <div id="app">
    <h1>Dev Mode</h1>
    <div class="container calendar">
      <h2>Calendar</h2>
      <calendar :syncDate.sync="date" :showLunar="true" />
    </div>
    <div class="container">
      <h2>DateRange</h2>
      <date-range />
    </div>
  </div>
</template>
<script>
  import {Calendar, DateRange} from '../src'
  import moment from 'moment'
  export default {
    components: {
      Calendar,
      DateRange
    },
    data() {
      return {
        date: moment()
      }
    },
    mounted () {
      setTimeout(() => {
        this.date = moment().add(1, "month")
      }, 1000)
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  #app {
    text-align: center;
  }
  .container {
    margin: 0 auto;
    max-width: 400px;
  }
</style>