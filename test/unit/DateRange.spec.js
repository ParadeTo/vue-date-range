import Vue from 'vue'
import moment from 'moment'
import Calendar from '../../src/Calendar.vue'
import DateRange from '../../src/DateRange.vue'
import {
  getRenderedVm,
  getUnPassiveDay,
  getClickEvent,
  commonUnit}
from './tools'

const year = moment().year()
const month = moment().month()

describe('Test DateRange:',  () => {
  commonUnit(DateRange)

  it('@change', () => {
    let dateRange

    const vm = new Vue({
      render (h) {
        return h(DateRange, {
          on: {
            change: function (range) {
              dateRange = range
            }
          }
        })
      }
    }).$mount()

    const $spans = vm.$el.querySelectorAll(".days span")

    let clickIndex = getUnPassiveDay($spans)
    $spans[clickIndex].dispatchEvent(getClickEvent())
    const d1 = $spans[clickIndex].querySelector('.solar').innerText

    clickIndex = getUnPassiveDay($spans)
    $spans[clickIndex].dispatchEvent(getClickEvent())
    const d2 = $spans[clickIndex].querySelector('.solar').innerText

    let {startDate, endDate} = dateRange
    if (Number(d1) < Number(d2)) {
      expect(startDate.date().toString()).to.equal(d1)
      expect(endDate.date().toString()).to.equal(d2)
    } else {
      expect(startDate.date().toString()).to.equal(d2)
      expect(endDate.date().toString()).to.equal(d1)
    }
  })

  it('emit on step 0', () =>{
    let dateRange

    const vm = new Vue({
      render (h) {
        return h(DateRange, {
          props: {
            emitChangeOnStep0: true
          },
          on: {
            change: function (range) {
              dateRange = range
            }
          }
        })
      }
    }).$mount()

    const $spans = vm.$el.querySelectorAll(".days span")
    let clickIndex = getUnPassiveDay($spans)
    $spans[clickIndex].dispatchEvent(getClickEvent())
    expect(dateRange.startDate).to.equal(dateRange.endDate)
  })

  it("active month and year must be right", (done) => {
    const startDate = moment("2008-03-08")
    const endDate = moment("2008-04-08")
    const vm = new Vue({
      render (h) {
        return h(DateRange, {
          props: {
            value: {
              startDate,
              endDate
            }
          }
        })
      }
    }).$mount()

    const $monthYearEle = vm.$el.querySelector(".month-year .text")
    $monthYearEle.dispatchEvent(getClickEvent())
    vm.$nextTick(() => {
      const $monthCells = vm.$el.querySelectorAll(".month-cell")
      expect($monthCells[2].className.indexOf("selected")).to.be.above(-1)
      expect($monthCells[3].className.indexOf("selected")).to.be.above(-1)
      $monthYearEle.dispatchEvent(getClickEvent())
      vm.$nextTick(() => {
        const $yearCells = vm.$el.querySelectorAll(".year-cell")
        expect($yearCells[9].className.indexOf("selected")).to.be.above(-1)
      })
      done()
    })
  })
})