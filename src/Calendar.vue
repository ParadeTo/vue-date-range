<template>
  <div class="v-date-calendar" ref="calendar">
    <div class="v-date-month-year">
      <button class="v-date-arrow-button" style="float: left" @click.stop.prevent="changeMonthYear(-1)">
        <i class="v-date-arrow v-date-prev"></i>
      </button>
      <span class="v-date-text" @click="handleMonthYearClick">
        <span>{{formatMonthYear}}</span>
      </span>
      <button class="v-date-arrow-button" style="float: right" @click.stop.prevent="changeMonthYear(1)">
        <i class="v-date-arrow v-date-next"></i>
      </button>
    </div>
    <transition :name="openTransition ? 'fade' : ''"  mode="out-in">
      <div class="v-date-wrapper" v-if="displayLevel === 1" key="day">
        <page-transition :openTransition="openTransition" :moveDirection="moveDirection" :toggleShow="toggleShow">
          <div class="v-date-week-days">
            <span v-for="(day, index) in weekDays" :key="index">{{day}}</span>
          </div>
          <div class="v-date-days" >
            <day-cell
                      :key="dayKey(day)"
                      :disable-days-before-today="disableDaysBeforeToday"
                      :days-disabled-start="daysDisabledStart"
                      :days-disabled-end="daysDisabledEnd"
                      :disabled-func="disabledFunc"
                      :show-lunar="showLunar"
                      :day="day"
                      :date="date"
                      :range="range"
                      :day-class-func="dayClassFunc"
                      @dayClick="handleDayClick"
                      v-for="day in dayList"/>
          </div>
        </page-transition>
      </div>
      <div class="v-date-wrapper" v-if="displayLevel === 2" key="month">
        <page-transition :openTransition="openTransition" :moveDirection="moveDirection" :toggleShow="toggleShow">
          <div style="height: 100%;">
            <month-cell
                    v-for="m in monthList"
                    @click.native="handleMonthClick(m)"
                    :key="dayKey(m)"
                    :date="date"
                    :range="range"
                    :moment="m"
                    :lang="lang"/>
          </div>
        </page-transition>
      </div>
      <div class="v-date-wrapper" v-if="displayLevel === 3" key="year">
        <page-transition :openTransition="openTransition" :moveDirection="moveDirection" :toggleShow="toggleShow">
          <div style="height: 100%;">
            <year-cell
                    v-for="y in yearList"
                    @click.native="handleYearClick(y)"
                    :key="y"
                    :year="y"
                    :date="date"
                    :range="range"
            />
          </div>
        </page-transition>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  // import Hammer from 'COMMON/js/hammer.min.js'
  import moment from 'moment'
  import DayCell from './DayCell.vue'
  import MonthCell from './MonthCell.vue'
  import YearCell from './YearCell.vue'
  import PageTransition from './PageTransition.vue'
  import locals from './locals.js'
  import { formatter, START_YEAR } from './utils'

  export default {
    components: {
      DayCell,
      MonthCell,
      PageTransition,
      YearCell
    },
    props: {
      openTransition: {
        type: Boolean,
        default: true
      },
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
      dayOfMonthProp: {
        type: Object,
        default: null
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
        dateInitial = this.value.clone()
      } else if (this.syncDate) {
        dateInitial = this.syncDate.clone()
      } else if (this.range && this.range.startDate) {
        dateInitial = this.range.startDate.clone()
      } else {
        dateInitial = moment()
      }

      return {
        locals: locals,
        displayLevel: 1,
        weekDays: [],
        dayOfMonth: (this.dayOfMonthProp && this.dayOfMonthProp.clone()) || dateInitial.clone(),
        date: dateInitial.clone(),
        toggleShow: true,
        moveDirection: "move-right"
      }
    },
    watch: {
      range (val) {
        this.date = val.startDate
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
        const { displayLevel, dayOfMonth, monthYearFormat, yearList } = this
        switch (displayLevel) {
          case 1:
            return dayOfMonth.format(monthYearFormat)
          case 2:
            return dayOfMonth.format('YYYY')
          case 3:
            return yearList[0] + "-" + yearList[11]
        }
      },
      monthList () {
        let m = []
        for (var i = 0; i < 12; i++) {
          const _moment = this.dayOfMonth.clone().month(i)
          m.push(_moment)
        }
        return m
      },
      yearList () {
        const year = this.dayOfMonth.year()
        const start = Math.floor((year - START_YEAR ) / 10) * 10 + START_YEAR
        let list = []
        for (var i = 0; i < 12; i++) {
          list.push(start + i)
        }
        return list
      },
      dayList () {
        let days = []

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
          days.push({dayMoment, isPassive: true, isCurrentMonth: false})
        }

        // Current month's days
        for (let i = 1; i <= dayCount; i++) {
          const dayMoment = this.dayOfMonth.clone().date(i)
          var isPassive = this.isPassive(dayMoment)
          days.push({ dayMoment, isPassive, isCurrentMonth: true })
        }

        // Next month's days
        const remainingCells = 42 - days.length // 42cells = 7days * 6rows
        for (let i = 1; i <= remainingCells; i++) {
          const dayMoment = nextMonth.clone().date(i)
          days.push({ dayMoment, isPassive: true, isCurrentMonth: false })
        }
        return days
      }
    },
    created () {
      this.initWeekDays()
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
        if (day.unix) {
          return day.unix()
        }
        return day.dayMoment.unix()
      },
      isPassive (dayMoment) {

        const { disableDaysBeforeToday, daysDisabledStart, daysDisabledEnd, disabledFunc } = this

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
      resetDayOfMonth () {
        const {
          date,
          dayOfMonth
        } = this
        // If no date is selected then it's not necessary to update dayOfMonth
        if (!date) return
        if (formatter(date, 'YYYY-MM') !== formatter(dayOfMonth, 'YYYY-MM')) {
          let _diff = Number(date.diff(dayOfMonth, 'months'))
          _diff = _diff <= 0 ? _diff - 1 : _diff
          dayOfMonth.add(_diff, 'months')
          this.dayOfMonth = dayOfMonth.clone()
        }
      },
      initWeekDays () {
        const dow = this.firstDayOfWeek
        for (let i = dow; i < 7 + dow; i++) {
          let day = i % 7
          this.weekDays.push(locals[this.lang].days[day])
        }
      },

      emitVal () {
        const { date } = this

        // to support three ways to get value
        this.$emit('update:syncDate', date)
        this.$emit('input', date)
        this.$emit('change', date)
      },
      handleDayClick (day) {
        this.date = day.dayMoment
        this.emitVal()
      },
      handleMonthClick (moment) {
        this.dayOfMonth.year(moment.year()).month(moment.month())
        this.dayOfMonth = this.dayOfMonth.clone()
        this.displayLevel --
      },
      handleYearClick (year) {
        this.dayOfMonth.year(year)
        this.dayOfMonth = this.dayOfMonth.clone()
        this.displayLevel --
      },
      handleMonthYearClick () {
        if (this.displayLevel === 3) return
        this.displayLevel ++
      },
      changeMonthYear (delta) {
        this.toggleShow = !this.toggleShow
        if (delta > 0) {
          this.moveDirection = "move-left"
        } else {
          this.moveDirection = "move-right"
        }

        const { displayLevel } = this
        switch (displayLevel) {
          case 1:
            this.change(delta, 'months')
            return
          case 2:
            this.change(delta, 'years')
            return
          case 3:
            this.change(delta * 10, 'years')
            return
        }
      },
      change (delta, unit) {
        this.dayOfMonth.add(delta, unit)
        this.dayOfMonth = this.dayOfMonth.clone()
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "_var";

  .fade-enter-active, .fade-leave-active {
    transition: transform .3s;
  }
  /*.fade-enter,*/
  .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: scale(0);
  }

  .v-date-calendar {
    background-color: #fff;
    height: 500px;
    display: flex;
    flex-direction: column;
    .v-date-month-year {
      text-align: center;
      font-size: 1.4rem;
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .v-date-arrow-button {
        display: inline-block;
        box-sizing: border-box;
        width: 2rem;
        padding: 0;
        margin: 0 0.7rem;
        border: none;
        outline: none;
        background-color: #fff;
      }
      .v-date-arrow {
        display: inline-block;
        height: 100%;
        line-height: 100%;
        border-top: 1px solid @primary;
        width: 10px;
        height: 10px;
        &.v-date-prev {
          border-left: 1px solid @primary;
          transform: rotate(-45deg);
        }
        &.v-date-next {
          border-right: 1px solid @primary;
          transform: rotate(45deg);
        }
      }
    }

    .v-date-wrapper {
      flex: 4;
      font-size: 0;
      position: relative;
      overflow: hidden;
      .v-date-week-days {
        height: 10%;
        span {
          display: inline-block;
          width: 14.28%;
          font-size: 1rem;
          text-align: center;
        }
      }
      .v-date-days {
        height: 90%;
        font-size: 0;
      }
    }
  }
</style>
