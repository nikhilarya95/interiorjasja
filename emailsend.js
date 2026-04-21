function resetForm() {
    // Reset form in index.html (class .form)
    var formIndex = document.querySelector(".form");
    if (formIndex) formIndex.reset();

    // Reset form in ContectUs.html (ID #inquiry-form)
    var formContact = document.getElementById("inquiry-form");
    if (formContact) formContact.reset();

    // Explicitly clear input values as a fallback
    var fields = ['name', 'email', 'mobile'];
    for (var i = 0; i < fields.length; i++) {
        var el = document.getElementById(fields[i]);
        if (el) el.value = "";
    }

    // Hide popup in index.html
    var popup = document.getElementById('popup-enquire');
    if (popup) {
        popup.style.visibility = "hidden";
    }
}

function send(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Capture values
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var mobileInput = document.getElementById('mobile');

    var name = nameInput ? nameInput.value.trim() : "";
    var email = emailInput ? emailInput.value.trim() : "";
    var mobile = mobileInput ? mobileInput.value.trim() : "";

    var ele = document.getElementsByClassName('form__radio-input');
    var intrest = "";

    // Get interest from index.html radios (class form__radio-input)
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            intrest = ele[i].value;
        }
    }

    // Get interest from ContectUs.html radios (name interest)
    if (!intrest) {
        var radios = document.getElementsByName('interest');
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                intrest = radios[i].value;
            }
        }
    }

    if (name && email && mobile) {
        if (typeof Email === "undefined") {
            alert("Email service (SmtpJS) could not be loaded. Please check your internet connection or script blockers.");
            return;
        }

        // Capture body before resetting
        var emailBody = "Name : " + name + "<br>Email : " + email + "<br>Mobile : " + mobile + "<br>Intrested in : " + (intrest || "Not specified");
        var emailSubject = (intrest || "General") + " Enquire";

        // RESET IMMEDIATELY
        resetForm();

        Email.send({
            Host: "smtp.gmail.com",
            Username: "infoaryagroups.private@gmail.com",
            Password: "info@1234Nikhil",
            To: "nikhilarya95@gmail.com",
            From: "infoaryagroups.private@gmail.com",
            Subject: emailSubject,
            Body: emailBody
        }).then(function (response) {
            if (response == 'OK') {
                alert("Mail sent successfully");
            } else {
                alert("Error: " + response);
            }
        }).catch(function (err) {
            alert("System Error: " + err);
        });
    } else {
        alert("Please fill all required fields (Name, Email, and Mobile).");
    }
}

function sendEmail(event) {
    send(event);
}

// Auto-close mobile menu when a link is clicked
document.addEventListener('DOMContentLoaded', function() {
    var navLinks = document.querySelectorAll('.navigation__link');
    var navCheckbox = document.getElementById('navi-toggle');
    
    if (navCheckbox) {
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navCheckbox.checked = false;
            });
        });
    }
});
