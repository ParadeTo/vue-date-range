<template>
  <div class="ayou-date-range">
    <calendar
            :lang="lang"
            :first-day-of-week="firstDayOfWeek"
            :disable-days-before-today="disableDaysBeforeToday"
            :days-disabled-start="daysDisabledStart"
            :days-disabled-end="daysDisabledEnd"
            :disabled-func="disabledFunc"
            :range="rangeData"
            :showLunar="showLunar"
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
      defaultRange: {
        type: Object
      }
    },
    data () {
      return {
        rangeData: this.defaultRange || {
          startDate: null,
          endDate: null
        },
        date: this.selectedDate || moment(),
        step: 0
      }
    },
    watch: {
      defaultRange (val) {
        this.rangeData = val
        this.step = 0
      }
    },
    methods: {
      onChange (dayMoment) {
        switch (this.step) {
          case 0:
            this.rangeData = {}
            this.rangeData['startDate'] = dayMoment
            this.rangeData['endDate'] = dayMoment
            this.step = 1
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
        this.$emit('change', {startDate, endDate})
      }
    }
  }
</script>