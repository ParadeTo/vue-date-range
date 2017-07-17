# vue-date-range 
[![Build Status](https://travis-ci.org/ParadeTo/vue-date-range.svg?branch=master)](https://travis-ci.org/ParadeTo/vue-date-range)
[![Coverage Status](https://coveralls.io/repos/github/ParadeTo/vue-date-range/badge.svg)](https://coveralls.io/github/ParadeTo/vue-date-range)

A vue component for choosing dates and date ranges. Uses Moment.js for date operations. Support Chinese lunar.

![vue-date-range-demo.png](http://om464nmvr.bkt.clouddn.com/vue-date-range-demo.png)

[Live Demo](http://paradeto.com/vue-date-range/)

# use
## npm
``npm install vue-date-range``

### Calendar
```
<calendar class="calendar"
          :show-lunar="true"
          :first-day-of-week="1"
          :disable-days-before-today="disableDaysBeforeToday"
          :sync-date.sync="date"
          :lang="lang" @change="onChange"></calendar>
...
import {Calendar} from 'vue-date-range';
export default {
  components: {
    Calendar
  },
  data() {
    return {
      disableDaysBeforeToday: true,
      lang: 'zh',
      date: moment()
    };
  },
  methods: {
    onChange(date) {
      this.date = date;
    }
  }
}
```

### DateRange
```
<daterange class="calendar" :sync-range.sync="range" :lang="lang" @change="onChange"></daterange>
...
import {DateRange} from 'vue-date-range';
export default {
  components: {
    DateRange
  },
  data() {
    return {
      lang: 'en',
      range: {
        startDate: moment(),
        endDate: moment().add(7, 'days')
      }
    };
  },
  methods: {
    onChange(range) {
      this.range = range;
    },
    setRange (p) {
      if (typeof p === 'number') {
        console.log(p)
        this.range = {
          startDate: moment().add(p, 'days'),
          endDate: moment()
        }
      }
    },
  }
}
```

## browser
Download vue-date-range.min.js from dist/ and import in your web page. Example:

```
...
<div id="calendarLunar" class="calendar-wrapper">
    <span>{{date.format('YYYY-MM-DD')}}</span>
    <calendar class="calendar"
              :show-lunar="true"
              :first-day-of-week="1"
              :disable-days-before-today="disableDaysBeforeToday"
              :sync-date="date"
              :lang="lang" @change="onChange"></calendar>
</div>
...
<div id="range" class="calendar-wrapper">
    <span>{{range.startDate.format('YYYY-MM-DD')}}</span>~<span>{{range.endDate.format('YYYY-MM-DD')}}</span>
    <daterange class="calendar" :sync-range="range" :lang="lang" @change="onChange"></daterange>
    <button @click.stop.prevent="setRange(-7)">Last 7 days</button>
    <button @click.stop.prevent="setRange(-30)">Last 1 month</button>
</div>
...

<script src="//cdn.bootcss.com/moment.js/2.17.1/moment.min.js"></script>
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="../dist/vue-date-range.min.js"></script>
<script>
    new Vue({
        el: '#calendarLunar',
        components: {
          'calendar':daterange.Calendar
        },
        data() {
          return {
            disableDaysBeforeToday: true,
            lang: 'zh',
            date: moment()
          };
        },
        methods: {
          onChange(date) {
            this.date = date;
          }
        }
    });


    new Vue({
        el: '#range',
        components: {
            'daterange':daterange.DateRange
        },
        data() {
          return {
            lang: 'en',
            range: {
              startDate: moment(),
              endDate: moment().add(7, 'days')
            }
          };
        },
        methods: {
          onChange(range) {
            this.range = range;
          },
          setRange (p) {
            if (typeof p === 'number') {
              console.log(p)
              this.range = {
                startDate: moment().add(p, 'days'),
                endDate: moment()
              }
            }
          },
        }
    });
</script>
```

# .sync
For Vue2.3.0+, we can use [`.sync` modifier](https://vuejs.org/v2/guide/components.html#sync-Modifier):
```javascript
<calendar :sync-date.sync="date"></calendar>
<date-range :sync-range.sync="range"></date-range>
```

# v-model
We can also use [`v-model` modifier](https://vuejs.org/v2/guide/components.html#Form-Input-Components-using-Custom-Events) (these can be configured in 2.2.0+):
```javascript
<calendar v-model="date"></calendar>
<date-range v-model="range"></date-range>
```

# Props
## Calendar
* show-lunar: Show lunar or not. Default is false.
* ~~day-of-month: Use to init calendar month, any day in the month is ok. Default is today.~~
* disable-days-before-today: Disable days before today or not.
* days-disabled-start: Disable days after this day.
* days-disabled-end: Disable days before this day.
* disabled-func: Use to decide if the day is disabled or not.
  ```javascript
    ...
	 // set odd days to disabled
     disabledFunc: function (dayMoment) {
       var date = dayMoment.date()
       if (date % 2 === 1) {
         return true
       }
       return false
     }
    ...
  ```
* first-day-of-week: Set the first day of Week. Default is 0 (Sunday).
* lang: Language

| addr. | language |
| ---- | ---- |
|da|Danish|
|en|English|
|es|Spanish|
|fi|Finnish|
|fr|French|
|hr|Hrvatski|
|it|Italian|
|lt|Lithuanian|
|nl|Nederlandse|
|de|German|
|pt-br|Portuguese|
|vi|Vietnamese|
|zh|Chinese|
|ja|Japanese|
|he|Hebrew|
|cs|Czech|
|ru|Russian|
|bg|Bulgarian|
|sv|Swedish|
|th|Thai|
|ro|Roman|
|sl-si|Slovenian|
|uk|Ukrainian|

* sync-date: The default selected date. Can be used as the “two-way binding” for date (Vue 2.3.0+). e.g.:
  ```html
  <calendar :sync-date.sync="date"></calendar>
  ```
* ~~default-date: Init the selected date. Only for Calendar.~~(use syncDate instead)
* range: The selected date range. e.g.: 

  ```javascript
  range: {startDate: moment(), endDate: moment().add(7, 'days')}
  ```

## DateRange
This component is build on ``Calendar``, so it has all the props of ``Calendar`` except ``sync-date``
Also it has its specific props: 

* sync-range: The default date range. Can be used as the “two-way binding” for range (Vue 2.3.0+). e.g.:
  ```html
  <date-range :sync-range.sync="range"></date-range>
  ```
* ~~defaultRange: Used to init the date range~~
