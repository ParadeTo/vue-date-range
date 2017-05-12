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
          :default-date="date"
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
<daterange class="calendar" :default-range="range" :lang="lang" @change="onChange"></daterange>
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
Download vue-date-range.js from dist/ and import in your web page. Example:

```
...
<div id="calendarLunar" class="calendar-wrapper">
    <span>{{date.format('YYYY-MM-DD')}}</span>
    <calendar class="calendar"
              :show-lunar="true"
              :first-day-of-week="1"
              :disable-days-before-today="disableDaysBeforeToday"
              :default-date="date"
              :lang="lang" @change="onChange"></calendar>
</div>
...
<div id="range" class="calendar-wrapper">
    <span>{{range.startDate.format('YYYY-MM-DD')}}</span>~<span>{{range.endDate.format('YYYY-MM-DD')}}</span>
    <daterange class="calendar" :default-range="range" :lang="lang" @change="onChange"></daterange>
    <button @click.stop.prevent="setRange(-7)">Last 7 days</button>
    <button @click.stop.prevent="setRange(-30)">Last 1 month</button>
</div>
...

<script src="//cdn.bootcss.com/moment.js/2.17.1/moment.min.js"></script>
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="../dist/vue-date-range.js"></script>
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

# Props
## Calendar
* show-lunar: Show lunar or not. Default is false.
* day-of-month: Use to init calendar month, any day in the month is ok. Default is today.
* disable-days-before-today: Disable days before today or not.
* first-day-of-week: Set the first day of Week. Default is 0 (Sunday).
* lang: Language, see in src/locals.js
* default-date: Init the selected date. Only for Calendar.
* range: The selected date range. Like this: 

  ```
  range: {startDate: moment(), endDate: moment().add(7, 'days')}
  ```
  
## DateRange
This component is build on ``Calendar``, so it has all the props of ``Calendar`` except ``default-date``
Also it has its specific props: 

* defaultRange: Use to init the date range
