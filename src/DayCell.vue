<template>
  <span class="ayou-day-cell"
        :class="dayClass"
        :title="showLunar && lunarText"
        @click.stop.prevent="handleDayClick()">
    <div class="solar">{{day.dayMoment.date()}}</div>
    <div class="lunar" :class="{'festival': isFestival}" v-if="showLunar">
      {{lunarText}}
    </div>
  </span>
</template>
<script type="text/ecmascript-6">
  import transformer from './solar_lunar'

  export default {
    props: {
      showLunar: {
        type: Boolean,
        default: false
      },
      dayClassFunc: {
        type: Function,
        default: null
      },
      day: {
        type: Object
      },
      isSelected: {
        type: Boolean,
        default: false
      },
      isInRange: {
        type: Boolean,
        default: false
      },
      isStartDay: {
        type: Boolean,
        default: false
      },
      isEndDay: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        lunar: this.solar2lunar(this.day)
      }
    },
    watch: {
      day (val) {
        this.lunar = this.solar2lunar(val)
      }
    },
    methods: {
      handleDayClick () {
        if (this.day.isPassive) return
        this.$emit('dayClick', this.day)
      },
      solar2lunar (day) {
        return transformer.solar2lunar(day.dayMoment.year(), day.dayMoment.month() + 1, day.dayMoment.date())
      }
    },
    computed: {
      dayClass() {
        const {isSelected, day, isInRange, isStartDay, isEndDay} = this
        let cls = [{
          'selected': isSelected,
          'passive': day.isPassive,
          'in-range': isInRange,
          'start-day': isStartDay,
          'end-day': isEndDay
        }]

        if (typeof this.dayClassFunc === 'function') {
          const _cls = this.dayClassFunc(day.dayMoment)
          if (Object.prototype.toString.call(_cls) === '[object Array]') {
            cls = cls.concat(_cls)
          }
        }
        return cls
      },
      lunarText () {
        return this.lunar && (this.lunar.calendarFestivals || this.lunar.lunarFestivals || this.lunar.Term || this.lunar.IDayCn)
      },
      isFestival () {
        if (this.lunar && (this.lunar.calendarFestivals || this.lunar.lunarFestivals || this.lunar.Term)) {
          return true
        }
        return false
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
    @import "./_var.less";

    .ayou-day-cell {
        padding: 2px 0;
        width: 14.28%;
        display: inline-block;
        font-size: 1rem;
        text-align: center;

        &:hover {
            cursor: pointer;
        }

        &.passive {
            color: @grey;
        }

        &.selected {
            .solar {
                border-radius: 50%;
                background-color: @primary;
                color: #fff;
            }
        }

        &.in-range {
            .solar {
                border-radius: 50%;
                background-color: @primary-light;
                color: #fff;
            }
        }

        &.passive {
            .solar {
                &.in-range {
                    opacity: 0.4;
                }
                &.selected {
                    opacity: 0.4;
                }
            }
            .lunar {
                opacity: 0.4;
            }
        }

        .solar {
            display: inline-block;
            width: 2.4rem;
            height: 2.4rem;
            line-height: 2.4rem;
            font-size: 1rem;
        }

        .lunar {
            font-size: 0.8rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.festival {
                color: @secondary;
            }
        }
    }
</style>
