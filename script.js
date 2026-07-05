document.addEventListener('DOMContentLoaded', () => {
  // === 1. LOADING SCREEN ===
  const loader = document.getElementById('loading-screen');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 500); // Small delay for visual pleasure
    });
    // Fallback if window.load already fired or is slow
    setTimeout(() => {
      if (!loader.classList.contains('fade-out')) {
        loader.classList.add('fade-out');
      }
    }, 3000);
  }

  // === 2. DARK MODE THEME SYSTEM ===
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    // Check localStorage or default system scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      showToast(isDark ? '✔ Dark theme enabled' : '✔ Light theme enabled', 'success');
    });
  }

  // === 3. STICKY NAVBAR ===
  const header = document.querySelector('header');
  const scrollThreshold = 100;
  
  const handleStickyHeader = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  };
  
  if (header) {
    window.addEventListener('scroll', handleStickyHeader);
    handleStickyHeader(); // Call immediately on page load
  }

  // === 4. MOBILE NAVIGATION (HAMBURGER & SLIDE) ===
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const dropdowns = document.querySelectorAll('.dropdown');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });

    // Mobile dropdown toggle on click
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('.nav-link');
      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 992) {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('active');
          }
        });
      }
    });
  }

  // === 5. HERO SLIDER ===
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.slider-arrow-prev');
  const nextBtn = document.querySelector('.slider-arrow-next');
  const indicatorsContainer = document.querySelector('.slider-indicators');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 6000;

    // Create dot indicators
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetSlideTimer();
      });
      if (indicatorsContainer) indicatorsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    const updateSliderUI = () => {
      slides.forEach((slide, index) => {
        if (index === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      if (dots.length > 0) {
        dots.forEach((dot, index) => {
          if (index === currentSlide) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSliderUI();
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSliderUI();
    };

    const goToSlide = (index) => {
      currentSlide = index;
      updateSliderUI();
    };

    const startSlideTimer = () => {
      slideInterval = setInterval(nextSlide, intervalTime);
    };

    const resetSlideTimer = () => {
      clearInterval(slideInterval);
      startSlideTimer();
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlideTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlideTimer();
      });
    }

    startSlideTimer();
  }

  // === 6. EVENT COUNTDOWN TIMER ===
  const countdownTimer = document.getElementById('countdown-timer');
  if (countdownTimer) {
    // Set target date (e.g., 45 days from current execution time)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 25);
    targetDate.setHours(10, 0, 0, 0);

    const daysVal = document.getElementById('days');
    const hoursVal = document.getElementById('hours');
    const minutesVal = document.getElementById('minutes');
    const secondsVal = document.getElementById('seconds');

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        countdownTimer.innerHTML = '<h3>Event has Started!</h3>';
        clearInterval(timerInterval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysVal) daysVal.textContent = String(days).padStart(2, '0');
      if (hoursVal) hoursVal.textContent = String(hours).padStart(2, '0');
      if (minutesVal) minutesVal.textContent = String(minutes).padStart(2, '0');
      if (secondsVal) secondsVal.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
  }

  // === 7. STATISTICS COUNTER ===
  const statsSection = document.querySelector('.stats-section');
  const statsNumbers = document.querySelectorAll('.stats-number');

  if (statsNumbers.length > 0) {
    const runStatsCounter = () => {
      statsNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        const duration = 2000; // Animation duration in ms
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let current = 0;
        
        // Clear value just in case
        stat.textContent = '0';

        const timer = setInterval(() => {
          const increment = Math.ceil(target / 40); // Increment chunk size
          current += increment;
          if (current >= target) {
            stat.textContent = target + (stat.getAttribute('data-suffix') || '');
            clearInterval(timer);
          } else {
            stat.textContent = current + (stat.getAttribute('data-suffix') || '');
          }
        }, stepTime);
      });
    };

    // Intersection Observer to trigger counter when visible
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runStatsCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  // === 8. SCROLL ANIMATIONS (INTERSECTION OBSERVER) ===
  const animatableElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatableElements.length > 0) {
    const scrollAnimObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animatableElements.forEach(el => scrollAnimObserver.observe(el));
  }

  // === 9. TOAST NOTIFICATIONS SYSTEM ===
  const createToastContainer = () => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.classList.add('toast-container');
      document.body.appendChild(container);
    }
    return container;
  };

  window.showToast = (message, type = 'success') => {
    const container = createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';
    else if (type === 'info') iconClass = 'fa-info-circle';

    toast.innerHTML = `
      <span class="toast-icon"><i class="fas ${iconClass}"></i></span>
      <span class="toast-message">${message}</span>
      <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      dismissToast(toast);
    });

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      dismissToast(toast);
    }, 4000);
  };

  const dismissToast = (toast) => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  };

  // Attach dynamic toasts to brochure download buttons
  const downloadBrochureBtns = document.querySelectorAll('.btn-download-brochure');
  downloadBrochureBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('✔ Brochure Download Started', 'success');
    });
  });

  // === 10. BACK TO TOP BUTTON ===
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === 11. FAQ ACCORDION ===
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      
      // Close other open accordion items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-body').style.maxHeight = null;
        }
      });

      // Toggle current
      item.classList.toggle('active');
      if (item.classList.contains('active')) {
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        body.style.maxHeight = null;
      }
    });
  });

  // === 12. TABBED OVERVIEW (COURSES LEVEL CONTROLLER) ===
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabButtons.length > 0 && tabPanels.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  // === 13. GALLERY FILTER & LIGHTBOX PREVIEW ===
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');

  if (galleryItems.length > 0) {
    // Filters Logic
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterVal = btn.getAttribute('data-filter');

        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        galleryItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (filterVal === 'all' || itemCat === filterVal) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    // Lightbox Logic
    if (lightbox) {
      const lightboxImg = lightbox.querySelector('.lightbox-img');
      const lightboxCaption = lightbox.querySelector('.lightbox-caption');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      const nextBtn = lightbox.querySelector('.lightbox-next');
      
      let visibleItems = [];
      let currentIndex = 0;

      const updateVisibleItems = () => {
        visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
      };

      const openLightbox = (index) => {
        updateVisibleItems();
        currentIndex = index;
        const item = visibleItems[currentIndex];
        if (item) {
          const img = item.querySelector('img');
          const title = item.querySelector('h4').textContent;
          
          lightboxImg.src = img.src;
          lightboxCaption.textContent = title;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden'; // Lock scrolling
        }
      };

      const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
      };

      const showNextImage = () => {
        if (visibleItems.length <= 1) return;
        currentIndex = (currentIndex + 1) % visibleItems.length;
        openLightbox(currentIndex);
      };

      const showPrevImage = () => {
        if (visibleItems.length <= 1) return;
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox(currentIndex);
      };

      galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
          updateVisibleItems();
          const itemIndex = visibleItems.indexOf(item);
          openLightbox(itemIndex !== -1 ? itemIndex : 0);
        });
      });

      if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
      if (nextBtn) nextBtn.addEventListener('click', showNextImage);
      if (prevBtn) prevBtn.addEventListener('click', showPrevImage);

      // Close lightbox on click outside the image
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
          closeLightbox();
        }
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
      });
    }
  }

  // === 14. FACULTY / COURSE SEARCH & FILTER DIRECTORY ===
  const facultySearchInput = document.getElementById('faculty-search');
  const deptFilterSelect = document.getElementById('dept-filter');
  const facultyCards = document.querySelectorAll('.faculty-card');

  const filterFaculty = () => {
    if (!facultySearchInput && !deptFilterSelect) return;
    const query = facultySearchInput ? facultySearchInput.value.toLowerCase().trim() : '';
    const dept = deptFilterSelect ? deptFilterSelect.value : 'all';

    facultyCards.forEach(card => {
      const name = card.querySelector('.card-title').textContent.toLowerCase();
      const cardDept = card.getAttribute('data-dept');
      
      const matchesSearch = name.includes(query);
      const matchesDept = (dept === 'all' || cardDept === dept);

      if (matchesSearch && matchesDept) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (facultySearchInput) facultySearchInput.addEventListener('input', filterFaculty);
  if (deptFilterSelect) deptFilterSelect.addEventListener('change', filterFaculty);

  // Courses Search filter
  const courseSearchInput = document.getElementById('course-search');
  const courseCards = document.querySelectorAll('.course-card');

  if (courseSearchInput) {
    courseSearchInput.addEventListener('input', () => {
      const query = courseSearchInput.value.toLowerCase().trim();
      courseCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const overview = card.querySelector('.card-desc').textContent.toLowerCase();
        if (title.includes(query) || overview.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // === 15. LOCAL STORAGE: PREFER CONTACT FORM & LAST VIEWED DEPT ===
  // Contact Form Draft Save/Restore
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const fields = ['name', 'email', 'phone', 'subject', 'message'];
    
    // Restore Draft
    fields.forEach(field => {
      const el = document.getElementById(field);
      if (el) {
        const savedVal = localStorage.getItem(`draft_${field}`);
        if (savedVal) el.value = savedVal;

        // Auto Save Draft on input
        el.addEventListener('input', () => {
          localStorage.setItem(`draft_${field}`, el.value);
        });
      }
    });

    // Handle Form Submit and Validation
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      fields.forEach(field => {
        const el = document.getElementById(field);
        const errorContainer = el.parentElement;
        
        if (el && el.hasAttribute('required') && !el.value.trim()) {
          errorContainer.classList.add('has-error');
          isValid = false;
        } else {
          errorContainer.classList.remove('has-error');
        }

        // Specific field validation (e.g. email)
        if (field === 'email' && el && el.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(el.value.trim())) {
            errorContainer.classList.add('has-error');
            isValid = false;
          }
        }
      });

      if (isValid) {
        showToast('✔ Thank You for Contacting Us. Form Submitted!', 'success');
        // Clear drafts
        fields.forEach(field => {
          const el = document.getElementById(field);
          if (el) el.value = '';
          localStorage.removeItem(`draft_${field}`);
        });
      } else {
        showToast('✖ Please fix the highlighted fields before submitting.', 'error');
      }
    });
  }

  // Admission Form validation and toast
  const admissionForm = document.getElementById('admission-form');
  if (admissionForm) {
    // Restore drafts
    const fields = ['adm-name', 'adm-email', 'adm-phone', 'adm-course', 'adm-gender', 'adm-state'];
    
    fields.forEach(field => {
      const el = document.getElementById(field);
      if (el) {
        const savedVal = localStorage.getItem(`draft_${field}`);
        if (savedVal) el.value = savedVal;

        el.addEventListener('input', () => {
          localStorage.setItem(`draft_${field}`, el.value);
        });
      }
    });

    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      fields.forEach(field => {
        const el = document.getElementById(field);
        const errorContainer = el.parentElement;

        if (el && el.hasAttribute('required') && !el.value.trim()) {
          errorContainer.classList.add('has-error');
          isValid = false;
        } else {
          errorContainer.classList.remove('has-error');
        }

        // Email validation
        if (field === 'adm-email' && el && el.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(el.value.trim())) {
            errorContainer.classList.add('has-error');
            isValid = false;
          }
        }

        // Phone validation
        if (field === 'adm-phone' && el && el.value.trim()) {
          const phoneRegex = /^[0-9]{10}$/;
          if (!phoneRegex.test(el.value.replace(/[^0-9]/g, ''))) {
            errorContainer.classList.add('has-error');
            isValid = false;
          }
        }
      });

      if (isValid) {
        showToast('✔ Admission Form Submitted Successfully!', 'success');
        fields.forEach(field => {
          const el = document.getElementById(field);
          if (el) el.value = '';
          localStorage.removeItem(`draft_${field}`);
        });
      } else {
        showToast('✖ Please correct the inputs in the form.', 'error');
      }
    });
  }

  // Last Viewed Department Listener
  const deptLearnMoreBtns = document.querySelectorAll('.btn-learn-dept');
  deptLearnMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const deptName = btn.getAttribute('data-dept-name');
      if (deptName) {
        localStorage.setItem('last_viewed_dept', deptName);
        showToast(`✔ Viewing details for ${deptName}`, 'info');
      }
    });
  });

  // Display Last Viewed Department if on index page or departments page
  const lastDeptBanner = document.getElementById('last-viewed-dept-banner');
  if (lastDeptBanner) {
    const lastDept = localStorage.getItem('last_viewed_dept');
    if (lastDept) {
      lastDeptBanner.querySelector('.dept-name').textContent = lastDept;
      lastDeptBanner.style.display = 'block';
    }
  }
});
