import Vue from 'vue'
import moment from 'moment'
import DayCell from '../../src/DayCell.vue'
import { getRenderedVm } from './tools'

describe('Test DayCell:',  () => {
  it('should not show lunar by default', () => {
    let vm = getRenderedVm(DayCell, {
      day: {
        dayMoment: moment()
      }
    })

    const ele = vm.$el.getElementsByClassName('v-date-lunar')
    expect(ele.length).to.equal(0)
  })

  it('April 1st is Fools\' Day', () => {
    let vm = getRenderedVm(DayCell, {
      day: {
        dayMoment: moment('2017-04-01')
      },
      showLunar: true
    })

    expect(vm.lunarText).to.equal('愚人节')
  })

  it('January 1st is a festival', () => {
    let vm = getRenderedVm(DayCell, {
      day: {
        dayMoment: moment('2017-01-01')
      }
    })

    expect(vm.isFestival).to.equal(true)
  })

  it('lunar should change according to day', done => {
    let vm = getRenderedVm(DayCell, {
      day: {
        dayMoment: moment('2017-01-02')
      }
    })

    expect(vm.isFestival).to.equal(false)

    vm.day = {
      dayMoment: moment('2017-01-01')
    }

    Vue.nextTick(function () {
      expect(vm.isFestival).to.equal(true)
      done()
    })
  })
})