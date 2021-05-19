const cron = require('node-cron');
const con = require('./db');
const fs = require('fs');
const sendEmail = require('./services/sendEmail');

const backgroundJobs = () => {

    console.log('Background Jobs started');
    
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
    
    cron.schedule("* * * * *",() => {
    // cron.schedule("* * * * * *", () => {
        // console.log('Background 1');
        //Background Job for 6 Month Remainder
        con.query('select * from student s left join login l on l.id = s.stud_id;',(err,result,f)=> {
            if(err) {
                console.log("Error: " + err);
                return;
            }
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
                    if(today_date.getTime() >= next_date1[k] && today_date.getTime() <= next_date2[k]) {
                        const qry = `select * from six_monthly_report where stud_id = "${results.stud_id}" and semester = "Semester${k+1}"`;
                        con.query(qry, (err,result2,f)=> {
                            if(err) {
                                console.log(err);
                                return;

                            }
                            if(result2.length == 0) {
                                mailData = {
                                    to: results.email, 
                                    subject: `Reminder to upload Six monthly report for Semester ${k+1}`,
                                    html: `<p>Hello ${results.name},</p><p>This is to remind you that you need to upload your six monthly report for semester ${k+1}</p>`
                                };
                                sendEmail(mailData, function(error, info) {
                                    if(error) {
                                        console.log(`Email sending to ${results.email} failed!`);
                                    } else {
                                        console.log(`Successfully sent mail to ${results.email}!`);
                                    }
                                });
                            }
                        })   
                    }
                }
            });
        });
      
        //Background Job for 1 month remainder
        con.query(`select * from External where phase = 1 and last_mail_sent_date is not null`,(err,result,fields)=>{
            if(err) {
                console.log("Error: " + err);
                return;
            }
            var today_date = new Date();
            result.forEach(results => {
                var lastSeen = results.last_mail_sent_date;
                var next_date1 = getNextDate(lastSeen,1);
                var next_date2 = getNextDate(lastSeen,2);
                console.log(lastSeen + ' ' + next_date1 + ' ' + next_date2);
                if(next_date1<=today_date && next_date2>=today_date) {
                    var htmlFile = fs.readFileSync('views/mailService/main.html','utf-8');
                    console.log('Valid');
                    var pass = randomstring.generate(10);
                    var url = `${results.Email} ${pass} ${req.body.stud_id}`;
                    console.log(url)
                    const hash = encrypt(url);
                    htmlFile = htmlFile.replace('{%query%}',`iv=${hash.iv}&content=${hash.content}`);
                    htmlFile = htmlFile.replace('{%query%}',`iv=${hash.iv}&content=${hash.content}`);
                    htmlFile = htmlFile.replace('{%username%}',results.Email);
                    htmlFile = htmlFile.replace('{%password%}',pass);
                    htmlFile = htmlFile.replace('{%ROOT_URL%}',ROOT_URL);
                    htmlFile = htmlFile.replace('{%ROOT_URL%}',ROOT_URL);

                    mailData = {
                        to: results.Email, 
                        subject: 'Reminder to accept/reject examiner proposal',
                        html: htmlFile
                    };

                    sendEmail(mailData, function(error, info) {
                        if(error) {
                            console.log(`Email sending to ${results.Email} failed!`);
                        } else {
                            console.log(`Successfully sent mail to ${results.Email} for ${results.Student_ID}! for Examiner`);
                        }
                    });
                }
<<<<<<< HEAD
                else
                    console.log(`Examiner OK for ${results.Email} and ${results.Student_ID}`);
=======
                
>>>>>>> Debug
            });
        });
    });
}

module.exports = backgroundJobs;
