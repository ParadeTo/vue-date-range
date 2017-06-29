<template>
  <div class="ayou-calendar" ref="calendar">
    <div class="month-year">
      <button class="month-button" style="float: left" @click.stop.prevent="changeMonth(-1)">
        <i class="month-arrow month-arrow-prev"></i>
      </button>
      <span>
        <span class={classes.month}>{{dayOfMonth.format('MM')}}</span>
        <span class={classes.monthAndYearDivider}> - </span>
        <span class={classes.year}>{{dayOfMonth.format('YYYY')}}</span>
      </span>
      <button class="month-button" style="float: right" @click.stop.prevent="changeMonth(1)">
        <i class="month-arrow month-arrow-next"></i>
      </button>
    </div>
    <div class="week-days">
      <span v-for="day in weekDays">{{day}}</span>
    </div>
    <div class="days">
      <day-cell key="index"
                :showLunar="showLunar"
                :isSelected="isSelected(day)"
                :isInRange="isInRange(day)"
                :day="day"
                @dayClick="handleDayClick"
                v-for="(day, index) in days">
      </day-cell>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import moment from 'moment'
  // import Hammer from 'COMMON/js/hammer.min.js'
  import DayCell from './DayCell.vue'
  import locals from './locals.js'

  export default {
    components: {
      DayCell
    },
    props: {
      showLunar: {
        type: Boolean,
        default: false
      },
      firstDayOfWeek: {
        type: Number,
        default: function () {
          return moment.localeData().firstDayOfWeek()
        }
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
      // TODO realize this feature
      // the day will be passed as argument to it to decide if it is disabled or not
      disabledFunc: {
        type: Function
      },
      range: {
        type: Object,
        default: null
      },
      lang: {
        type: String,
        default: 'zh'
      },
      defaultDate: {
        type: Object
      }
    },
    data () {
      return {
        weekDays: [],
        days: [],
        dayOfMonth: moment(), // Any day of current displaying month
        date: this.defaultDate || moment()
      }
    },
    watch: {
      range (val) {
        this.date = val.endDate
        this.resetDayOfMonth()
      },
      defaultDate (val) {
        this.date = val
        this.resetDayOfMonth()
      }
    },
    created () {
      this.initWeekDays()
      this.initDays()
    },
    mounted () {
      // this.initGesture()
    },
    methods: {
      // TODO Add gesture
      // initGesture() {
      //   const that = this
      //   var hammer = new Hammer.Manager(that.$refs.calendar)
      //   hammer.add(new Hammer.Swipe())
      //   hammer.on('swiperight', function() {
      //     that.dayOfMonth.add(-1, 'months')
      //     that.initDays()
      //   })
      //   hammer.on('swipeleft', function() {
      //     that.dayOfMonth.add(1, 'months')
      //     that.initDays()
      //   })
      // },
      resetDayOfMonth () {
        if (this.date.format('YYYY-MM') !== this.dayOfMonth.format('YYYY-MM')) {
          let _diff = Number(this.date.diff(this.dayOfMonth, 'months'))
          _diff = _diff <= 0 ? _diff - 1 : _diff
          this.dayOfMonth.add(_diff, 'months')
          this.initDays()
        }
      },
      initWeekDays () {
        const dow = this.firstDayOfWeek
        for (let i = dow; i < 7 + dow; i++) {
          let day = i % 7
          this.weekDays.push(locals.translations[this.lang].days[day])
        }
      },
      initDays () {
        this.days = []

        const firstDayOfWeek = this.firstDayOfWeek
        const startOfMonth = this.dayOfMonth.startOf('month').isoWeekday()
        const monthNumber = this.dayOfMonth.month()
        const dayCount = this.dayOfMonth.daysInMonth()

        const lastMonth = this.dayOfMonth.clone().month(monthNumber - 1)
        const lastMonthDayCount = lastMonth.daysInMonth()

        const nextMonth = this.dayOfMonth.clone().month(monthNumber + 1)

        // Previous month's days
        const diff = (Math.abs(firstDayOfWeek - (startOfMonth + 7)) % 7)
        for (let i = diff - 1; i >= 0; i--) {
          const dayMoment = lastMonth.clone().date(lastMonthDayCount - i)
          this.days.push({dayMoment, isPassive: true})
        }

        // Current month's days
        for (let i = 1; i <= dayCount; i++) {
          const dayMoment = this.dayOfMonth.clone().date(i)
          // set days before today to isPassive
          var _today = moment()

          if (this.disableDaysBeforeToday && Number(dayMoment.diff(_today, 'days')) <= -1) {
            this.days.push({ dayMoment, isPassive: true })
            continue
          }

          // set days between daysDisabledStart and daysDisabledEnd to isPassive
          // TODO Add a method to handle days diff
          if (this.daysDisabledStart && this.daysDisabledEnd) {
            if (Number(dayMoment.diff(this.daysDisabledStart, 'days')) >= 0
                && Number(dayMoment.diff(this.daysDisabledEnd, 'days')) < 0) {
              this.days.push({ dayMoment, isPassive: true })
              continue
            }
          } else if (this.daysDisabledStart) {
            if (Number(dayMoment.diff(this.daysDisabledStart, 'days')) >= 0) {
              this.days.push({ dayMoment, isPassive: true })
              continue
            }
          } else if (this.daysDisabledEnd) {
            if (Number(dayMoment.diff(this.daysDisabledEnd, 'days')) < 0) {
              this.days.push({ dayMoment, isPassive: true })
              continue
            }
          }

          this.days.push({ dayMoment })
        }

        // Next month's days
        const remainingCells = 42 - this.days.length // 42cells = 7days * 6rows
        for (let i = 1; i <= remainingCells; i++) {
          const dayMoment = nextMonth.clone().date(i)
          this.days.push({ dayMoment, isPassive: true })
        }
      },
      isSelected (day) {
        if (!day.dayMoment) return
        return day.dayMoment.format('YYYY-MM-DD') === this.date.format('YYYY-MM-DD')
      },
      isInRange (day) {
        if (this.range && this.range.startDate && this.range.endDate && day && day.dayMoment) {
          return day.dayMoment.isBetween(this.range['startDate'], this.range['endDate']) ||
            day.dayMoment.isBetween(this.range['endDate'], this.range['startDate']) ||
            day.dayMoment.format('YYYY-MM-DD') === this.range['startDate'].format('YYYY-MM-DD') ||
            day.dayMoment.format('YYYY-MM-DD') === this.range['endDate'].format('YYYY-MM-DD')
        }
      },
      // TODO
      isDisabled (dayMoment) {
        if (this.disableDaysBeforeToday && Number(dayMoment.diff(_today, 'days')) <= -1) {
          return true
        }

        if (this.daysDisabledStart && this.daysDisabledEnd) {
          console.log(1, Number(dayMoment.diff(this.daysDisabledStart, 'days')))
          if (Number(dayMoment.diff(this.daysDisabledStart, 'days')) >= 0
            && Number(dayMoment.diff(this.daysDisabledEnd, 'days')) < 0) {
            return true
          }
        } else if (this.daysDisabledStart) {
          console.log(2, Number(dayMoment.diff(this.daysDisabledStart, 'days')))
          if (Number(dayMoment.diff(this.daysDisabledStart, 'days')) >= 0) {
            this.days.push({ dayMoment, isPassive: true })
            return true
          }
        } else if (this.daysDisabledEnd) {
          console.log(3, Number(dayMoment.diff(this.daysDisabledStart, 'days')))
          if (Number(dayMoment.diff(this.daysDisabledEnd, 'days')) < 0) {
            this.days.push({ dayMoment, isPassive: true })
            return true
          }
        }
      },
      handleDayClick (day) {
        this.date = day.dayMoment
        this.$emit('change', day.dayMoment)
      },
      changeMonth (delta) {
        this.dayOfMonth.add(delta, 'months')
        this.initDays()
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "_var";

  .ayou-calendar {
    background-color: #fff;
    .month-year {
      text-align: center;
      font-size: 1.4rem;
      height: 4rem;
      line-height: 4rem;
      .month-button {
        display: inline-block;
        box-sizing: border-box;
        height: 100%;
        width: 2rem;
        padding: 0;
        margin: 0 0.7rem;
        border: none;
        outline: none;
        background-color: #fff;
      }
      .month-arrow {
        display: inline-block;
        height: 100%;
        line-height: 100%;
        border-top: 1px solid @primary;
        width: 10px;
        height: 10px;
        &.month-arrow-prev {
          border-left: 1px solid @primary;
          transform: rotate(-45deg);
        }
        &.month-arrow-next {
          border-right: 1px solid @primary;
          transform: rotate(45deg);
        }
      }
    }
    .week-days {
      span {
        padding: 10px 0;
        display: inline-block;
        font-size: 1rem;
        width: 14.28%;
        text-align: center;
      }
    }
  }
</style>
