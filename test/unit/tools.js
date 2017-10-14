/**
 * Created by ayou on 2017/6/27.
 */
import Vue from 'vue'
import moment from 'moment'

function getRenderedVm(Component, propsData = {}) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData }).$mount()
  return vm
}

/**
 * get the day's position in calendar, eg. 2017/06/29 should be 33 when firstDayOfWeek is 0
 * @param dayMoment
 * @param firstDayOfWeek
 * @returns {*}
 */
function getDayPositionInCalendar(dayMoment, firstDayOfWeek) {
  const tmp = dayMoment.clone()
  const startOfMonth = tmp.startOf('month').isoWeekday()
  // previous month's days
  const diff = (Math.abs(firstDayOfWeek - (startOfMonth + 7)) % 7)
  const date = dayMoment.date()
  return diff + date
}

function formatMonth(month) {
  if (month < 10) {
    return '0' + month
  }
  return '' + month
}

function getUnPassiveDay($spans) {
  let r
  let isPassive
  do {
    r = Math.floor(Math.random() * $spans.length)
    isPassive = $spans[r].querySelector('.solar').className.indexOf('passive') > -1
  } while (isPassive)
  return r
}

function getClickEvent(){
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('click', true, true);
  return evt
}

exports.getRenderedVm = getRenderedVm

exports.getDayPositionInCalendar = getDayPositionInCalendar

exports.formatMonth = formatMonth

exports.getUnPassiveDay = getUnPassiveDay

exports.getClickEvent = getClickEvent

/**
 * tests for Calendar and DateRange
 * @param Comp
 */
exports.commonUnit = function (Comp) {
  const year = moment().year()
  const month = moment().month()

  it('first day of week should be Monday', () => {
    let vm = getRenderedVm(Comp, {
      firstDayOfWeek: 1
    })

    const day = vm.$el.querySelector(".week-days span").innerText
    expect(day).to.equal('一')
  })

  it('days before today should be disabled', () => {
    let vm = getRenderedVm(Comp, {
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
    const start = moment(`${year}-${formatMonth(month+1)}-14`)
    const end = moment(`${year}-${formatMonth(month+1)}-16`)

    let vm = getRenderedVm(Comp, {
      daysDisabledStart: start,
      daysDisabledEnd: end
    })

    const $spans = vm.$el.querySelectorAll(".days span")
    const startPosition = getDayPositionInCalendar(start, 0)
    const endPosition = getDayPositionInCalendar(end, 0)
    for (var i = 0, len = $spans.length; i < len; i++) {
      if (i <= endPosition - 1 && i>= startPosition - 1) {
        var $solar = $spans[i].querySelector(".solar")
        var hasPassiveCls = $solar.className.indexOf('passive') > -1
      }
    }
  })

  it('odd days should be disabled', () => {
    let vm = getRenderedVm(Comp, {
      disabledFunc: function (dayMoment) {
        var date = dayMoment.date()
        if (date % 2 === 1) {
          return true
        }
        return false
      }
    })

    const $spans = vm.$el.querySelectorAll(".days span")
    for (var i = 0, len = $spans.length; i < len; i++) {
      var $solar = $spans[i].querySelector(".solar")
      var date = $solar.innerText
      var hasPassiveCls = $solar.className.indexOf('passive') > -1

      if (date % 2 === 1) {
        expect(hasPassiveCls).to.equal(true)
      }
    }
  })

  it('first day of week should be "Mon" when lang is "en"', () => {
    let vm = getRenderedVm(Comp, {
      lang: 'en',
      firstDayOfWeek: 1
    })

    const $weekDays = vm.$el.querySelectorAll(".week-days span")
    const firstDayOfWeek = $weekDays[0].innerText
    expect(firstDayOfWeek).to.equal('Mon')
  })

  it('click a day will change selected day', (done) => {
    let vm = getRenderedVm(Comp)

    const $spans = vm.$el.querySelectorAll(".days span")
    const clickIndex = getUnPassiveDay($spans)
    const clickDay = $spans[clickIndex].querySelector('.solar').innerText

    $spans[clickIndex].dispatchEvent(getClickEvent())

    vm.$nextTick(() => {
      const seletecDay = vm.$el.querySelector(".days span .selected").innerText
      expect(clickDay).to.equal(seletecDay)
      done()
    })
  })

  it('click next month should change the calendar', (done) => {
    // next month
    let nextMonth = month + 1
    if (nextMonth > 11) {
      nextMonth = 0
    }
    nextMonth = formatMonth(nextMonth+1)

    let vm = getRenderedVm(Comp)

    let $btn = vm.$el.querySelectorAll('.month-button')

    $btn[1].dispatchEvent(getClickEvent())

    vm.$nextTick(() => {
      const _month = vm.$el.querySelector(".month-year span span").innerText
      expect(_month).to.match(new RegExp('^' + nextMonth))
      done()
    })
  })

  it('click prev month should change the calendar', (done) => {
    // prev month
    let prevMonth = month - 1
    if (prevMonth < 0) {
      prevMonth = 11
    }
    prevMonth = formatMonth(prevMonth+1)

    const vm = getRenderedVm(Comp)

    const $btn = vm.$el.querySelectorAll('.month-button')

    $btn[0].dispatchEvent(getClickEvent())

    vm.$nextTick(() => {
      const _month = vm.$el.querySelector(".month-year span span").innerText
      expect(_month).to.match(new RegExp('^' + prevMonth))
      done()
    })
  })
}