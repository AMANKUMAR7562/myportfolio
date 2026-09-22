/**
 * AMAN KUMAR PORTFOLIO — INTERACTIVE CONTACT & INQUIRY ENGINE
 * Coding Language: Modern JavaScript (ES6+)
 */

(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('contactSubmitBtn');
  const statusMsg = document.getElementById('contactStatusMsg');
  const toastEl = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  function showToast(message) {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = message;
    toastEl.classList.add('on');
    setTimeout(() => toastEl.classList.remove('on'), 3500);
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const service = form.querySelector('[name="service"]')?.value;
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !email || !message) {
      if (statusMsg) {
        statusMsg.textContent = 'Please fill in all required fields.';
        statusMsg.className = 'form-status error';
      }
      return;
    }

    // Set loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Transmitting to Aman...</span>';
    }

    const payload = {
      name,
      email,
      service: service || 'General Inquiry',
      message,
      _subject: `✦ Portfolio Lead: ${service || 'General'} from ${name}`,
      _replyto: email,
      _template: 'table',
      _captcha: 'false',
      timestamp: new Date().toISOString()
    };

    let emailDelivered = false;
    let localSaved = false;

    // 1. Dispatch email delivery directly to akpadkill@gmail.com
    try {
      const emailResp = await fetch('https://formsubmit.co/ajax/akpadkill@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (emailResp.ok) {
        emailDelivered = true;
      }
    } catch (eErr) {
      console.warn('FormSubmit external dispatch note:', eErr);
    }

    // 2. Concurrently save to local database if Node backend is running
    try {
      const localResp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, service, message, timestamp: payload.timestamp })
      });
      if (localResp.ok) {
        localSaved = true;
      }
    } catch (lErr) {
      console.warn('Local storage endpoint unavailable (running statically):', lErr);
    }

    // Determine status feedback
    if (emailDelivered || localSaved) {
      if (statusMsg) {
        statusMsg.textContent = 'Enquiry transmitted! An alert has been forwarded to akpadkill@gmail.com. Aman will respond within 24 hours.';
        statusMsg.className = 'form-status success';
      }
      form.reset();
      showToast('✦ ENQUIRY DELIVERED TO AMAN KUMAR');
    } else {
      // Offline fallback
      if (statusMsg) {
        statusMsg.textContent = 'Network restricted. You can email directly to akpadkill@gmail.com';
        statusMsg.className = 'form-status error';
      }
      showToast('✦ DIRECT EMAIL: akpadkill@gmail.com');
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Send Message</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>';
    }
  });
})();
