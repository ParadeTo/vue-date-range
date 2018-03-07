<template>
  <span class="ayou-day-cell cell"
        :class="dayClass"
        :title="showLunar && lunarText"
        @click.stop.prevent="handleDayClick()">
    <div class="cell-text">
      <p class="solar">{{day.dayMoment.date()}}</p>
      <p class="lunar" :class="{'festival': isFestival}" v-if="showLunar">{{lunarText}}</p>
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
      dayClassFunc: {
        type: Function,
        default: null
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
      },
      isStartDay: {
        type: Boolean,
        default: false
      },
      isEndDay: {
        type: Boolean,
        default: false
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
      handleDayClick () {
        if (this.day.isPassive) return
        this.$emit('dayClick', this.day)
      },
      solar2lunar (day) {
        return transformer.solar2lunar(day.dayMoment.year(), day.dayMoment.month() + 1, day.dayMoment.date())
      }
    },
    computed: {
      dayClass() {
        const {isSelected, day, isInRange, isStartDay, isEndDay} = this
        let cls = [{
          'selected': isSelected,
          'passive': day.isPassive,
          'current-month': day.isCurrentMonth,
          'in-range': isInRange,
          'start-day': isStartDay,
          'end-day': isEndDay
        }]

        if (typeof this.dayClassFunc === 'function') {
          const _cls = this.dayClassFunc(day.dayMoment)
          if (Object.prototype.toString.call(_cls) === '[object Array]') {
            cls = cls.concat(_cls)
          }
        }
        return cls
      },
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
    width: 14.28%;
    height: 16.67%;

    &:hover {
      cursor: pointer;
    }

    &.passive {
      color: @grey;
    }

    &.in-range {
      background-color: @primary-light;
      color: #fff;
    }

    &.passive {
      opacity: 0.4;
    }

    .cell-text {
      p {
        line-height: 1.2;
        margin: 0;
      }
      .lunar {
        font-size: 0.8rem;
        margin-top: 0.4em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &.festival {
          color: @secondary;
        }
      }
    }
  }
</style>
