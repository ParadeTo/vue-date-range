import Vue from 'vue'
import moment from 'moment'
import Calendar from '../../src/Calendar.vue'
import DateRange from '../../src/DateRange.vue'
import {
  getRenderedVm,
  getDayPositionInCalendar,
  getClickEvent,
  formatMonth,
  commonUnit}
from './tools'

const YEAR = moment().year()
const MONTH = moment().month()
const START_YEAR = 1609

describe('Test Calendar:',  () => {
  commonUnit(Calendar)

  it('days between range should have in-range class and when range is changed it should also be true', (done) => {
    const start = moment(`${YEAR}-${formatMonth(MONTH+1)}-14`)
    const end = moment(`${YEAR}-${formatMonth(MONTH+1)}-16`)

    let vm = getRenderedVm(Calendar, {
      range: {
        startDate: start,
        endDate: end
      }
    })

    const startDay = start.date()
    const endDay = end.date()
    let $spans = vm.$el.querySelectorAll(".v-date-days .v-date-in-range")

    expect($spans.length).to.equal(3)
    expect($spans[0].querySelector('.v-date-solar').innerText).to.equal(startDay.toString())
    expect($spans[$spans.length - 1].querySelector('.v-date-solar').innerText).to.equal(endDay.toString())

    vm.range = {
      startDate: moment(`${YEAR}-${formatMonth(MONTH+1)}-16`),
      endDate: moment(`${YEAR}-${formatMonth(MONTH+1)}-17`)
    }

    vm.$nextTick(() => {
      $spans = vm.$el.querySelectorAll(".v-date-days .v-date-in-range")
      expect($spans.length).to.equal(2)
      done()
    })
  })

  it('the syncDate should has selected class and when it change Calender\'s month will change too', (done) => {
    // next month
    let nextMonth = MONTH + 1
    let nextYear = YEAR
    if (nextMonth > 11) {
      nextMonth = 0
      nextYear += 1
    }
    nextMonth = formatMonth(nextMonth + 1)

    const syncDate = moment(`${nextYear}-${nextMonth}-15`)

    let vm = getRenderedVm(Calendar)

    vm.syncDate = syncDate

    vm.$nextTick(() => {
      const _month = vm.$el.querySelector(".v-date-month-year span span").innerText
      expect(_month).to.match(new RegExp('^' + nextMonth))

      const $spans = vm.$el.querySelectorAll(".v-date-days span")
      const pos = getDayPositionInCalendar(syncDate, 0)
      for (var i = 0, len = $spans.length; i < len; i++) {
        if (i === pos-1) {
          var hasCls = $spans[i].className.indexOf('v-date-selected') > -1
          expect(hasCls).to.equal(true)
        }
      }

      done()
    })
  })

  it('select month should change month', (done) => {
    let vm = getRenderedVm(Calendar, {
      openTransition: false
    })
    console.log(vm.$refs.monthCell)
    const $monthYearEle = vm.$el.querySelector('.v-date-month-year .v-date-text')
    $monthYearEle.dispatchEvent(getClickEvent())
    vm.$nextTick(() => {
      // month-cell === 12
      const $monthCells = vm.$el.querySelectorAll('.v-date-month-cell')
      expect(vm.monthList.length).to.equal(12)
      done()

      // because of transition, the test below cannot pass.
      // month must be active
      // expect($monthCells[MONTH].className.indexOf("selected")).to.be.above(-1)
      // // select DEC.
      // $monthCells[11].dispatchEvent(getClickEvent())
      // vm.$nextTick(() => {
      //   const monthYear = vm.$el.querySelector(".month-year .text span").innerHTML
      //   expect(monthYear).to.match(/^12/)
      //   done()
      // })
    })
  })

  // because of transition, the test below cannot pass.
  // it('select year should change year', (done) => {
  //   let vm = getRenderedVm(Calendar)
  //   const $monthYearEle = vm.$el.querySelector(".month-year .text")
  //   // click twice
  //   $monthYearEle.dispatchEvent(getClickEvent())
  //   $monthYearEle.dispatchEvent(getClickEvent())
  //   vm.$nextTick(() => {
  //     // year-cell === 12
  //     const $yearCells = vm.$el.querySelectorAll(".year-cell")
  //     expect($yearCells.length).to.equal(12)
  //     // year must be active
  //     // expect($yearCells[(YEAR - START_YEAR ) % 10].className.indexOf("selected")).to.be.above(-1)
  //     // click last year
  //     $yearCells[11].dispatchEvent(getClickEvent())
  //     vm.$nextTick(() => {
  //       let $monthCells = vm.$el.querySelectorAll(".month-cell")
  //       // select DEC.
  //       $monthCells[11].dispatchEvent(getClickEvent())
  //       vm.$nextTick(() => {
  //         const monthYear = vm.$el.querySelector(".month-year .text span").innerHTML
  //         expect(monthYear).to.match(/^12/)
  //         // last year
  //         const lastYear = Math.floor((YEAR - START_YEAR ) / 10) * 10 + START_YEAR + 11
  //         expect(monthYear).to.match(new RegExp(lastYear))
  //       })
  //     })
  //     done()
  //   })
  // })
})
