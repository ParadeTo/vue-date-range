import Vue from 'vue'
import moment from 'moment'
import Calendar from '../../src/Calendar.vue'
import { getRenderedVm } from './tools'

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
})