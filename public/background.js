(function () {
  'use strict';

  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: null, y: null, radius: 140 };
  var dpr = window.devicePixelRatio || 1;

  var ACCENT = '#6ee7b7';
  var ACCENT_2 = '#60a5fa';

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
    initParticles();
  }

  function initParticles() {
    particles = [];
    var area = window.innerWidth * window.innerHeight;
    var count = Math.min(Math.floor(area / 14000), 90);
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // mouse interaction: gentle attraction + repulsion zone
      if (mouse.x !== null) {
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          var force = (mouse.radius - dist) / mouse.radius;
          if (dist < 40) {
            // repel when very close
            p.vx -= (dx / dist) * force * 0.6;
            p.vy -= (dy / dist) * force * 0.6;
          } else {
            // attract
            p.vx += (dx / dist) * force * 0.15;
            p.vy += (dy / dist) * force * 0.15;
          }
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      // friction
      p.vx *= 0.985;
      p.vy *= 0.985;

      // boundary wrap
      if (p.x < -20) p.x = window.innerWidth + 20;
      if (p.x > window.innerWidth + 20) p.x = -20;
      if (p.y < -20) p.y = window.innerHeight + 20;
      if (p.y > window.innerHeight + 20) p.y = -20;

      // draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(110,231,183,0.55)';
      ctx.fill();
    }

    // draw connecting lines
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var p1 = particles[a];
        var p2 = particles[b];
        var ddx = p1.x - p2.x;
        var ddy = p1.y - p2.y;
        var d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < 120) {
          var alpha = (1 - d / 120) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(110,231,183,' + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // mouse line
      if (mouse.x !== null) {
        var mdx = p1.x - mouse.x;
        var mdy = p1.y - mouse.y;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < mouse.radius) {
          var mAlpha = (1 - md / mouse.radius) * 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(96,165,250,' + mAlpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', function () {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', resize);

  // touch support
  window.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', function () {
    mouse.x = null;
    mouse.y = null;
  });

  // reduce motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // static single frame only
    resize();
    draw = function () { ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); for (var i = 0; i < particles.length; i++) { var p = particles[i]; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(110,231,183,0.4)'; ctx.fill(); } };
    draw();
    return;
  }

  resize();
  draw();
})();
