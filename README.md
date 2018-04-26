# Countdown Recur

**A jQuery plugin for a weekly countdown timer which easily allows for the customization of start date, end time and number of weeks to repeat.**

## Dependencies

To use this plugin you need these dependencies:

- [jQuery](https://nodejs.org/en/) (3.2.1 or greater)
- [MomentJS](https://momentjs.com/) (2.22 or greater)
- [MomentRecur](https://github.com/c-trimm/moment-recur)
- [MomentTimeZone](https://momentjs.com/timezone/) (.5.14 or greater)

### Installation
```html
<div id="countdown_timer"></div>
```
```javascript
$('#countdown_timer').countdown_timer({
  startDate: '04/25/2018',
  weeksToRecur: 4
});
```

#### Settings
```javascript
  // Madatory settings:
  startDate: '04/25/2018',              // Set today's date (!important - must set otherwise countdown will not end)
  weeksToRecur: 1                       // Set number of weeks countdown should recur, defaults to 4 weeks

  // Optional settings:
  debug: false,                         // This stops the time in order to update the css
  textColor: 'green',                   // Color of timer text, defaults to green
  endDay: 'Friday',                     // End day for timer, defaults to "Sunday"
  endTime: '05:00:01 pm',               // End time for timer, defaults to "11:59:59 pm", Format like '05:05:20 pm'
  deadlineText: "Are you still working?!",    // Text to show user after timer ends
```

#### Things to remember

If startDate is set before today's date/time it will still function. Keep in mind, it will continue to run the number of weeks set in `weeksToRecur` after that of the `startDate`.

For the least amount of timer down time, it's recommended to use an `endTime` of "11:59:59 pm", because the countdown stops on the `endDay` after `endTime` and won't pick back up the next day at 12:00:00am.

#### ToDo

[] - Test

