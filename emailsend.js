function showToast(message, type = 'success') {
    console.log("Jasja Toast: " + message + " [" + type + "]");
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') toast.style.borderLeftColor = '#e74c3c';
    if (type === 'info') toast.style.borderLeftColor = '#3498db';
    
    let icon = '✓';
    if (type === 'error') icon = '!';
    if (type === 'info') icon = '✉';
    
    toast.innerHTML = `
        <div class="toast-icon" style="${type === 'error' ? 'background:#e74c3c' : (type === 'info' ? 'background:#3498db' : '')}">${icon}</div>
        <div class="toast-message">${message}</div>
        <div class="toast-progress" style="${type === 'error' ? 'background:#e74c3c' : (type === 'info' ? 'background:#3498db' : '')}"></div>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove after 6 seconds (info toasts stay for 3s or until replaced)
    const duration = type === 'info' ? 3000 : 6000;
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 600);
        }
    }, duration);

    return toast;
}

// Initialize EmailJS with your Public Key from config.js
if (typeof CONFIG !== 'undefined') {
    emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
}

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

    // Hide popup in index.html by changing the hash
    var popup = document.getElementById('popup-enquire');
    if (popup) {
        // Clear any inline visibility style that might have been set
        popup.style.visibility = "";
        // Change hash to hide popup without jumping to top if possible, 
        // but consistent with the close button which uses "#"
        if (window.location.hash === "#popup-enquire") {
            window.location.hash = "#";
        }
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

    console.log("Send function triggered. Name: " + name + ", Email: " + email + ", Mobile: " + mobile);

    if (name && email && mobile) {
        if (typeof emailjs === "undefined") {
            console.error("EmailJS SDK is not loaded.");
            showToast("Email service could not be loaded. Please check your connection.", "error");
            return;
        }
        console.log("EmailJS service is loaded. Sending email...");

        // Capture body before resetting
        var emailBody = "Name : " + name + "<br>Email : " + email + "<br>Mobile : " + mobile + "<br>Intrested in : " + (intrest || "Not specified");
        var emailSubject = (intrest || "General") + " Enquire";

        // RESET IMMEDIATELY
        resetForm();

        // Immediate feedback
        showToast("Sending your inquiry... please wait.", "info");

        var templateParams = {
            name: name,
            email: email,
            mobile: mobile,
            service: intrest || "General Inquiry",
            title: (intrest || "General") + " Enquire" // Matches {{title}} in your subject
        };

        if (typeof CONFIG !== 'undefined') {
            emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, templateParams)
                .then(function (response) {
                    console.log("EmailJS Success!", response.status, response.text);
                    showToast("Success! Mail sent successfully. We will contact you soon.");
                }, function (error) {
                    console.error("EmailJS Failed...", error);
                    showToast("Error: Failed to send mail. Please try again.", "error");
                });
        } else {
            console.error("Config not found!");
            showToast("Configuration error. Please contact support.", "error");
        }
    } else {
        showToast("Please fill all required fields.", "error");
    }
}

function sendEmail(event) {
    send(event);
}

// Auto-close mobile menu when a link is clicked
document.addEventListener('DOMContentLoaded', function () {
    var navLinks = document.querySelectorAll('.navigation__link');
    var navCheckbox = document.getElementById('navi-toggle');

    if (navCheckbox) {
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                navCheckbox.checked = false;
            });
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.desktop-nav');
        if (header) {
            if (window.scrollY > 50) {
                header.style.height = "6.5rem";
                header.style.backgroundColor = "rgba(16, 29, 44, 0.98)";
                header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
            } else {
                header.style.height = "8rem";
                header.style.backgroundColor = "rgba(16, 29, 44, 0.95)";
                header.style.boxShadow = "none";
            }
        }
    });
});
