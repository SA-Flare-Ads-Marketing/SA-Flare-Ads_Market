// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceID: "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
  templateID: "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
  publicKey: "YOUR_PUBLIC_KEY", // Replace with your EmailJS public key
}

// Declare emailjs variable
let emailjs

// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  // Initialize EmailJS
  if (typeof window.emailjs !== "undefined") {
    emailjs = window.emailjs
    emailjs.init(EMAILJS_CONFIG.publicKey)
  }

  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      toggleMobileMenu()
    })

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((n) =>
      n.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      }),
    )
  }

  // Order Form Handling with EmailJS
  const orderForm = document.getElementById("orderForm")
  if (orderForm) {
    orderForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      if (!validateForm("orderForm")) return

      const submitBtn = e.target.querySelector('button[type="submit"]')
      setLoadingState(submitBtn, true)

      try {
        // Get form data
        const formData = new FormData(orderForm)
        const orderData = {}

        // Convert FormData to object
        for (const [key, value] of formData.entries()) {
          if (orderData[key]) {
            if (Array.isArray(orderData[key])) {
              orderData[key].push(value)
            } else {
              orderData[key] = [orderData[key], value]
            }
          } else {
            orderData[key] = value
          }
        }

        // Handle platforms checkboxes separately
        const platforms = []
        document.querySelectorAll('input[name="platforms"]:checked').forEach((checkbox) => {
          platforms.push(checkbox.value)
        })
        orderData.platforms = platforms.join(", ") || "Not specified"

        // Send email via EmailJS
        await sendOrderEmailJS(orderData)

        showNotification("🎉 Order submitted successfully! We will contact you within 10 minutes.", "success")
        orderForm.reset()
      } catch (error) {
        console.error("Error sending order:", error)
        showNotification("❌ Failed to send order. Please try again or contact us directly.", "error")
      } finally {
        setLoadingState(submitBtn, false)
      }
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Initialize scroll animations
  initScrollAnimations()

  // Initialize lazy loading for images
  initLazyLoading()

  // Initialize particle effects
  initParticleEffects()

  // Ensure navigation links work properly
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      // Remove active class from all links
      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))
      // Add active class to clicked link
      this.classList.add("active")

      // Close mobile menu if open
      const hamburger = document.querySelector(".hamburger")
      const navMenu = document.querySelector(".nav-menu")
      if (hamburger && navMenu && navMenu.classList.contains("active")) {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      }
    })
  })

  // Fix social media links
  document.querySelectorAll(".social-icons a, .social-links a").forEach((link) => {
    link.addEventListener("click", function (e) {
      // Ensure the link opens in a new tab
      if (!this.target) {
        this.target = "_blank"
        this.rel = "noopener"
      }
    })
  })
})

// Send order email via EmailJS
async function sendOrderEmailJS(orderData) {
  const templateParams = {
    to_email: "saflareadsmarketing138@gmail.com", // Updated email
    from_name: orderData.clientName,
    from_email: orderData.email,
    phone: orderData.phone,
    business_name: orderData.businessName,
    service_type: orderData.serviceType,
    ad_count: orderData.adCount || "Not specified",
    platforms: orderData.platforms,
    budget: orderData.budget || "Not specified",
    rush_order: orderData.rushOrder ? "Yes (+20% fee)" : "No",
    payment_method: orderData.paymentMethod,
    terms_accepted: orderData.terms ? "Yes" : "No",
    project_details: orderData.projectDetails,
    subject: `🚀 New Order from ${orderData.clientName} - SA Flare`,
    message: `
New Order Details:

Client Information:
- Name: ${orderData.clientName}
- Email: ${orderData.email}
- Phone: ${orderData.phone}
- Business: ${orderData.businessName}

Service Details:
- Service Type: ${orderData.serviceType}
- Number of Ads: ${orderData.adCount || "Not specified"}
- Target Platforms: ${orderData.platforms}
- Budget Range: ${orderData.budget || "Not specified"}
- Rush Order: ${orderData.rushOrder ? "Yes (+20% fee)" : "No"}

Payment Information:
- Preferred Method: ${orderData.paymentMethod}
- Terms Accepted: ${orderData.terms ? "Yes" : "No"}

Project Details:
${orderData.projectDetails}

---
This order was submitted through SA Flare website.
Please respond within 10 minutes for WhatsApp orders.
    `,
  }

  if (typeof emailjs !== "undefined") {
    return await emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
  } else {
    // Fallback to mailto
    const mailtoLink = `mailto:saflareadsmarketing138@gmail.com?subject=${encodeURIComponent(templateParams.subject)}&body=${encodeURIComponent(templateParams.message)}`
    window.open(mailtoLink, "_blank")
    return Promise.resolve()
  }
}

// Enhanced notification system with neon styling
function showNotification(message, type = "info") {
  // Remove existing notifications
  document.querySelectorAll(".notification").forEach((n) => n.remove())

  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`

  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    info: "info-circle",
    warning: "exclamation-triangle",
  }

  const colors = {
    success: "linear-gradient(135deg, #2B86C5 0%, #784BA0 100%)",
    error: "linear-gradient(135deg, #FF3CAC 0%, #784BA0 100%)",
    info: "linear-gradient(135deg, #784BA0 0%, #2B86C5 100%)",
    warning: "linear-gradient(135deg, #FF3CAC 0%, #2B86C5 100%)",
  }

  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${icons[type]}"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `

  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(255, 60, 172, 0.4);
    z-index: 10000;
    max-width: 400px;
    animation: slideInBounce 0.5s ease-out;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `

  // Add enhanced animation keyframes
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style")
    style.id = "notification-styles"
    style.textContent = `
      @keyframes slideInBounce {
        0% { 
          transform: translateX(100%) scale(0.8); 
          opacity: 0; 
        }
        60% { 
          transform: translateX(-10px) scale(1.05); 
          opacity: 1; 
        }
        100% { 
          transform: translateX(0) scale(1); 
          opacity: 1; 
        }
      }
      .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.3s;
      }
      .notification-close:hover {
        opacity: 1;
        transform: scale(1.1);
      }
    `
    document.head.appendChild(style)
  }

  document.body.appendChild(notification)

  // Close button functionality
  notification.querySelector(".notification-close").addEventListener("click", () => {
    notification.style.animation = "slideOut 0.3s ease-in forwards"
    setTimeout(() => notification.remove(), 300)
  })

  // Auto remove after 6 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease-in forwards"
      setTimeout(() => notification.remove(), 300)
    }
  }, 6000)
}

// Enhanced scroll animations with neon effects
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for multiple elements
        setTimeout(() => {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0) scale(1)"

          // Add different animation classes based on element type
          if (entry.target.classList.contains("service-card")) {
            entry.target.classList.add("animate-bounce-in")
          } else if (entry.target.classList.contains("team-member")) {
            entry.target.classList.add("animate-slide-in-left")
          } else if (entry.target.classList.contains("testimonial-card")) {
            entry.target.classList.add("animate-slide-in-right")
          } else {
            entry.target.classList.add("animate-fade-in-up")
          }
        }, index * 100) // Staggered animation
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document
    .querySelectorAll(
      ".service-card, .testimonial-card, .team-member, .feature, .stat, .contact-item, .payment-card, .benefit",
    )
    .forEach((el, index) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(50px) scale(0.9)"
      el.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      el.style.transitionDelay = `${index * 0.1}s`
      observer.observe(el)
    })
}

// Enhanced mobile menu functionality with neon effects
function toggleMobileMenu() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")

    // Enhanced hamburger animation with neon colors
    const spans = hamburger.querySelectorAll("span")
    if (hamburger.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
      spans[0].style.background = "linear-gradient(45deg, #FF3CAC, #784BA0)"
      spans[1].style.opacity = "0"
      spans[1].style.transform = "scale(0)"
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
      spans[2].style.background = "linear-gradient(45deg, #FF3CAC, #784BA0)"
    } else {
      spans.forEach((span) => {
        span.style.transform = "none"
        span.style.opacity = "1"
        span.style.background = "linear-gradient(45deg, #FF3CAC, #784BA0, #2B86C5)"
      })
    }
  }
}

// Close mobile menu when clicking outside
document.addEventListener("click", (event) => {
  const navbar = document.querySelector(".navbar")
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (navbar && hamburger && navMenu) {
    if (!navbar.contains(event.target) && navMenu.classList.contains("active")) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")

      // Reset hamburger animation
      const spans = hamburger.querySelectorAll("span")
      spans.forEach((span) => {
        span.style.transform = "none"
        span.style.opacity = "1"
        span.style.background = "linear-gradient(45deg, #FF3CAC, #784BA0, #2B86C5)"
      })
    }
  }
})

// Lazy loading for images
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        img.classList.add("loaded")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => {
    img.classList.add("lazy")
    imageObserver.observe(img)
  })
}

// Enhanced particle effects with neon colors
function initParticleEffects() {
  // Create floating particles
  const particleContainer = document.createElement("div")
  particleContainer.className = "particle-container"
  particleContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    overflow: hidden;
  `

  // Create particles with neon colors
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    const colors = ["#FF3CAC", "#784BA0", "#2B86C5"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 8 + 3}px;
      height: ${Math.random() * 8 + 3}px;
      background: ${randomColor};
      border-radius: 50%;
      opacity: ${Math.random() * 0.6 + 0.2};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 15 + 10}s linear infinite;
      box-shadow: 0 0 10px ${randomColor};
    `
    particleContainer.appendChild(particle)
  }

  document.body.appendChild(particleContainer)

  // Add particle animation CSS
  if (!document.querySelector("#particle-styles")) {
    const style = document.createElement("style")
    style.id = "particle-styles"
    style.textContent = `
      @keyframes float {
        0% {
          transform: translateY(100vh) rotate(0deg);
        }
        100% {
          transform: translateY(-100px) rotate(360deg);
        }
      }
    `
    document.head.appendChild(style)
  }
}

// Enhanced form validation
function validateForm(formId) {
  const form = document.getElementById(formId)
  if (!form) return false

  const requiredFields = form.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    const value = field.value.trim()

    // Remove previous validation classes
    field.classList.remove("valid", "invalid")

    if (!value) {
      field.classList.add("invalid")
      field.style.borderColor = "#FF3CAC"
      field.style.boxShadow = "0 0 0 3px rgba(255, 60, 172, 0.2)"
      isValid = false
    } else {
      // Additional validation for email
      if (field.type === "email" && !isValidEmail(value)) {
        field.classList.add("invalid")
        field.style.borderColor = "#FF3CAC"
        field.style.boxShadow = "0 0 0 3px rgba(255, 60, 172, 0.2)"
        isValid = false
      } else {
        field.classList.add("valid")
        field.style.borderColor = "#2B86C5"
        field.style.boxShadow = "0 0 0 3px rgba(43, 134, 197, 0.2)"
      }
    }
  })

  if (!isValid) {
    showNotification("⚠️ Please fill in all required fields correctly.", "warning")
  }

  return isValid
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Loading state management
function setLoadingState(button, isLoading) {
  if (isLoading) {
    button.dataset.originalText = button.innerHTML
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
    button.disabled = true
    button.classList.add("loading")
  } else {
    button.innerHTML = button.dataset.originalText || "Submit"
    button.disabled = false
    button.classList.remove("loading")
  }
}

// Track important clicks with enhanced analytics
document.addEventListener("click", (e) => {
  const target = e.target.closest("a, button")
  if (!target) return

  // Add neon ripple effect for clicks
  const ripple = document.createElement("span")
  ripple.className = "ripple"
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 60, 172, 0.6) 0%, transparent 70%);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  `

  const rect = target.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  ripple.style.width = ripple.style.height = size + "px"
  ripple.style.left = e.clientX - rect.left - size / 2 + "px"
  ripple.style.top = e.clientY - rect.top - size / 2 + "px"

  target.style.position = "relative"
  target.style.overflow = "hidden"
  target.appendChild(ripple)

  setTimeout(() => ripple.remove(), 600)

  // Track clicks
  if (target.href && target.href.includes("tel:")) {
    trackClick("phone", "Phone Call Initiated")
  } else if (target.href && target.href.includes("mailto:")) {
    trackClick("email", "Email Initiated")
  } else if ((target.href && target.href.includes("whatsapp")) || (target.href && target.href.includes("wa.me"))) {
    trackClick("whatsapp", "WhatsApp Initiated")
  } else if (target.classList.contains("btn-primary")) {
    trackClick("button", "Primary CTA Clicked")
  }
})

// Add neon ripple animation CSS
if (!document.querySelector("#ripple-styles")) {
  const style = document.createElement("style")
  style.id = "ripple-styles"
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}

// Enhanced click tracking
function trackClick(element, action) {
  console.log(`🎯 Tracked: ${action} - ${element}`)

  // In a real implementation, you would send this to your analytics service
  // Example: Google Analytics, Mixpanel, etc.
  const gtag = window.gtag // Declare gtag variable
  if (typeof gtag !== "undefined") {
    gtag("event", "click", {
      event_category: element,
      event_label: action,
      value: 1,
    })
  }
}

// Add CSS for enhanced form validation with neon effects
const validationStyles = document.createElement("style")
validationStyles.textContent = `
.form-group input.valid,
.form-group select.valid,
.form-group textarea.valid {
  border-color: #2B86C5;
  box-shadow: 0 0 0 3px rgba(43, 134, 197, 0.2);
}

.form-group input.invalid,
.form-group select.invalid,
.form-group textarea.invalid {
  border-color: #FF3CAC;
  box-shadow: 0 0 0 3px rgba(255, 60, 172, 0.2);
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
`
document.head.appendChild(validationStyles)
