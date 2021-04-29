const cron = require('node-cron');
const con = require('./db');
getNextDate = (date,month) => {
    var day = date.getDate();
    var mth = date.getMonth();
    var yr = date.getFullYear();
    var newDay = day;
    var newMonth = (mth+month-1)%12+1;
    var newYear = yr+Math.floor(month/12);
    var newDate = new Date(newYear,newMonth,newDay);
    return newDate;
}
cron.schedule("* * * * *", () => {
    con.query('select * from student;',(err,result,f)=> {
        var today_date = new Date();
    
        var report_date = result[0].date_of_admission;
        var next_date1 = getNextDate(report_date,6);
        var next_date2 = getNextDate(report_date,7);
        
        console.log(report_date);
        console.log(next_date1,next_date2);
    });
});
