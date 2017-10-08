function updatemyCal() {

    // WARNING - this function COMPLELETELY clears akk events from today to one year in the future. 
    try {
        var fromDate = new Date(); //today
        var toDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)) //ONE year from today
        var events = CalendarApp.getDefaultCalendar().getEvents(fromDate, toDate);
        for (var i = 0; i < events.length; i++) {
            var ev = events[i];
            ev.deleteEvent();
        };
        MailApp.sendEmail("your@gmail.com", "Script Run", fromDate); // sends an email when its has run

    } catch (e) {
        MailApp.sendEmail("your@gmail.com", "Script Error on Function 1", e.message);
    }
} //end clearFutureCal    


// fetch and return this ical file as a string, and parse it into 'jcal' (with the ical lib) */
try {
    var icalData = UrlFetchApp.fetch("http://examplesite.com/events/feed/ical").getContentText();
    Logger.log(icalData);

    var jcalData = ICAL.parse(icalData);
    var vcalendar = new ICAL.Component(jcalData);
    var vevent = vcalendar.getFirstSubcomponent('vevent');
    var vevents = vcalendar.getAllSubcomponents("vevent");
    var parsed = vevents.map(function(vevent) {
        return {
            description: vevent.getFirstPropertyValue("description"), // this becomes the Calendar Event's Title which  is the author's display name.  */
            title: vevent.getFirstPropertyValue("description"), // this is the post "title" in the plugin, which becomes the Calendar Event's Description box */
            dayoffStart: vevent.getFirstPropertyValue("dtstart"),
            dayoffEnd: vevent.getFirstPropertyValue("dtend"),
            created: vevent.getFirstPropertyValue("dtstamp"), // when the  event was created. goes into the event desc  */   
        };
    }, this);


    // loop the array from the ical file and push to google calendar
    parsed.forEach(function(event) {
        var newEvent = CalendarApp.getDefaultCalendar().createEvent( //need to change default calendar to Availbility Calendar with getCalendarById
            event.title,
            new Date(event.dayoffStart.toJSDate()),
            new Date(event.dayoffEnd.toJSDate()), {
                description: "CREATED ON: " + event.created.toJSDate()
            });
    }, this);

} catch (e) {
    MailApp.sendEmail("your@email.com", "ICal Script Error on Function 2", e.message);
}
