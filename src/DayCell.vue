<template>
  <span class="ayou-day-cell">
    <div class="solar" :class="{'selected': isSelected, 'passive': day.isPassive, 'in-range': isInRange}">{{day.dayMoment.date()}}</div>
    <div class="lunar" :class="{'passive': day.isPassive, 'festival': isFestival}" v-if="showLunar">
      {{lunarText}}
    </div>
  </span>
</template>
<script type="text/ecmascript-6">
  import transformer from './solar_lunar'

  export default {
    props: {
      showLunar: {
        type: Boolean,
        default: false
      },
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
      handleDayClick () {
        if (this.day.isPassive) return
        this.$emit('dayClick', this.day)
      }
    },
    data () {
      return {
        lunar: this.solar2lunar(this.day)
      }
    },
    watch: {
      day (val) {
        this.lunar = this.solar2lunar(val)
      }
    },
    methods: {
      solar2lunar (day) {
        return transformer.solar2lunar(day.dayMoment.year(), day.dayMoment.month() + 1, day.dayMoment.date())
      }
    },
    computed: {
      lunarText () {
        return this.lunar && (this.lunar.calendarFestivals || this.lunar.lunarFestivals || this.lunar.Term || this.lunar.IDayCn)
      },
      isFestival () {
        if (this.lunar && (this.lunar.calendarFestivals || this.lunar.lunarFestivals || this.lunar.Term)) {
          return true
        }
        return false
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "./_var.less";

  .ayou-day-cell {
    padding: 2px 0;
    width: 14.28%;
    display: inline-block;
    font-size: 1rem;
    text-align: center;
    &:hover {
      cursor: pointer;
    }
    div {
      &.passive {
        color: @grey;
      }
    }
    .solar {
      display: inline-block;
      width: 2.4rem;
      height: 2.4rem;
      line-height: 2.4rem;
      font-size: 1rem;
      &.selected {
        border-radius: 50%;
        background-color: @primary;
        color: #fff;
      }
      &.in-range {
        border-radius: 50%;
        background-color: @primary-light;
        color: #fff;
      }
      &.passive {
        &.in-range {
          opacity: 0.4;
        }
        &.selected {
          opacity: 0.4;
        }
      }
    }
    .lunar {
      font-size: 0.8rem;
      &.festival {
        color: @secondary;
        &.passive {
          opacity: 0.4;
        }
      }
    }
  }
</style>
