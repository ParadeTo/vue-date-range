A vue component for choosing dates and date ranges. Uses Moment.js for date operations.

![vue-date-range-demo.png](http://om464nmvr.bkt.clouddn.com/vue-date-range-demo.png)

[Live Demo](http://paradeto.com/vue-date-range/)

# use
## npm
``npm install vue-date-range``
### Calendar
```
<calendar :day-of-month="dayOfMonth" :first-day-of-week="1" :selected-date="selectedDate" :disable-days-before-today="disableDaysBeforeToday" :lang="lang" @change="onChange"></calendar>
...
import {Calendar} from 'vue-date-range';
export default {
  components: {
    Calendar
  },
  data: {
    dayOfMonth: moment().add(1, 'months'),
    selectedDate: moment().add(1, 'months'),
    disableDaysBeforeToday: true,
    lang: 'en',
    date: moment().format('YYYY-MM-DD')
  },
  methods: {
    onChange(date) {
      this.date = date.format('YYYY-MM-DD');
    }
  }
}
```

### DateRange
```
<date-range :lang='lang' :range="range" @change="onChange"></date-range>
...
import {DateRange} from 'vue-date-range';
export default {
  components: {
    DateRange
  },
  data: {
    lang: 'en',
    range: {
      startDate: moment(),
      endDate: moment().add(7, 'days')
    }
  },
  methods: {
    onChange(range) {
      this.range = range;
    }
  }
}
```

## browser
Download vue-date-range.js from dist/ and import in your web page. Example:

```
...
<h2>calendar</h2>
<div id="calendar">
    <span>{{date}}</span>
    <calendar :day-of-month="dayOfMonth" :first-day-of-week="1" :selected-date="selectedDate" :disable-days-before-today="disableDaysBeforeToday" :lang="lang" @change="onChange"></calendar>
</div>
<h2>date-range</h2>
<div id="range">
    <span>{{range.startDate.format('YYYY-MM-DD')}}</span>~<span>{{range.endDate.format('YYYY-MM-DD')}}</span>
    <daterange :range="range" :lang="lang" @change="onChange"></daterange>
</div>
...

<script src="//cdn.bootcss.com/moment.js/2.17.1/moment.min.js"></script>
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="../dist/vue-date-range.js"></script>
<script>
    new Vue({
        el: '#calendar',
        components: {
          'calendar':daterange.Calendar
        },
        data: {
          dayOfMonth: moment().add(1, 'months'),
          selectedDate: moment().add(1, 'months'),
          disableDaysBeforeToday: true,
          lang: 'en',
          date: moment().format('YYYY-MM-DD')
        },
        methods: {
          onChange(date) {
            this.date = date.format('YYYY-MM-DD');
          }
        }
    });
    
    new Vue({
        el: '#range',
        components: {
            'daterange':daterange.DateRange
        },
        data: {
          lang: 'en',
          range: {
            startDate: moment(),
            endDate: moment().add(7, 'days')
          }
        },
        methods: {
          onChange(range) {
            this.range = range;
          }
        }
    });
</script>
```

# Props
* day-of-month: Use to init calendar month, any day in the month is ok. Default is today.
* disable-days-before-today: Disable days before today.
* first-day-of-week: Set the first day of Week. Default is 0 (Sunday).
* lang: Language, see in src/DateLanguages.js
* selected-date: Init the selected date. Only for Calendar.
* range: Use for date range.

```
range: {startDate: moment(), endDate: moment().add(7, 'days')}
```

