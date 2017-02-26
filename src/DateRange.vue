<template>
  <div class="ayou-date-range" v-show="show">
    <calendar :range="rangeData" @change="onChange"></calendar>
  </div>
</template>
<script type="text/ecmascript-6">
  import moment from 'moment';
  import Calendar from './Calendar.vue';

  export default {
    components: {
      Calendar
    },
    props: {
      show: {
        type: Boolean,
        default: true
      },
      range: {
        type: Object
      }
    },
    data() {
      return {
        rangeData: this.range || {
          startDate: null,
          endDate: null
        },
        step: 0
      };
    },
    methods: {
      onChange(dayMoment) {
        switch (this.step) {
          case 0:
            this.rangeData['startDate'] = dayMoment;
            this.rangeData['endDate'] = dayMoment;
            this.step = 1;
            break;

          case 1:
            this.rangeData['endDate'] = dayMoment;
            this.step = 0;
            this.emitChange();
            break;
        }
      },
      emitChange() {
        const sTs = this.rangeData.startDate.unix();
        const eTs = this.rangeData.endDate.unix();
        const startDate = sTs <= eTs ? this.rangeData.startDate : this.rangeData.endDate;
        const endDate = sTs > eTs ? this.rangeData.startDate : this.rangeData.endDate;
        this.$emit('change', {startDate, endDate});
      }
    }
  };
</script>
<style lang="less" rel="stylesheet/less">
  .ayou-date-range-footer {
    height: 3rem;
    line-height: 3rem;
    background-color: #fff;
    text-align: right;
    padding: 0 2rem;
    button {
      color: #ff4383;
      background-color: transparent;
      margin-left: 2rem;
    }
  }
</style>
