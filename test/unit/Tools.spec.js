/**
 * Created by ayou on 2017/6/30.
 */
import moment from 'moment'
import * as tools from './tools.js'

describe('Test tools:',  () => {
  it('getDayPositionInCalendar', () => {
    expect(tools.getDayPositionInCalendar(moment('2017-06-30'), 0)).to.equal(34)
  })

  it('formatMonth', () => {
    expect(tools.formatMonth(4)).to.equal('04')
    expect(tools.formatMonth(12)).to.equal('12')
    expect(tools.formatMonth(10)).to.equal('10')
  })
})