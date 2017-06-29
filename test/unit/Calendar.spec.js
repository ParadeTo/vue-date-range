import Vue from 'vue'
import moment from 'moment'
import Calendar from '../../src/Calendar.vue'
import { getRenderedVm, getDayPositionInCalendar } from './tools'

describe('Test Calendar:',  () => {
  it('first day of week should be Monday', () => {
    let vm = getRenderedVm(Calendar, {
      firstDayOfWeek: 1
    })

    const day = vm.$el.querySelector(".week-days span").innerText
    expect(day).to.equal('一')
  })

  it('days between range should have in-range class', () => {
    let vm = getRenderedVm(Calendar, {
      range: {
        startDate: moment(),
        endDate: moment().add(2, 'days')
      }
    })

    const startDay = moment().date()
    const endDay = moment().add(2, 'days').date()
    const $spans = vm.$el.querySelectorAll(".days span .in-range")

    expect($spans.length).to.equal(3)
    expect($spans[0].innerText).to.equal(startDay.toString())
    expect($spans[$spans.length - 1].innerText).to.equal(endDay.toString())
  })

  it('days before today should be disabled', () => {
    let vm = getRenderedVm(Calendar, {
      disableDaysBeforeToday: true
    })

    const $spans = vm.$el.querySelectorAll(".days span")
    const todayPosition = getDayPositionInCalendar(moment(), 0)

    for (var i = 0, len = $spans.length; i < len; i++) {
      if (i < todayPosition-1) {
        var $solar = $spans[i].querySelector(".solar")
        var hasPassiveCls = $solar.className.indexOf('passive') > -1
        expect(hasPassiveCls).to.equal(true)
      }
    }
  })

  it('days between daysDisabledStart and daysDisabledEnd should be disabled', () => {
    let vm = getRenderedVm(Calendar, {
      daysDisabledStart: moment('2017-06-10'),
      daysDisabledEnd: moment('2017-06-16')
    })

    const $spans = vm.$el.querySelectorAll(".days span")
    const startPosition = getDayPositionInCalendar(moment('2017-06-13'), 0)
    const endPosition = getDayPositionInCalendar(moment('2017-06-16'), 0)

    for (var i = 0, len = $spans.length; i < len; i++) {
      if (i <= endPosition - 1 && i>= startPosition - 1) {
        var $solar = $spans[i].querySelector(".solar")
        var hasPassiveCls = $solar.className.indexOf('passive') > -1
      }
    }
  })
})