A vue component for choosing dates and date ranges. Uses Moment.js for date operations.

![](https://github.com/ParadeTo/vue-date-range/blob/master/img/demo.png)

[Live Demo](http://localhost:4444)

# use
``npm install vue-date-range``
## Calendar
```
<calendar :disable-days-before-today="true" :lang="lang" @change="onChange"></calendar>
...
import {Calendar} from 'vue-date-range';
export default {
  components: {
    Calendar
  },
  data: {
    lang: 'en',
    date: null
  },
  methods: {
    onChange(date) {
      this.date = date.format('YYYY-MM-DD');
    }
  }
}
```

## DateRange
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

# Props
* firstDayOfWeek: Set the first day of Week. Default is 0 (Sunday).
* dayOfMonth: Use to init calendar month, any day in the month is ok. Default is today.
* disable-days-before-today: Disable days before today.
* range: Use for date range.
```
range: {startDate: moment(), endDate: moment().add(7, 'days')}
```
* lang: Language, see in src/DateLanguages.js
