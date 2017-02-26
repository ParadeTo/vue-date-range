A vue component for choosing dates and date ranges. Uses Moment.js for date operations.

# use
``npm install vue-date-range``
```
<date-range :range="range" @change="onChange"></date-range>
...
import {DateRange} from 'vue-date-range';
 export default {
    components: {
      DateRange
...

    methods: {
      onChange(range) {

      }
...
```