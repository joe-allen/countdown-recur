/**
 *
 * @name
 *  countdown_timer()
 *
 * @description
 *  Recurring timer to display countdown. Timer ends
 *  by default @ Sunday, 11:59:59 pm unless
 *  object passed into function call.
 *
 * @dependencies
 *  jQuery, MomentJS, MomentRecurJS, MomentTimezoneJS
 *
 * @augments
 *  textColor: 'green',                   // Color of timer text, defaults to green
 *  endTimeText: "Sorry, time's up!",     // Text to show user after timer ends
 *  debug: false,                         // This stops the time in order to help update the css
 *  endDay: 'Sunday',                     // End day for timer, defaults to "Sunday"
 *  endTime: '11:59:59 pm',               // End time for timer, defaults to "11:59:59 pm", Format like '05:05:20 pm'
 *  startDate: '04/25/2018',              // Set today's date (!important - must set otherwise countdown will not end)
 *  weeksToRecur: 104                     // Set number of weeks countdown should recur, defaults to 2 years
 *
 * @return
 *   init(), html with countdown timer.
 *
 */
(function ( $ ) {

  $.fn.countdown_timer = function(options) {

    // properties
    var settings = $.extend({
      deadline: '',
      debug: false,
      endDay: 'Sunday',
      endTime: '11:59:59 pm',
      endTimeText: "Sorry, this event has expired.",
      isBeforeDeadline: false,
      nextDeadline: '',
      now: '',
      progress: 0,
      recurDay: '',
      startDate: (options.startDate == undefined) ? moment().format('MM/DD/YYYY') : options.startDate,
      timeObj: { days: '', hours: '', minutes: '', seconds: '' },
      timeRemaining: '',
      weeksToRecur: 104
    }, options );

    // element style
    var $el = this;
    $el.css({
      "color": (options.textColor != null) ? options.textColor : "green",
      "flex-direction": (settings.debug) ? "column" : "row",
      "align-items": "center"
    });

    // methods
    var moment_count_down = {

      // cache DOM elements
      jqCache: function() {
        moment_count_down.$seconds_progress = $('#seconds_progress--js');
        moment_count_down.$next_deadline = $('#next_deadline--js');
        moment_count_down.$current_time = $('#current_time--js');
        moment_count_down.$before_date = $('#before_date--js');
        moment_count_down.$time_zone = $('#time_zone--js');
        moment_count_down.$time_left = $('#time_left--js');
        moment_count_down.$clock_days = $('#days--js');
        moment_count_down.$clock_hours = $('#hrs--js');
        moment_count_down.$clock_minutes = $('#mins--js');
        moment_count_down.$clock_seconds = $('#secs--js');
        moment_count_down.$times_up = $('#timesup--js');
      },

      // get the next deadline
      getDeadline: function() {

        var i;
        // store a week from now to see if now and the recur date are equal
        var isToday = moment().add(7, 'd').format('MM/DD/YYYY');


        // loop over settings.recurDay array
        for(i=0; i<settings.recurDay.length; i++) {

          // check if there recur date equal to isToday (0 days left)
          if(settings.recurDay[i] == isToday) {
            // this should return 0 days with only hours remaining
            return settings.now.format('MM/DD/YYYY') +' '+ settings.endTime;
          }

          // debug = true
          if(settings.debug && settings.recurDay[i] == settings.now.format('MM/DD/YYYY')) {
            if(settings.now.format('hh:mm:ss a') > settings.endTime) {
              return settings.recurDay[i+1] +' '+ settings.endTime
            }
          }

          // format dates in order to compare them
          var nextDate = new Date(settings.recurDay[i] +' '+ settings.endTime);
          var nowsDate = new Date(settings.now.format('MM/DD/YYYY') +' '+ settings.endTime);
          var deadlineHasBeenMet = (nextDate >= nowsDate) ? true : false;

          // check that deadline is in future
          if(deadlineHasBeenMet) {

            // return next deadline and exit loop
            return settings.deadline = settings.recurDay[i] +' '+ settings.endTime;
          }
        }

        return false;
      },

      // get difference between current time and deadline
      getDiff: function() {
        var duration = moment.duration(moment().diff(settings.nextDeadline)),
        secondsLeft = Math.abs(duration.asSeconds());
        settings.timeObj.days = Math.abs(duration.days());
        settings.timeObj.hours = Math.abs(duration.hours());
        settings.timeObj.minutes = Math.abs(duration.minutes());
        settings.timeObj.seconds = Math.abs(duration.seconds());

        // shorten vars
        var days = settings.timeObj.days,
        hours = settings.timeObj.hours,
        minutes = settings.timeObj.minutes,
        seconds = settings.timeObj.seconds;

        // send remaining seconds left to getProgress()
        moment_count_down.getProgress(secondsLeft)

        // add '0', make sure time is double digits
        settings.timeObj.hours = (hours <= 9) ? '0'+ hours : hours;
        settings.timeObj.minutes = (minutes <= 9) ? '0'+ minutes : minutes;
        settings.timeObj.seconds = (seconds <= 9) ? '0'+ seconds : seconds;

        return settings.timeRemaining = days+' days '+settings.timeObj.hours+":"+settings.timeObj.minutes+":"+settings.timeObj.seconds;
      },

      // optional progress bar
      getProgress: function(secondsLeft) {

        var secondsInWeek = 604800;
        var progressIncrease =  secondsInWeek - secondsLeft;
        var progressPercentIncrease = Math.round(((progressIncrease / secondsInWeek) * 100) * 100) / 100;

        return settings.progress = progressPercentIncrease;
      },

      // return state of timer (before or after deadline)
      getCountDownState: function() {

        // set var 'settings.isBeforeDeadline'
        return settings.isBeforeDeadline = moment(settings.nextDeadline).isAfter(moment());
      },

      // set html elements
      setElements: function() {

        // countdown sound
        // var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
        // snd.play();

        // show debug if true
        if (settings.debug) {
          return $el.html(
            '<div class="clock_container">'
               + '<div class="days clock_content_container"><div id="days--js" class="num">'+settings.timeObj.days+'</div><div class="text">Days</div></div>'
               + '<div class="hours clock_content_container"><div id="hrs--js" class="hrs">'+settings.timeObj.hours+'</div><div class="text">Hours</div></div>'
               + '<div class="minutes clock_content_container"><div id="mins--js" class="mins">'+settings.timeObj.minutes+'</div><div class="text">Minutes</div></div>'
               + '<div class="seconds clock_content_container"><div id="secs--js" class="secs">'+settings.timeObj.seconds+'</div><div class="text">Seconds</div></div>'
             + '</div>'
             + '<div class="clock_container" style="border-top: 4px solid firebrick; margin-top: 40px; padding-top: 40px; font-size: .75em; text-align: center;">'
               + '<div class="seconds clock_content_container"><div class="text">Next deadline:</div><div id="secs--js" class="secs">'+settings.nextDeadline+'</div></div>'
               + '<div class="seconds clock_content_container"><div class="text">Debug mode:</div><div id="secs--js" class="secs">'+settings.debug+'</div></div>'
               + '<div class="seconds clock_content_container"><div class="text">You arrived at:</div><div id="secs--js" class="secs">'+settings.now.format('LLLL')+'</div></div>'
             + '</div>'
          );
        }

        // set elements if time still remains
        if (settings.isBeforeDeadline) {

          return $el.html('<div class="days clock_content_container"><div id="days--js" class="num">'+settings.timeObj.days+'</div><div class="text">Days</div></div>'
             + '<div class="hours clock_content_container"><div id="hrs--js" class="hrs">'+settings.timeObj.hours+'</div><div class="text">Hours</div></div>'
             + '<div class="minutes clock_content_container"><div id="mins--js" class="mins">'+settings.timeObj.minutes+'</div><div class="text">Minutes</div></div>'
             + '<div class="seconds clock_content_container"><div id="secs--js" class="secs">'+settings.timeObj.seconds+'</div><div class="text">Seconds</div></div>'
          );

        } else {

          // Time has ended. return element with "Time's up" text
          return $el.html('<div class=""><div id="times_up" class="text">'+settings.endTimeText+'</div></div>'
            + '<span id="seconds_progress--js" class="countdown_progress"></span>'
          );
        }

        // set progress bar
        // var progressCSSWidth = (settings.isBeforeDeadline) ? settings.progress : 100;
        // moment_count_down.$seconds_progress.css({
        //  'width': progressCSSWidth + '%'
        // });

      },

      // call init on doc ready
      init: function() {

        // guess user time zone
        var userTimeZone = moment.tz.guess();

        // set props
        settings.now = (typeof(userTimeZone) != undefined || typeof(userTimeZone) != null)
          ? moment.tz(userTimeZone)
          : moment();


        settings.recurDay = moment(settings.startDate).recur()
          .every([(options.endDay != null) ? options.endDay : "Sunday"]).daysOfWeek()
          .next(settings.weeksToRecur, "L");

        settings.nextDeadline = moment_count_down.getDeadline();
        settings.timeRemaining = moment_count_down.getDiff();
        settings.isBeforeDeadline = moment_count_down.getCountDownState();

        // initiate cache and methods
        moment_count_down.jqCache();
        moment_count_down.setElements();

        // update every second if deadline not passed
        if(settings.isBeforeDeadline === true && !settings.debug) {

          setInterval(function() {

            // call methods continuously
            moment_count_down.getDiff();
            moment_count_down.setElements();
            moment_count_down.getCountDownState();
            settings.nextDeadline = moment_count_down.getDeadline();
          }, 1000);
        }
      }
    }

    // return timer
    return moment_count_down.init();
  }

}( jQuery ));