<template>
  <div id="app">
    <h1>Dev Mode</h1>
    <div class="container calendar">
      <h2>Calendar</h2>
      <calendar />
    </div>
    <div class="container">
      <h2>DateRange</h2>
      <date-range />
    </div>
  </div>
</template>
<script>
  import {Calendar, DateRange} from '../src'
  export default {
    components: {
      Calendar,
      DateRange
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