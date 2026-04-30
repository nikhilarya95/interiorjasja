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

// Browser-side process.env shim
window.process = window.process || { env: {} };

// EmailJS Accounts Array (Hardcoded)
let EMAILJS_ACCOUNTS = [
    {
        ServiceId: "service_6tabn39",
        TemplateId: "template_gou93cc",
        PublicKey: "_VT6HcM9qBz2hbhth"
    },
    {
        ServiceId: "service_1ppd7oq",
        TemplateId: "template_fr0liez",
        PublicKey: "dk5XclJhTzLCiSBEh"
    }
];

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
        console.log("Sending email...");

        // Capture body before resetting
        var emailBody = "Name : " + name + "<br>Email : " + email + "<br>Mobile : " + mobile + "<br>Intrested in : " + (intrest || "Not specified");
        var emailSubject = (intrest || "General") + " Enquire";

        // RESET IMMEDIATELY
        resetForm();

        // Check if primary config is loaded
        if (!EMAILJS_ACCOUNTS || EMAILJS_ACCOUNTS.length === 0 || !EMAILJS_ACCOUNTS[0].ServiceId) {
            showToast("EmailJS is not configured. Please add keys to the code.", "error");
            return;
        }

        // Immediate feedback
        showToast("Sending your inquiry... please wait.", "info");

        var templateParams = {
            name: name,
            email: email,
            mobile: mobile,
            service: intrest || "General Inquiry",
            title: emailSubject,
            message: emailBody
        };

        // EmailJS Send
        if (typeof emailjs !== 'undefined') {
            console.log("Attempting EmailJS send");

            function trySendEmail(accountIndex) {
                if (accountIndex >= EMAILJS_ACCOUNTS.length) {
                    showToast("EmailJS Error: All accounts exceeded limits or failed to send.", "error");
                    return;
                }

                let account = EMAILJS_ACCOUNTS[accountIndex];

                // Skip unconfigured fallback accounts
                if (!account.ServiceId) {
                    if (accountIndex > 0) {
                        showToast("EmailJS Error: Primary account limit exceeded and no secondary account configured.", "error");
                    } else {
                        showToast("EmailJS Error: Account not configured.", "error");
                    }
                    return;
                }

                console.log("Trying account " + (accountIndex + 1) + "...");
                // Pass public key directly to send() to avoid global state issues between accounts
                emailjs.send(account.ServiceId, account.TemplateId, templateParams, account.PublicKey)
                    .then(function (response) {
                        console.log('SUCCESS with account ' + (accountIndex + 1) + '!', response.status, response.text);
                        showToast("Success! Mail sent successfully. We will contact you soon.");
                        resetForm();
                    }, function (error) {
                        console.error('FAILED with account ' + (accountIndex + 1) + '...', error);

                        let errorText = (error.text || "").toLowerCase();
                        let errorMsg = (error.message || "").toLowerCase();

                        // Check if error is related to quota/limit
                        if (error.status === 429 || error.status === 400 || errorText.includes('quota') || errorText.includes('limit') || errorMsg.includes('quota')) {
                            console.log("Account " + (accountIndex + 1) + " limit exceeded. Switching to next account...");
                            trySendEmail(accountIndex + 1);
                        } else {
                            // Other errors (e.g., bad template params, network error)
                            showToast("EmailJS Error: " + (error.text || error.message || "Failed to send"), "error");
                        }
                    });
            }

            // Start with the first account
            trySendEmail(0);

        } else {
            console.error("EmailJS Library is NOT loaded.");
            showToast("Email service failed to load. Please check your connection.", "error");
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
