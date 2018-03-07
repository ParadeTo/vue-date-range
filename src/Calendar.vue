<template>
  <div class="ayou-calendar" ref="calendar">
    <div class="month-year">
      <button class="month-button" style="float: left" @click.stop.prevent="changeMonth(-1)">
        <i class="month-arrow month-arrow-prev"></i>
      </button>
      <span @click="handleMonthYearClick">
        <span>{{formatMonthYear}}</span>
      </span>
      <button class="month-button" style="float: right" @click.stop.prevent="changeMonth(1)">
        <i class="month-arrow month-arrow-next"></i>
      </button>
    </div>
    <div class="wrapper" v-if="displayLevel === 1">
      <div class="week-days">
        <span v-for="day in weekDays">{{day}}</span>
      </div>
      <div class="days">
        <day-cell :key="dayKey(day)"
                  :isStartDay="isStartDay(day)"
                  :isEndDay="isEndDay(day)"
                  :showLunar="showLunar"
                  :isSelected="isSelected(day)"
                  :isInRange="isInRange(day)"
                  :day="day"
                  :dayClassFunc="dayClassFunc"
                  @dayClick="handleDayClick"
                  v-for="(day, index) in days"/>
      </div>
    </div>
    <div class="wrapper" v-if="displayLevel === 2">
      <month-cell
              v-for="(m, i) in 12"
              @click="handleMonthClick(i)"
              :date="date"
              :monthIndex="i"
              :lang="lang"/>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // import Hammer from 'COMMON/js/hammer.min.js'
  import moment from 'moment'
  import DayCell from './DayCell.vue'
  import MonthCell from './MonthCell.vue'
  import locals from './locals.js'

  export default {
    components: {
      DayCell,
      MonthCell
    },
    props: {
      dayClassFunc: {
        type: Function,
        default: null
      },
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
      dayOfMonthProp: {
        type: Object,
        default: function() {
          return moment()
        }
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
      syncDate: {
        type: Object
      },
      value: {
        type: Object
      },
      monthYearFormat: {
        default: 'MM - YYYY',
        type: String
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
        locals: locals,
        displayLevel: 1,
        weekDays: [],
        days: [],
        dayOfMonth: this.dayOfMonthProp,
        // dayOfMonth: this.dayOfMonth || moment(), // Any day of current displaying month
        date: dateInitial
      }
    },
    watch: {
      // if used in DateRange, show month that contains endDate
      range (val) {
//        this.date = val.endDate
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
    computed: {
      formatMonthYear () {
        const { displayLevel, dayOfMonth, monthYearFormat } = this
        switch (displayLevel) {
          case 1:
            return dayOfMonth.format(monthYearFormat)
          case 2:
            return dayOfMonth.format('YYYY')
        }
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
      dayKey(day) {
        return day.dayMoment.unix()
      },
      formatter (dayMoment, format="YYYY-MM-DD") {
        return dayMoment.format(format)
      },
      resetDayOfMonth () {
        const {
          date,
          dayOfMonth,
          formatter
        } = this
        // If no date is selected then it's not necessary to update dayOfMonth
        if (!date) return
        if (formatter(date, 'YYYY-MM') !== formatter(dayOfMonth, 'YYYY-MM')) {
          let _diff = Number(date.diff(dayOfMonth, 'months'))
          _diff = _diff <= 0 ? _diff - 1 : _diff
          dayOfMonth.add(_diff, 'months')
          this.dayOfMonth = dayOfMonth.clone()
          this.initDays()
        }
      },
      initWeekDays () {
        const dow = this.firstDayOfWeek
        for (let i = dow; i < 7 + dow; i++) {
          let day = i % 7
          this.weekDays.push(locals[this.lang].days[day])
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
          this.days.push({dayMoment, isPassive: true, isCurrentMonth: false})
        }

        // Current month's days
        for (let i = 1; i <= dayCount; i++) {
          const dayMoment = this.dayOfMonth.clone().date(i)
          var isPassive = this.isPassive(dayMoment)
          this.days.push({ dayMoment, isPassive, isCurrentMonth: true })
        }

        // Next month's days
        const remainingCells = 42 - this.days.length // 42cells = 7days * 6rows
        for (let i = 1; i <= remainingCells; i++) {
          const dayMoment = nextMonth.clone().date(i)
          this.days.push({ dayMoment, isPassive: true, isCurrentMonth: false })
        }
      },
      isSelected (day) {
        const {
          date,
          formatter
        } = this
        if (!day.dayMoment) return
        if (!date) return
        return formatter(day.dayMoment) === formatter(date)
      },
      isInRange (day) {
        const { range, formatter } = this
        const dayMoment = day.dayMoment
        if (range && range.startDate && range.endDate && day && dayMoment) {
          return dayMoment.isBetween(range['startDate'], range['endDate']) ||
            dayMoment.isBetween(range['endDate'], range['startDate']) ||
            formatter(dayMoment) === formatter(range['startDate']) ||
            formatter(dayMoment) === formatter(range['endDate'])
        }
      },
      isStartDay (day) {
        const { range, formatter } = this
        if (range && range.startDate) {
          return formatter(day.dayMoment) === formatter(range['startDate'])
        }
      },
      isEndDay (day) {
        const { range, formatter } = this
        if (range && range.endDate) {
          return formatter(day.dayMoment) === formatter(range['endDate'])
        }
      },
      isPassive (dayMoment) {
        var { disableDaysBeforeToday, daysDisabledStart, daysDisabledEnd, disabledFunc } = this

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
      handleMonthClick (monthIndex) {

      },
      handleMonthYearClick () {
        this.displayLevel ++
      },
      changeMonth (delta) {
        this.dayOfMonth.add(delta, 'months')
        this.dayOfMonth = this.dayOfMonth.clone()
        this.initDays()
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "_var";

  .ayou-calendar {
    background-color: #fff;
    height: 500px;
    display: flex;
    flex-direction: column;
    .month-year {
      text-align: center;
      font-size: 1.4rem;
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .month-button {
        display: inline-block;
        box-sizing: border-box;
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

    .wrapper {
      flex: 4;
      .week-days {
        height: 15%;
        span {
          display: inline-block;
          width: 14.28%;
          font-size: 1rem;
          text-align: center;
        }
      }
      .days {
        height: 85%;
        font-size: 0;
      }
      .month-cell {
        width: 25%;
        height: 33.33%;
      }
    }
  }
</style>
