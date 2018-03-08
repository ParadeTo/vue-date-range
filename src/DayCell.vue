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
  import { formatter, START_YEAR } from './utils'

  export default {
    props: {
      showLunar: {
        type: Boolean,
        default: false
      },
      date: {
        type: Object
      },
      range: {
        type: Object
      },
      dayClassFunc: {
        type: Function,
        default: null
      },
      day: {
        type: Object
      },
      disableDaysBeforeToday: {
        type: Boolean
      },
      daysDisabledStart: {
        type: Object,
        default: null
      },
      daysDisabledEnd: {
        type: Object,
        default: null
      },
      // the day will be passed as argument to it to decide if it is disabled or not
      disabledFunc: {
        type: Function,
        default: null
      },
    },
    data () {
      return {
        lunar: this.solar2lunar()
      }
    },
    watch: {
      day () {
        this.lunar = this.solar2lunar()
      }
    },
    methods: {
      handleDayClick () {
        if (this.day.isPassive) return
        this.$emit('dayClick', this.day)
      },
      solar2lunar () {
        const { day } = this
        return transformer.solar2lunar(day.dayMoment.year(), day.dayMoment.month() + 1, day.dayMoment.date())
      },
      isSelected () {
        const {
          date,
          day
        } = this
        if (!day.dayMoment) return
        if (!date) return
        return formatter(day.dayMoment) === formatter(date)
      },
      isInRange () {
        const { range, day } = this
        const dayMoment = day.dayMoment
        if (range && range.startDate && range.endDate && day && dayMoment) {
          return dayMoment.isBetween(range['startDate'], range['endDate']) ||
            dayMoment.isBetween(range['endDate'], range['startDate']) ||
            formatter(dayMoment) === formatter(range['startDate']) ||
            formatter(dayMoment) === formatter(range['endDate'])
        }
      },
      isStartDay () {
        const { range, day } = this
        if (range && range.startDate) {
          return formatter(day.dayMoment) === formatter(range['startDate'])
        }
      },
      isEndDay () {
        const { range, day } = this
        if (range && range.endDate) {
          return formatter(day.dayMoment) === formatter(range['endDate'])
        }
      }
    },
    computed: {
      dayClass() {
        const {isSelected, isInRange, day, isStartDay, isEndDay, isPassive} = this
        let cls = [{
          'selected': isSelected(),
          'passive': day.isPassive,
          'current-month': day.isCurrentMonth,
          'in-range': isInRange(),
          'start-day': isStartDay(),
          'end-day': isEndDay()
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
