(function () {
  'use strict';

  // ==================== Mobile Nav ====================
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  function openNav() {
    if (!toggle || !links) return;
    toggle.setAttribute('aria-expanded', 'true');
    links.classList.add('is-open');
  }

  function closeNav() {
    if (!toggle || !links) return;
    toggle.setAttribute('aria-expanded', 'false');
    links.classList.remove('is-open');
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('#nav-links a').forEach(function (anchor) {
    anchor.addEventListener('click', function () {
      if (links && links.classList.contains('is-open')) {
        closeNav();
      }
    });
  });

  // ==================== Smooth Scroll ====================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target;
      try {
        target = document.querySelector(id);
      } catch (err) {
        return;
      }
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==================== Header Scroll Effect ====================
  var header = document.getElementById('site-header');

  function onScroll() {
    if (!header) return;
    var scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    updateActiveLink(scrollY);
  }

  // ==================== Active Nav Link ====================
  var sections = document.querySelectorAll('.section, .hero');
  var navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  // Cache section positions
  var sectionPositions = [];

  function cacheSectionPositions() {
    sectionPositions = [];
    sections.forEach(function (section) {
      var id = section.getAttribute('id');
      if (!id) return;
      sectionPositions.push({
        id: id,
        top: section.offsetTop,
        height: section.offsetHeight
      });
    });
  }

  function updateActiveLink(scrollY) {
    var scrollPos = (scrollY || window.scrollY || window.pageYOffset) + 200;

    for (var i = 0; i < sectionPositions.length; i++) {
      var s = sectionPositions[i];
      if (scrollPos >= s.top && scrollPos < s.top + s.height) {
        navAnchors.forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + s.id) {
            a.classList.add('active');
          }
        });
        break;
      }
    }
  }

  // Cache on load and resize
  cacheSectionPositions();
  window.addEventListener('resize', cacheSectionPositions);
  window.addEventListener('scroll', onScroll, { passive: true });

  // ==================== Scroll Animations ====================
  var animElements = document.querySelectorAll('.anim-fade-up');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ==================== Contact Form ====================
  var form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameField = form.querySelector('#name');
      var emailField = form.querySelector('#email');
      var subjectField = form.querySelector('#subject');
      var messageField = form.querySelector('#message');

      var name = nameField ? nameField.value.trim() : '';
      var email = emailField ? emailField.value.trim() : '';
      var subject = subjectField ? subjectField.value.trim() : 'General Enquiry';
      var message = messageField ? messageField.value.trim() : '';

      // Validate
      var valid = true;
      [nameField, emailField, messageField].forEach(function (field) {
        if (field && !field.value.trim()) {
          field.style.borderColor = '#ef4444';
          valid = false;
        } else if (field) {
          field.style.borderColor = '';
        }
      });

      if (emailField && email && email.indexOf('@') === -1) {
        emailField.style.borderColor = '#ef4444';
        valid = false;
      }

      if (!valid) return;

      var mailtoSubject = encodeURIComponent(subject + ' - ' + name);
      var mailtoBody = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Subject: ' + subject + '\n\n' +
        message
      );

      window.location.href = 'mailto:northernedgesoftware@outlook.com?subject=' + mailtoSubject + '&body=' + mailtoBody;
    });

    // Clear error styling on input
    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

})();
