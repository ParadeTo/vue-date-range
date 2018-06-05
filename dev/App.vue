<template>
  <div id="app">
    <h1>Dev Mode</h1>
    <div class="container calendar">
      <h2>Calendar</h2>
      <p>{{date.format("YYYY-MM-DD")}}</p>
      <calendar class="calendar" :openTransition="true" :dayOfMonthProp="dayOfMonth" :lang="lang" :syncDate.sync="date" :showLunar="true" />
    </div>
    <div class="container">
      <h2>DateRange</h2>
      <p>{{range.startDate.format("YYYY-MM-DD")}} ~ {{range.endDate.format("YYYY-MM-DD")}}</p>
      <date-range :openTransition="true" :showLunar="true" :emitChangeOnStep0="true" class="calendar" :lang="lang" v-model="range"/>
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
        date: moment(),
        dayOfMonth: moment().add(-1, "months"),
        range: {
          startDate: moment("2008-03-08"),
          endDate: moment("2008-03-10")
        },
        lang: 'zh'
      }
    },
    mounted () {
//      setTimeout(() => {
//        this.date = moment().add(1, "month")
//      }, 1000)
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  #app {
    text-align: center;
  }
  .container {
    margin: 2rem auto;
    max-width: 400px;
    .calendar {
      border: 1px solid #aaa;
    }
  }
</style>