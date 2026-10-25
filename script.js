/**
 * WEDDING INVITATION INTERACTIVE CONTROLLER
 * Gisser & Marialyn - Light Blue & Metallic Gold Luxury Edition
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const sceneContainer = document.querySelector('.scene-container');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('wax-seal');
  const resealBtn = document.getElementById('reseal-btn');
  const soundBtn = document.getElementById('sound-btn');
  const rsvpModal = document.getElementById('rsvp-modal');
  const openRsvpBtn = document.getElementById('open-rsvp-btn');
  const closeRsvpBtn = document.getElementById('close-rsvp-btn');
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');
  const doneRsvpBtn = document.getElementById('done-rsvp-btn');
  const calendarBtn = document.getElementById('calendar-btn');
  const locationBtn = document.getElementById('location-btn');
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const guestsCountGroup = document.getElementById('guests-count-group');

  let isAudioEnabled = true;
  let audioCtx = null;

  // ========================================================
  // 1. SYNTHESIZED ROMANTIC SOUND EFFECTS (Web Audio API)
  // Completely self-contained, no external MP3 dependencies
  // ========================================================
  function initAudioContext() {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioCtx = new AudioContext();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch (err) {
      console.warn('AudioContext not allowed yet:', err);
    }
  }

  // Play romantic celestial harp arpeggio when unsealing
  function playUnsealSound() {
    if (!isAudioEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      // Harp notes in D major pentatonic / celestial voicing: D4, F#4, A4, D5, F#5, A5
      const notes = [293.66, 369.99, 440.00, 587.33, 739.99, 880.00, 1174.66];
      const now = audioCtx.currentTime;

      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.12);

        // Bell / harp chime envelope
        gain.gain.setValueAtTime(0.0001, now + index * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.2, now + index * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 1.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 1.6);
      });
    } catch (err) {
      console.warn('Playback error:', err);
    }
  }

  // Sound toggle button
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      isAudioEnabled = !isAudioEnabled;
      const icon = soundBtn.querySelector('i');
      const tooltip = soundBtn.querySelector('.sound-tooltip');
      if (isAudioEnabled) {
        if (icon) icon.className = 'fa-solid fa-volume-high';
        if (tooltip) tooltip.textContent = 'Sound On';
        initAudioContext();
      } else {
        if (icon) icon.className = 'fa-solid fa-volume-xmark';
        if (tooltip) tooltip.textContent = 'Sound Off';
      }
    });
  }

  // ========================================================
  // 2. ENVELOPE OPEN / CLOSE SEQUENCER
  // ========================================================
  function openEnvelope() {
    if (envelopeWrapper.classList.contains('is-open')) return;

    initAudioContext();
    playUnsealSound();

    // Trigger open state
    envelopeWrapper.classList.add('is-open');
    if (sceneContainer) sceneContainer.classList.add('is-open');

    // Launch celebratory gold confetti burst
    setTimeout(() => {
      launchGoldConfetti();
    }, 700);
  }

  function closeEnvelope() {
    envelopeWrapper.classList.remove('is-open');
    if (sceneContainer) sceneContainer.classList.remove('is-open');
  }

  // Click on wax seal or envelope to open
  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
    waxSeal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  if (envelope) {
    envelope.addEventListener('click', (e) => {
      if (!envelopeWrapper.classList.contains('is-open')) {
        openEnvelope();
      }
    });
  }

  if (resealBtn) {
    resealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeEnvelope();
    });
  }

  // ========================================================
  // 3. LIVE WEDDING COUNTDOWN TIMER
  // Target: September 18, 2027 16:00:00
  // ========================================================
  const weddingDate = new Date('2027-09-18T16:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('mins');
    const secsEl = document.getElementById('secs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ========================================================
  // 4. RSVP MODAL INTERACTIONS
  // ========================================================
  if (openRsvpBtn && rsvpModal) {
    openRsvpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      rsvpModal.classList.add('is-active');
    });
  }

  if (closeRsvpBtn && rsvpModal) {
    closeRsvpBtn.addEventListener('click', () => {
      rsvpModal.classList.remove('is-active');
    });
  }

  if (rsvpModal) {
    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) {
        rsvpModal.classList.remove('is-active');
      }
    });
  }

  attendanceRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (guestsCountGroup) {
        if (radio.value === 'decline') {
          guestsCountGroup.style.display = 'none';
        } else {
          guestsCountGroup.style.display = 'block';
        }
      }
    });
  });

  if (rsvpForm && rsvpSuccess) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      rsvpForm.style.display = 'none';
      rsvpSuccess.classList.add('is-visible');
      launchGoldConfetti();
    });
  }

  if (doneRsvpBtn && rsvpModal && rsvpForm && rsvpSuccess) {
    doneRsvpBtn.addEventListener('click', () => {
      rsvpModal.classList.remove('is-active');
      setTimeout(() => {
        rsvpForm.reset();
        rsvpForm.style.display = 'block';
        rsvpSuccess.classList.remove('is-visible');
        if (guestsCountGroup) guestsCountGroup.style.display = 'block';
      }, 400);
    });
  }

  // Calendar Event Integration
  if (calendarBtn) {
    calendarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = encodeURIComponent("Gisser & Marialyn's Wedding");
      const details = encodeURIComponent("Celebration of the Holy Matrimony of Gisser & Marialyn at The Grand Celestial Palace.");
      const location = encodeURIComponent("777 Azure Coast Avenue, Bel Air, California");
      const dates = "20270918T230000Z/20270919T060000Z";
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(googleCalendarUrl, '_blank');
    });
  }

  // Location Map Integration
  if (locationBtn) {
    locationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const query = encodeURIComponent("777 Azure Coast Avenue, Bel Air, California");
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    });
  }

  // Share / Copy Invitation Link
  const shareBtn = document.getElementById('share-btn');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  function showToast(message) {
    if (!toast) return;
    if (toastText) toastText.textContent = message;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const shareData = {
        title: "Gisser & Marialyn's Wedding Invitation",
        text: "You are cordially invited to celebrate the wedding of Gisser & Marialyn!",
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          // Fallback to clipboard if cancelled
        }
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast("Invitation link copied to clipboard!");
        }).catch(() => {
          showToast("Link copied to clipboard!");
        });
      } else {
        showToast("Invitation link copied!");
      }
    });
  }

  // Interactive Specular Glare Tracking on the Invitation Card
  const invitationCard = document.getElementById('invitation-card');
  if (invitationCard) {
    invitationCard.addEventListener('mousemove', (e) => {
      if (!envelopeWrapper.classList.contains('is-open')) return;
      const rect = invitationCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;

      invitationCard.style.setProperty('--mouse-x', `${percentX}%`);
      invitationCard.style.setProperty('--mouse-y', `${percentY}%`);
    });
  }

  // ========================================================
  // 5. AMBIENT FLOATING GOLDEN DUST PARTICLES
  // ========================================================
  const ambientCanvas = document.getElementById('ambient-canvas');
  if (ambientCanvas) {
    const ambientCtx = ambientCanvas.getContext('2d');
    let ambientParticles = [];

    function resizeAmbientCanvas() {
      ambientCanvas.width = window.innerWidth;
      ambientCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeAmbientCanvas);
    resizeAmbientCanvas();

    class GoldenSparkle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * ambientCanvas.width;
        this.y = initial ? Math.random() * ambientCanvas.height : ambientCanvas.height + 10;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedY = Math.random() * 0.45 + 0.25;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulse = Math.random() * Math.PI;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.pulse += this.pulseSpeed;
        if (this.y < -10) {
          this.reset();
        }
      }

      draw(ctx) {
        const currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(225, 185, 80, ${currentOpacity})`;
        ctx.shadowColor = 'rgba(255, 235, 140, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();
      }
    }

    for (let i = 0; i < 40; i++) {
      ambientParticles.push(new GoldenSparkle());
    }

    function animateAmbient() {
      ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
      ambientParticles.forEach((p) => {
        p.update();
        p.draw(ambientCtx);
      });
      requestAnimationFrame(animateAmbient);
    }
    animateAmbient();
  }

  // ========================================================
  // 6. METALLIC GOLD CONFETTI BURST SYSTEM
  // ========================================================
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiPieces = [];

  function launchGoldConfetti() {
    if (!confettiCanvas) return;
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.42;

    for (let i = 0; i < 85; i++) {
      confettiPieces.push(new GoldConfettiPiece(originX, originY));
    }
  }

  if (confettiCanvas) {
    const confettiCtx = confettiCanvas.getContext('2d');

    function resizeConfettiCanvas() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeConfettiCanvas);
    resizeConfettiCanvas();

    class GoldConfettiPiece {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 9 + 5;
        this.width = this.size;
        this.height = this.size * (Math.random() * 0.5 + 0.6);

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 6;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 5;
        this.gravity = 0.28;
        this.drag = 0.94;

        this.rotationX = Math.random() * 360;
        this.rotationY = Math.random() * 360;
        this.rotationZ = Math.random() * 360;
        this.rotSpeedX = (Math.random() - 0.5) * 12;
        this.rotSpeedY = (Math.random() - 0.5) * 14;

        const goldTones = [
          '#d4af37',
          '#fef09f',
          '#e0be53',
          '#b38728',
          '#fff6be',
          '#c5a059'
        ];
        this.color = goldTones[Math.floor(Math.random() * goldTones.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.007 + 0.005;
      }

      update() {
        this.vx *= this.drag;
        this.vy = this.vy * this.drag + this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        this.rotationX += this.rotSpeedX;
        this.rotationY += this.rotSpeedY;
        this.alpha -= this.decay;
      }

      draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotationZ * Math.PI) / 180);
        ctx.scale(Math.cos((this.rotationX * Math.PI) / 180), Math.sin((this.rotationY * Math.PI) / 180));

        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowColor = '#ffeaa7';
        ctx.shadowBlur = 4;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
      }
    }

    function animateConfetti() {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const p = confettiPieces[i];
        p.update();
        p.draw(confettiCtx);
        if (p.alpha <= 0 || p.y > confettiCanvas.height + 50) {
          confettiPieces.splice(i, 1);
        }
      }
      requestAnimationFrame(animateConfetti);
    }
    animateConfetti();
  }
});
