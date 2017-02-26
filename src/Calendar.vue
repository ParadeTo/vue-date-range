<template>
  <div class="ayou-calendar" ref="calendar">
    <div class="month-year">
      <button class="month-button" style="float: left" @click="changeMonth(-1)">
        <i class="month-arrow month-arrow-prev"></i>
      </button>
      <span>
        <span class={classes.month}>{{dayOfMonth.format('MM')}}</span>
        <span class={classes.monthAndYearDivider}> - </span>
        <span class={classes.year}>{{dayOfMonth.format('YYYY')}}</span>
      </span>
      <button class="month-button" style="float: right" @click="changeMonth(1)">
        <i class="month-arrow month-arrow-next"></i>
      </button>
    </div>
    <div class="week-days">
      <span v-for="day in weekDays">{{day}}</span>
    </div>
    <div class="days">
      <day-cell :isSelected="isSelected(day)" :isInRange="isInRange(day)" v-for="day in days" :day="day" @dayClick="handleDayClick"></day-cell>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import moment from 'moment';
  // import Hammer from 'COMMON/js/hammer.min.js';
  import DayCell from './DayCell.vue';
  import DateLanguages from './DateLanguages.js';

  export default {
    components: {
      DayCell
    },
    props: {
      firstDayOfWeek: {
        type: Number,
        default: function() {
          return moment.localeData().firstDayOfWeek();
        }
      },
      dayOfMonth: {
        type: Object,
        default: function() {
          return moment();
        }
      },
      disableDaysBeforeToday: {
        type: Boolean,
        default: false
      },
      range: {
        type: Object,
        default: null
      },
      lang: {
        type: String,
        default: 'zh'
      }
    },
    data() {
      return {
        weekDays: [],
        days: [],
        date: moment()
      };
    },
    created() {
      this.initWeekDays();
      this.initDays();
    },
    mounted() {
      // this.initGesture();
    },
    methods: {
      // initGesture() {
      //   const that = this;
      //   var hammer = new Hammer.Manager(that.$refs.calendar);
      //   hammer.add(new Hammer.Swipe());
      //   hammer.on('swiperight', function() {
      //     that.dayOfMonth.add(-1, 'months');
      //     that.initDays();
      //   });
      //   hammer.on('swipeleft', function() {
      //     that.dayOfMonth.add(1, 'months');
      //     that.initDays();
      //   });
      // },
      initWeekDays() {
        const dow = this.firstDayOfWeek;
        for (let i = dow; i < 7 + dow; i++) {
          let day = i % 7;
          this.weekDays.push(DateLanguages.translations[this.lang].days[day]);
        }
      },
      initDays() {
        this.days = [];

        const firstDayOfWeek = this.firstDayOfWeek;
        const startOfMonth = this.dayOfMonth.startOf('month').isoWeekday();
        const monthNumber = this.dayOfMonth.month();
        const dayCount = this.dayOfMonth.daysInMonth();

        const lastMonth = this.dayOfMonth.clone().month(monthNumber - 1);
        const lastMonthDayCount = lastMonth.daysInMonth();

        const nextMonth = this.dayOfMonth.clone().month(monthNumber + 1);

        // Previous month's days
        const diff = (Math.abs(firstDayOfWeek - (startOfMonth + 7)) % 7);
        for (let i = diff - 1; i >= 0; i--) {
          const dayMoment = lastMonth.clone().date(lastMonthDayCount - i);
          this.days.push({dayMoment, isPassive: true});
        }

        // Current month's days
        for (let i = 1; i <= dayCount; i++) {
          const dayMoment = this.dayOfMonth.clone().date(i);
          // set days before today to isPassive
          var _today = moment();
          if (this.disableDaysBeforeToday && Number(dayMoment.diff(_today, 'days')) <= -1) {
            this.days.push({ dayMoment, isPassive: true });
          } else {
            this.days.push({ dayMoment });
          }
        }

        // Next month's days
        const remainingCells = 42 - this.days.length; // 42cells = 7days * 6rows
        for (let i = 1; i <= remainingCells; i++) {
          const dayMoment = nextMonth.clone().date(i);
          this.days.push({ dayMoment, isPassive: true });
        }
      },
      isSelected(day) {
        if (!day) return;
        return day.dayMoment.unix() === this.date.unix();
      },
      isInRange(day) {
        if (this.range && this.range.startDate && this.range.endDate && day && day.dayMoment) {
          return day.dayMoment.isBetween(this.range['startDate'].clone().subtract(1, 'days'), this.range['endDate']) ||
            day.dayMoment.isBetween(this.range['endDate'], this.range['startDate'].clone().add(1, 'days'));
        }
      },
      handleDayClick(day) {
        this.date = day.dayMoment;
        this.$emit('change', day.dayMoment);
      },
      changeMonth(delta) {
        this.dayOfMonth.add(delta, 'months');
        this.initDays();
      }
    }
  };
</script>
<style lang="less" rel="stylesheet/less">
  .ayou-calendar {
    background-color: #fff;
    .month-year {
      text-align: center;
      font-size: 1.4rem;
      height: 4rem;
      line-height: 4rem;
      .month-button {
        display: inline-block;
        boxSizing: border-box;
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
        border-top: 1px solid #006CCA;
        width: 10px;
        height: 10px;
        &.month-arrow-prev {
          border-left: 1px solid #006CCA;
          transform: rotate(-45deg);
        }
        &.month-arrow-next {
          border-right: 1px solid #006CCA;
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
