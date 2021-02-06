




    var Uname = window.getElementById("name").value;
    var Uemail = document.getElementById("email").value;
    var radio = document.getElementsByName("enquire").value;
    const nodemailer = require('nodemailer'); 
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:'infoaryagroups.private@gmail.com',
            pass:'ary@!nfo2021'
        }
    });
    
    let mailOptions = {
        from: 'infoaryagroups.private@gmail.com',
        to: 'jasja0011@gmail.com',
        subject: 'Interior',
        text :' Customer Detail',
        text : Uname,
        text : Uemail
    };
    
    transporter.sendMail(mailOptions, function(err, data){
        if(err){
            console.log('Error Occurs',err);
        }
        else{
            console.log('email sent!!!!');
        }
    });
    




