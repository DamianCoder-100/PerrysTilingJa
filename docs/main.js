// MAIN JS FOR PERRY'S WEBSITE CONTACT FORM & INTERFACE

const logo = document.querySelector('.logo-image');

// ===== LOGO SHRINK ON SCROLL =====
if (logo) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      logo.classList.add('shrink');
    } else {
      logo.classList.remove('shrink');
    }
  });
}

// ===== DYNAMIC API ENDPOINT =====
const API_URL = 
  window.location.hostname === "localhost" || 
  window.location.hostname === "127.0.0.1" || 
  window.location.hostname.startsWith("192.168.")
    ? "http://127.0.0.1:3000" // 👈 Changed from localhost to 127.0.0.1
    : "https://your-backend-domain.com";

// ===== ELEMENTS =====
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const service = document.getElementById('service');
const message = document.getElementById('message');

const popup = document.getElementById('successPopup');
const closeBtn = document.getElementById('closePopup');

// ===== LIGHTBOX =====
function openLightbox(img) {
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  if (lightboxImage && lightboxTitle) {
    lightboxImage.src = img.src;
    const title = img.getAttribute("data-title");
    lightboxTitle.textContent = title;
  }
}

// ===== VALIDATE FUNCTIONS =====
function validate(input) {
  if (!input || !input.checkValidity()) {
    if (input) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
    return false;
  } else {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    return true;
  }
}

function validatePhone(input) {
  if (!input) return false;
  const phonePattern = /^[0-9+\s()-]{7,15}$/;
  if (!phonePattern.test(input.value.trim())) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    return false;
  } else {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    return true;
  }
}

function validateSelect(select) {
  if (!select || !select.value) {
    if (select) {
      select.classList.add('is-invalid');
      select.classList.remove('is-valid');
    }
    return false;
  } else {
    select.classList.remove('is-invalid');
    select.classList.add('is-valid');
    return true;
  }
}

// ===== LIVE VALIDATION =====
if (nameInput && email && message && phone && service) {
  [nameInput, email, message].forEach(input => {
    input.addEventListener('input', () => validate(input));
  });

  phone.addEventListener('input', () => validatePhone(phone));
  service.addEventListener('change', () => validateSelect(service));
}

// ===== FORM SUBMIT =====
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    clearValidation();
    
    // Validate all fields
    const isNameValid = validate(nameInput);
    const isEmailValid = validate(email);
    const isPhoneValid = validatePhone(phone);
    const isServiceValid = validateSelect(service);
    const isMessageValid = validate(message);
    
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isServiceValid || !isMessageValid) {
      form.classList.add('was-validated');
      return;
    }

    const formData = Object.fromEntries(new FormData(form));
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showPopup();
        form.reset();
        clearValidation();
      } else {
        // Handle express-validator server array formatting cleanly 
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err => err.msg).join('\n');
          alert(`Validation Error:\n${errorMessages}`);
        } else {
          alert(data.message || 'Something went wrong. Try again.');
        }
      }
    } catch (err) {
      alert('Network error. Please try again.');
      console.error(err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    }
  });
}

// ===== CLEANUP =====
function clearValidation() {
  document.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
    el.classList.remove('is-invalid', 'is-valid');
  });
  if (form) form.classList.remove('was-validated');
}

// ===== POPUP CONTROLS =====
function showPopup() {
  if (popup) {
    popup.classList.remove('hidden');
    if (closeBtn) closeBtn.focus();
  }
}

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    if (popup) popup.classList.add('hidden');
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && popup && !popup.classList.contains('hidden')) {
    popup.classList.add('hidden');
  }
});