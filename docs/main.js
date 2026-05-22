// MAIN JS FOR PERRY'S WEBSITE

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
  if (!input.checkValidity()) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    return false;
  } else {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    return true;
  }
}

function validatePhone(input) {
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
  if (!select.value) {
    select.classList.add('is-invalid');
    select.classList.remove('is-valid');
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
    
    // 1. Clear previous validation state before running checks
    clearValidation();
    
    // 2. Run all validation
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
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch('http://localhost:3000/contact', {
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
        alert(data.message || 'Something went wrong. Try again.');
      }
    } catch (err) {
      alert('Network error. Make sure the backend is running on port 3000.');
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
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