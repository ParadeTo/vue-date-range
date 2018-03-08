<template>
  <div class="ayou-date-range">
    <calendar
            :lang="lang"
            :first-day-of-week="firstDayOfWeek"
            :day-of-month-prop="dayOfMonthProp"
            :disable-days-before-today="disableDaysBeforeToday"
            :days-disabled-start="daysDisabledStart"
            :days-disabled-end="daysDisabledEnd"
            :disabled-func="disabledFunc"
            :range="rangeData"
            :showLunar="showLunar"
            :month-year-format="monthYearFormat"
            :dayClassFunc="dayClassFunc"
            @change="onChange">
    </calendar>
  </div>
</template>
<script type="text/ecmascript-6">
  import moment from 'moment'
  import Calendar from './Calendar.vue'

  export default {
    components: {
      Calendar
    },
    props: {
      showLunar: {
        type: Boolean,
        default: false
      },
      dayClassFunc: {
        type: Function,
        default: null
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
      disabledFunc: {
        type: Function,
        default: null
      },
      lang: {
        type: String,
        default: 'zh'
      },
      syncRange: {
        type: Object
      },
      dayOfMonthProp: {
        type: Object,
        default: null
      },
      value: {
        type: Object
      },
      emitChangeOnStep0: {
        type: Boolean,
        default: false
      },
      monthYearFormat: {
        default: 'MM - YYYY',
        type: String
      }
    },
    data () {
      let rangeInitial;

      // Checking propsData rather than the prop detects whether the prop was
      // specified by the user. This allows the user to pass null, resulting in
      // no date being selected by default
      if (this.$options.propsData.hasOwnProperty('value')) {
        console.log(this.value)
        rangeInitial = this.value
      } else if (this.syncRange) {
        rangeInitial = this.syncRange
      } else {
        rangeInitial = {
          startDate: null,
          endDate: null
        }
      }

      return {
        rangeData: rangeInitial,
        step: 0
      }
    },
    watch: {
      syncRange (val) {
        this.updateRangeData(val)
      },
      value (val) {
        this.updateRangeData(val)
      },
      step: function(step) {
        this.$emit('step', step)
      }
    },
    methods: {
      onChange (dayMoment) {
        console.log(222222)
        switch (this.step) {
          case 0:
            this.rangeData = {}
            this.rangeData['startDate'] = dayMoment
            this.rangeData['endDate'] = dayMoment
            this.step = 1
            this.emitChangeOnStep0 && this.emitChange()
            break

          case 1:
            this.rangeData['endDate'] = dayMoment
            this.step = 0
            this.emitChange()
            break
        }
      },
      emitChange () {
        const sTs = this.rangeData.startDate.unix()
        const eTs = this.rangeData.endDate.unix()
        const startDate = sTs <= eTs ? this.rangeData.startDate : this.rangeData.endDate
        const endDate = sTs > eTs ? this.rangeData.startDate : this.rangeData.endDate
        // to support three ways to get value
        this.$emit('update:syncRange', {startDate, endDate})
        this.$emit('input', {startDate, endDate})
        this.$emit('change', {startDate, endDate})
      },
      setStep: function(step) {
        this.step = step
        this.$emit('step', this.step)
      },
      updateRangeData: function(rangeData) {
        this.rangeData = rangeData

        // rangeData.startDate and rangeData.endDate can be null, if this is the
        // case step must be reset to 0
        if (this.rangeData.startDate === null || this.rangeData.endDate === null) {
          this.step = 0;
        }
      }
    }
  }
</script>