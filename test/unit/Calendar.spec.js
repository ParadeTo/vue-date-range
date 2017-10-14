import Vue from 'vue'
import moment from 'moment'
import Calendar from '../../src/Calendar.vue'
import DateRange from '../../src/DateRange.vue'
import {
  getRenderedVm,
  getDayPositionInCalendar,
  formatMonth,
  commonUnit}
from './tools'

const year = moment().year()
const month = moment().month()

describe('Test Calendar:',  () => {
  commonUnit(Calendar)

  it('days between range should have in-range class and when range is changed it should also be true', (done) => {
    const start = moment(`${year}-${formatMonth(month+1)}-14`)
    const end = moment(`${year}-${formatMonth(month+1)}-16`)

    let vm = getRenderedVm(Calendar, {
      range: {
        startDate: start,
        endDate: end
      }
    })

    const startDay = start.date()
    const endDay = end.date()
    let $spans = vm.$el.querySelectorAll(".days span .in-range")

    expect($spans.length).to.equal(3)
    expect($spans[0].innerText).to.equal(startDay.toString())
    expect($spans[$spans.length - 1].innerText).to.equal(endDay.toString())

    vm.range = {
      startDate: moment(`${year}-${formatMonth(month+1)}-16`),
      endDate: moment(`${year}-${formatMonth(month+1)}-17`)
    }

    vm.$nextTick(() => {
      $spans = vm.$el.querySelectorAll(".days span .in-range")
      expect($spans.length).to.equal(2)
      done()
    })
  })

  it('the syncDate should has selected class and when it change Calender\'s month will change too', (done) => {
    // next month
    let nextMonth = month + 1
    let nextYear = year
    if (nextMonth > 11) {
      nextMonth = 0
      nextYear += 1
    }
    nextMonth = formatMonth(nextMonth + 1)

    const syncDate = moment(`${nextYear}-${nextMonth}-15`)

    let vm = getRenderedVm(Calendar)

    vm.syncDate = syncDate

    vm.$nextTick(() => {
      const _month = vm.$el.querySelector(".month-year span span").innerText
      expect(_month).to.match(new RegExp('^' + nextMonth))

      const $spans = vm.$el.querySelectorAll(".days span")
      const pos = getDayPositionInCalendar(syncDate, 0)
      for (var i = 0, len = $spans.length; i < len; i++) {
        if (i === pos-1) {
          var $solar = $spans[i].querySelector(".solar")
          var hasCls = $solar.className.indexOf('selected') > -1
          expect(hasCls).to.equal(true)
        }
      }

      done()
    })
  })
})