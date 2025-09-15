const emailJsPublicKey = "VDZ4knzM1kH7He_Lo"; // Your EmailJS public key

// Simple inquiry form handler
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    // your actual EmailJS public key
    emailjs.init(emailJsPublicKey);

    // Get our form elements
    const inquiryForm = document.getElementById('inquiryForm');
    const successMessage = document.getElementById('successMessage');
    const sendButton = document.querySelector('.submit-btn');
    const buttonText = document.querySelector('.btn-text');
    const loadingSpinner = document.querySelector('.btn-loading');

    // What each field needs to be valid
    const fieldRequirements = {
        name: {
            isRequired: true,
            minimumLength: 2,
            allowedPattern: /^[a-zA-Z\s]+$/,
            errorMessage: 'Name must be at least 2 characters and contain only letters and spaces'
        },
        email: {
            isRequired: true,
            allowedPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: 'Please enter a valid email address'
        },
        subject: {
            isRequired: true,
            minimumLength: 3,
            errorMessage: 'Subject must be at least 3 characters long'
        },
        message: {
            isRequired: true,
            minimumLength: 10,
            errorMessage: 'Message must be at least 10 characters long'
        }
    };

    // Check if one field is filled out correctly
    function checkField(fieldName, userInput) {
        const requirements = fieldRequirements[fieldName];
        const errorDisplay = document.getElementById(fieldName + 'Error');
        const fieldContainer = errorDisplay.closest('.form-group');

        // Clear any old error messages
        errorDisplay.classList.remove('show');
        fieldContainer.classList.remove('error');

        // Check if required field is empty
        if (requirements.isRequired && (!userInput || userInput.trim() === '')) {
            displayError(fieldName, `${fieldName} is required`);
            return false;
        }

        // Check if text is long enough
        if (requirements.minimumLength && userInput.length < requirements.minimumLength) {
            displayError(fieldName, requirements.errorMessage);
            return false;
        }

        // Check if format is correct (like email)
        if (requirements.allowedPattern && !requirements.allowedPattern.test(userInput)) {
            displayError(fieldName, requirements.errorMessage);
            return false;
        }

        return true;
    }

    // Show error message to user
    function displayError(fieldName, message) {
        const errorDisplay = document.getElementById(fieldName + 'Error');
        const fieldContainer = errorDisplay.closest('.form-group');
        
        errorDisplay.textContent = message;
        errorDisplay.classList.add('show');
        fieldContainer.classList.add('error');
    }

    // Remove all error messages
    function clearAllErrors() {
        const allErrorMessages = document.querySelectorAll('.error-message');
        const allFieldContainers = document.querySelectorAll('.form-group');
        
        allErrorMessages.forEach(error => {
            error.classList.remove('show');
        });
        
        allFieldContainers.forEach(container => {
            container.classList.remove('error');
        });
    }

    // Check all form fields before submitting
    function validateForm() {
        clearAllErrors();
        let formIsValid = true;

        // Check each field one by one
        Object.keys(fieldRequirements).forEach(fieldName => {
            const inputField = document.getElementById(fieldName);
            const userInput = inputField.value.trim();
            
            if (!checkField(fieldName, userInput)) {
                formIsValid = false;
            }
        });

        return formIsValid;
    }

    // Show loading spinner while sending
    function showLoading() {
        sendButton.disabled = true;
        buttonText.style.display = 'none';
        loadingSpinner.style.display = 'inline';
    }

    // Hide loading spinner
    function hideLoading() {
        sendButton.disabled = false;
        buttonText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }

    // Show thank you message
    function showSuccess() {
        inquiryForm.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }

    // Handle when user clicks submit
    inquiryForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Make sure all fields are filled correctly
        if (!validateForm()) {
            return;
        }

        // Show loading spinner
        showLoading();

        try {
            // Get all the form data
            const formData = new FormData(inquiryForm);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            // Send emails using EmailJS
            const serviceId = 'service_251x2ma'; // Your EmailJS service ID
            
            // Template IDs for different emails
            const userConfirmationTemplate = 'template_znr8kor'; // Template for user confirmation
            const adminNotificationTemplate = 'template_cfg8uob'; // Template for admin notification

            // Send admin notification email
            await emailjs.send(serviceId, adminNotificationTemplate, {
                name: userData.name,
                email: userData.email,
                subject: userData.subject,
                message: userData.message,
            });

            // Send user confirmation email
            await emailjs.send(serviceId, userConfirmationTemplate, {
                name: userData.name,
                email: userData.email,
                subject: userData.subject,
                message: userData.message,
            });

            // Everything worked! Show thank you message
            showSuccess();

        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Stop showing loading spinner
            hideLoading();
            
            // Let user know something went wrong
            alert('Sorry, there was an error submitting your form. Please try again later.');
        }
    });

    // Check fields as user types or leaves them
    Object.keys(fieldRequirements).forEach(fieldName => {
        const inputField = document.getElementById(fieldName);
        
        // Check when user leaves the field
        inputField.addEventListener('blur', function() {
            checkField(fieldName, this.value.trim());
        });

        // Clear error when user starts typing
        inputField.addEventListener('input', function() {
            const errorDisplay = document.getElementById(fieldName + 'Error');
            const fieldContainer = errorDisplay.closest('.form-group');
            
            if (errorDisplay.classList.contains('show')) {
                errorDisplay.classList.remove('show');
                fieldContainer.classList.remove('error');
            }
        });
    });
});

/*
EMAIL SERVICE SETUP INSTRUCTIONS:

This application uses EmailJS (https://www.emailjs.com/) for email functionality.

SETUP STEPS:
1. Go to https://www.emailjs.com/ and sign up for a free account
2. Add an email service (Gmail, Outlook, etc.)
3. Create TWO email templates:

   TEMPLATE 1 - Admin Notification (template_cfg8uob):
   - To: Your email address ()
   - Subject: "New Inquiry: {{subject}}"
   - Content: "New inquiry from {{name}} ({{email}}): {{message}}"
   - Variables: {{name}}, {{email}}, {{subject}}, {{message}}

   TEMPLATE 2 - User Confirmation (template_znr8kor):
   - To: {{email}} (user's email address)
   - Subject: "Thank you for your inquiry"
   - Content: "Hi! Thank you for reaching out. We'll get back to you within 24 hours."
   - Variables: {{email}}

4. Update the credentials in this code:
   - serviceId: 'service_251x2ma'
   - publicKey: 'VDZ4knzM1kH7He_Lo'
   - Template IDs: 'template_znr8kor' and 'template_cfg8uob'

Both emails will be sent automatically when the form is submitted!
*/
