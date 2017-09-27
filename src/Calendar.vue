<template>
  <div class="ayou-calendar" ref="calendar">
    <div class="month-year">
      <button class="month-button" style="float: left" @click.stop.prevent="changeMonth(-1)">
        <i class="month-arrow month-arrow-prev"></i>
      </button>
      <span>
        <span>{{dayOfMonth.format('MM')}}</span>
        <span> - </span>
        <span>{{dayOfMonth.format('YYYY')}}</span>
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
      // the day will be passed as argument to it to decide if it is disabled or not
      disabledFunc: {
        type: Function,
        default: null
      },
      range: {
        type: Object,
        default: null
      },
      lang: {
        type: String,
        default: 'zh'
      },
      // use syncDate instead
//      defaultDate: {
//        type: Object
//      },
      syncDate: {
        type: Object
      },
      value: {
        type: Object
      }
    },
    data () {
      let dateInitial;

      // Use value prop if it's passed in (possibly by v-model), this allows
      // null to be passed explicitly
      if (this.$options.propsData.hasOwnProperty('value')) {
        dateInitial = this.value
      } else if (this.syncDate) {
        dateInitial = this.syncDate
      } else {
        dateInitial = moment()
      }

      return {
        weekDays: [],
        days: [],
        dayOfMonth: moment(), // Any day of current displaying month
        date: dateInitial
      }
    },
    watch: {
      // if used in DateRange, show month that contains endDate
      range (val) {
        this.date = val.endDate
        this.resetDayOfMonth()
      },
      // show month that contains defaultDate
      syncDate (val) {
        this.date = val
        this.resetDayOfMonth()
      },
      value (val) {
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
        // If no date is selected then it's not necessary to update dayOfMonth
        if (!this.date) return
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
          var isPassive = this.isPassive(dayMoment)
          this.days.push({ dayMoment, isPassive })
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
        if (!this.date) return
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
      isPassive (dayMoment) {
        var {disableDaysBeforeToday, daysDisabledStart, daysDisabledEnd, disabledFunc} = this

        // use disabledFunc to decide
        if (disabledFunc) {
          return disabledFunc(dayMoment)
        }

        // set days between daysDisabledStart and daysDisabledEnd to isPassive
        if (daysDisabledStart && daysDisabledEnd) {
          if (Number(dayMoment.diff(daysDisabledStart, 'days')) >= 0
            && Number(dayMoment.diff(daysDisabledEnd, 'days')) < 0) {
            return true
          }
        } else if (daysDisabledStart) {
          if (Number(dayMoment.diff(daysDisabledStart, 'days')) >= 0) {
            return true
          }
        } else if (this.daysDisabledEnd) {
          if (Number(dayMoment.diff(daysDisabledEnd, 'days')) < 0) {
            return true
          }
        }

        // set days before today to isPassive
        var _today = moment()
        if (disableDaysBeforeToday && Number(dayMoment.diff(_today, 'days')) <= -1) {
          return true
        }
      },
      handleDayClick (day) {
        this.date = day.dayMoment
        // to support three ways to get value
        this.$emit('update:syncDate', day.dayMoment)
        this.$emit('input', day.dayMoment)
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
