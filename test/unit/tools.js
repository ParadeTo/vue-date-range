/**
 * Created by ayou on 2017/6/27.
 */
import Vue from 'vue'

exports.getRenderedVm = function (Component, propsData) {
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
exports.getDayPositionInCalendar = function (dayMoment, firstDayOfWeek) {
  const tmp = dayMoment.clone()
  const startOfMonth = tmp.startOf('month').isoWeekday()
  // previous month's days
  const diff = (Math.abs(firstDayOfWeek - (startOfMonth + 7)) % 7)
  const date = dayMoment.date()
  return diff + date
}