import Vue from 'vue'
import DayCell from '../../src/DayCell.vue'

describe('Test for DayCell:',  () => {
  it('has a created hook', () => {
    expect(typeof DayCell.data).equals('function')
  })
})