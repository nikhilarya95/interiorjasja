function send(event) {
    event.preventDefault();
    
    var name = "";
    var email = "";
    var mobile = "";

    Cname = document.getElementById('name').value;
    email = document.getElementById('email').value;
    mobile = document.getElementById('mobile').value;
    var ele = document.getElementsByClassName('form__radio-input'); 
     if(Cname && email && mobile && ele){  
    for(i = 0; i < ele.length; i++) { 
        if(ele[i].checked) 
        var intrest = ele[i].value; 
    } 
    Email.send({
      name:document.getElementById('name').value,    
      Host : "smtp.gmail.com",
      Username : "infoaryagroups.private@gmail.com",
      Password : "ary@!nfo2021",
      To : "infoaryagroups.private@gmail.com",
      From : "infoaryagroups.private@gmail.com",
      Subject : intrest + " Enquire",
      Body : "Name : "+Cname+"<br>Email : "+email+"<br>Mobile : "+mobile+"<br>Intrested in : "+intrest
      }).then(function(response){ 
          
       if (response == 'OK') {              
           alert("Mail sent succeessfully");
           document.getElementById('popup-enquire').style.visibility ="hidden";
           document.getElementsByClassName("form").reset();
           name="";
           email="";
           mobile="";
           
        } else {
            throw new Error("Error: " + response.statusText);
        } 
     });
    }

}    