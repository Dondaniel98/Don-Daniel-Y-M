const API_BASE = '/api';

/* ---------- Visitor counter ---------- */
async function registerVisit() {
  const counterEl = document.getElementById('visitor-counter');
  try {
    const res = await fetch(`${API_BASE}/visitors/hit`, { method: 'POST' });
    if (!res.ok) throw new Error('Request failed');
    const data = await res.json();
    counterEl.textContent = `Ticket #${String(data.count).padStart(3, '0')} today`;
  } catch (err) {
    counterEl.textContent = 'Ticket #—— today';
    console.warn('Visitor counter unavailable:', err.message);
  }
}

/* ---------- Testimonials ---------- */
function starString(rating) {
  const r = Math.max(1, Math.min(5, Number(rating) || 5));
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderTestimonials(list) {
  const container = document.getElementById('testimonial-list');
  if (!list || list.length === 0) {
    container.innerHTML = '<p class="empty-state mono">No feedback yet — be the first to file one.</p>';
    return;
  }
  container.innerHTML = list.map(t => `
    <article class="testimonial-card">
      <div class="testimonial-stars">${starString(t.rating)}</div>
      <p class="testimonial-quote">${escapeHTML(t.message)}</p>
      <div class="testimonial-meta"><strong>${escapeHTML(t.name)}</strong>${t.role ? ' · ' + escapeHTML(t.role) : ''}</div>
    </article>
  `).join('');
}

async function loadTestimonials() {
  const container = document.getElementById('testimonial-list');
  try {
    const res = await fetch(`${API_BASE}/testimonials`);
    if (!res.ok) throw new Error('Request failed');
    const data = await res.json();
    renderTestimonials(data);
  } catch (err) {
    container.innerHTML = '<p class="empty-state mono">Feedback is temporarily unavailable.</p>';
    console.warn('Testimonials unavailable:', err.message);
  }
}

function setStatus(el, message, type) {
  el.textContent = message;
  el.classList.remove('success', 'error');
  if (type) el.classList.add(type);
}

function initTestimonialForm() {
  const form = document.getElementById('testimonial-form');
  const status = document.getElementById('testimonial-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const payload = {
      name: form.name.value.trim(),
      role: form.role.value.trim(),
      rating: Number(form.rating.value),
      message: form.message.value.trim(),
    };
    if (!payload.name || !payload.message) {
      setStatus(status, 'Please fill in your name and feedback.', 'error');
      return;
    }
    submitBtn.disabled = true;
    setStatus(status, 'Submitting…', '');
    try {
      const res = await fetch(`${API_BASE}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Submission failed');
      }
      setStatus(status, 'Thanks — your feedback was added.', 'success');
      form.reset();
      loadTestimonials();
    } catch (err) {
      setStatus(status, err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!payload.name || !payload.message) {
      setStatus(status, 'Please fill in your name and message.', 'error');
      return;
    }
    if (!emailPattern.test(payload.email)) {
      setStatus(status, 'Please enter a valid email address.', 'error');
      return;
    }
    submitBtn.disabled = true;
    setStatus(status, 'Sending…', '');
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Message failed to send');
      }
      setStatus(status, 'Message sent — I\'ll get back to you within 24 hours.', 'success');
      form.reset();
    } catch (err) {
      setStatus(status, err.message || 'Something went wrong. Please email me directly instead.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  registerVisit();
  loadTestimonials();
  initTestimonialForm();
  initContactForm();
});
