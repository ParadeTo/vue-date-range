/**
 * Created by ayou on 2017/6/27.
 */
import Vue from 'vue'

exports.getRenderedVm = function (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData }).$mount()
  return vm
}