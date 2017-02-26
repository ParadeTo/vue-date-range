<template>
  <span class="ayou-day-cell" @click="handleDayClick">
    <span :class="{'selected': isSelected, 'passive': day.isPassive, 'in-range': isInRange}">{{day.dayMoment.date()}}</span>
  </span>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      day: {
        type: Object
      },
      isSelected: {
        type: Boolean,
        default: false
      },
      isInRange: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleDayClick() {
        if (this.day.isPassive) return;
        this.$emit('dayClick', this.day);
      }
    }
  };
</script>
<style lang="less" rel="stylesheet/less">
  .ayou-day-cell {
    padding: 2px 0;
    width: 14.28%;
    display: inline-block;
    font-size: 1rem;
    text-align: center;
    span {
      display: inline-block;
      width: 2.6rem;
      height: 2.6rem;
      line-height: 2.7rem;
      &.selected, &.in-range {
        border-radius: 50%;
        background-color: #4790E0;
        color: #fff;
      }
      &.passive {
        color: #f0f0f0;
        &.in-range {
          opacity: 0.4;
        }
        &.selected {
          opacity: 0.4;
        }
      }
    }
  }
</style>
