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
cron.schedule("30 6 * * 1",() => {
// cron.schedule("* * * * *", () => {

    //Background Job for 6 Month Remainder
    con.query('select * from student s left join login l on l.id = s.stud_id;',(err,result,f)=> {
        var today_date = new Date();
        result.forEach(results => {
            var admission_date = results.date_of_admission;
            var passout_date = results.passout_date;
            // var next_date1 = getNextDate(report_date,6);
            // var next_date2 = getNextDate(report_date,7);
            var next_date1 = [];
            var next_date2 = [];
            var i=1;
            while(1){
                var date1 = getNextDate(admission_date,6*i);
                var date2 = getNextDate(admission_date,6*i+1);
                if(date1.getTime() > passout_date)
                    break;
                next_date1.push(date1);
                next_date2.push(date2);
                i+=1;
            }
            for(var k=0;k<next_date1.length;k++){
                if(today_date.getTime() >= next_date1[k] && today_date.getTime() <= next_date2[k])
                    console.log(`Send Mail to ${results.email}`)    //send mail here
                else
                    console.log(`OK for ${results.name}`);
            }
        });
    });
    //Background Job for 3 Years Submission Remainder
    con.query('select * from student s left join professor p on p.prof_id = s.supervisor_id left join login l on l.id = p.prof_id;',(err,result,f)=> {
        var today_date = new Date();
        result.forEach(results => {
            var admission_date = results.date_of_admission;
            var passout_date = results.passout_date;
            var next_date1 = [];
            var next_date2 = [];
            var i=1;
            while(1){
                var date1 = getNextDate(admission_date,36*i);
                var date2 = getNextDate(admission_date,36*i+1);
                if(date1.getTime() > passout_date)
                    break;
                next_date1.push(date1);
                next_date2.push(date2);
                i+=1;
            }
            for(var k=0;k<next_date1.length;k++){
                if(today_date.getTime() >= next_date1[k] && today_date.getTime() <= next_date2[k])
                    console.log(`Send Mail to ${results.email} for student ${results.name}`)    //send mail here
                else
                    console.log(`OK for ${results.name} and ${results.email}`);
            }
        });
    });
});