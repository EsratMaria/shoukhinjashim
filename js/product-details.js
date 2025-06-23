// Toggle collapsible sections
function toggleSection(header) {
    const section = header.parentElement;
    section.classList.toggle('active');
}

// Size guide modal
function openSizeGuide(e) {
    e.preventDefault();
    const modal = document.getElementById('sizeGuideModal');
    modal.style.display = 'block';
    
    // Prevent body scroll on mobile when modal is open
    if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
    }
}

function closeSizeGuide() {
    const modal = document.getElementById('sizeGuideModal');
    modal.style.display = 'none';
    
    // Re-enable body scroll
    document.body.style.overflow = '';
}

// Size guide unit conversion with complete data
const sizeDataCm = {
    'XXS': { bust: 76, waist: 61, hip: 86 },
    'XS': { bust: 81, waist: 66, hip: 91 },
    'S': { bust: 86, waist: 71, hip: 97 },
    'M': { bust: 91, waist: 76, hip: 102 },
    'L': { bust: 97, waist: 81, hip: 107 },
    'XL': { bust: 104, waist: 89, hip: 114 },
    'XXL': { bust: 112, waist: 97, hip: 122 }
};

function toggleUnit(unit) {
    const buttons = document.querySelectorAll('.unit-toggle button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const tbody = document.getElementById('sizeTableBody');
    tbody.innerHTML = '';
    
    Object.entries(sizeDataCm).forEach(([size, measurements]) => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = size;
        
        if (unit === 'in') {
            row.insertCell(1).textContent = Math.round(measurements.bust / 2.54);
            row.insertCell(2).textContent = Math.round(measurements.waist / 2.54);
            row.insertCell(3).textContent = Math.round(measurements.hip / 2.54);
        } else {
            row.insertCell(1).textContent = measurements.bust;
            row.insertCell(2).textContent = measurements.waist;
            row.insertCell(3).textContent = measurements.hip;
        }
    });
}

// Truncate breadcrumb text for mobile
function truncateBreadcrumbMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        const breadcrumbText = document.querySelector('.breadcrumb-text');
        if (!breadcrumbText) return;
        
        const spans = breadcrumbText.querySelectorAll('span:not(.breadcrumb-separator)');
        const lastSpan = spans[spans.length - 1]; // Product name span
        
        if (lastSpan) {
            const originalText = lastSpan.getAttribute('data-original') || lastSpan.textContent;
            
            // Store original text
            if (!lastSpan.getAttribute('data-original')) {
                lastSpan.setAttribute('data-original', originalText);
            }
            
            // If text is longer than 20 characters, truncate it
            if (originalText.length > 20) {
                const words = originalText.split(' ');
                
                if (words.length >= 2) {
                    // Keep first word and last word
                    const firstWord = words[0];
                    const lastWord = words[words.length - 1];
                    lastSpan.textContent = `${firstWord} ... ${lastWord}`;
                } else {
                    // Single long word - keep first 8 and last 4 characters
                    const truncated = originalText.substring(0, 8) + ' ... ' + originalText.substring(originalText.length - 4);
                    lastSpan.textContent = truncated;
                }
            }
        }
    } else {
        // Restore original text on desktop
        const breadcrumbText = document.querySelector('.breadcrumb-text');
        if (breadcrumbText) {
            const lastSpan = breadcrumbText.querySelector('span[data-original]');
            if (lastSpan) {
                lastSpan.textContent = lastSpan.getAttribute('data-original');
            }
        }
    }
}

// Get product images dynamically from HTML
function getProductImages() {
    const images = [];
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Get images from thumbnails
    thumbnails.forEach(thumb => {
        const imageSrc = thumb.getAttribute('data-image');
        if (imageSrc) {
            images.push(imageSrc);
        }
    });
    
    // If no thumbnails, get from main image
    if (images.length === 0) {
        const mainImage = document.getElementById('mainProductImage');
        if (mainImage && mainImage.src) {
            images.push(mainImage.src);
        }
    }
    
    return images;
}

// Mobile swipe functionality
let touchStartX = 0;
let touchEndX = 0;
let currentSlide = 0;
let isTransitioning = false;

function initMobileSlider() {
    const mainImage = document.querySelector('.main-image');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && mainImage) {
        // Create mobile slider structure if not exists
        if (!mainImage.querySelector('.mobile-image-slider')) {
            // Get images dynamically
            const images = getProductImages();
            
            // Create slider wrapper
            const slider = document.createElement('div');
            slider.className = 'mobile-image-slider';
            
            // Create slides
            images.forEach((src, index) => {
                const slide = document.createElement('div');
                slide.className = 'mobile-image-slide';
                slide.innerHTML = `<img src="${src}" alt="Product Image ${index + 1}">`;
                slider.appendChild(slide);
            });
            
            // Replace current image with slider
            const currentImg = mainImage.querySelector('img');
            if (currentImg) {
                currentImg.remove();
            }
            mainImage.appendChild(slider);
            
            // Add swipe indicator
            const swipeIndicator = document.createElement('div');
            swipeIndicator.className = 'swipe-indicator';
            swipeIndicator.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                <span>Swipe for more</span>
            `;
            mainImage.appendChild(swipeIndicator);
        }
        
        // Add touch event listeners
        mainImage.addEventListener('touchstart', handleTouchStart, { passive: true });
        mainImage.addEventListener('touchmove', handleTouchMove, { passive: true });
        mainImage.addEventListener('touchend', handleTouchEnd);
    }
}

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
}

function handleTouchEnd() {
    if (isTransitioning) return;
    
    const threshold = 50; // Minimum swipe distance
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Swipe left - next image
            nextSlide();
        } else {
            // Swipe right - previous image
            previousSlide();
        }
    }
}

function nextSlide() {
    const slider = document.querySelector('.mobile-image-slider');
    const slides = document.querySelectorAll('.mobile-image-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateSlider(slider, dots);
    }
}

function previousSlide() {
    const slider = document.querySelector('.mobile-image-slider');
    const dots = document.querySelectorAll('.dot');
    
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider(slider, dots);
    }
}

function updateSlider(slider, dots) {
    if (!slider) return;
    
    isTransitioning = true;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // Reset transition flag
    setTimeout(() => {
        isTransitioning = false;
    }, 300);
}

// Image gallery functionality for desktop
document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth <= 768;
    
    // Truncate breadcrumb on load
    truncateBreadcrumbMobile();
    
    if (isMobile) {
        initMobileSlider();
    } else {
        // Desktop functionality
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('mainProductImage');
        const dots = document.querySelectorAll('.dot');
        
        // Get images dynamically
        const images = getProductImages();

        // Thumbnail click handler
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                
                // Update main image
                const newImageSrc = thumb.getAttribute('data-image');
                if (newImageSrc && mainImage) {
                    mainImage.src = newImageSrc;
                }
                
                // Update dots
                dots.forEach(d => d.classList.remove('active'));
                if (dots[index]) {
                    dots[index].classList.add('active');
                }
            });
        });

        // Dot click handler for desktop
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (isMobile) {
                    // Mobile dot functionality
                    currentSlide = index;
                    const slider = document.querySelector('.mobile-image-slider');
                    updateSlider(slider, dots);
                } else {
                    // Desktop dot functionality
                    dots.forEach(d => d.classList.remove('active'));
                    dot.classList.add('active');
                    
                    // Update main image
                    if (images[index] && mainImage) {
                        mainImage.src = images[index];
                    }
                    
                    // Update active thumbnail
                    thumbnails.forEach(t => t.classList.remove('active'));
                    if (thumbnails[index]) {
                        thumbnails[index].classList.add('active');
                    }
                }
            });
        });
    }
    
    // Size selection
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    // Ensure size guide link works on mobile
    const sizeGuideLink = document.querySelector('.size-guide-link');
    if (sizeGuideLink) {
        sizeGuideLink.addEventListener('click', openSizeGuide);
    }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Update breadcrumb truncation
        truncateBreadcrumbMobile();
        
        const wasMobile = document.querySelector('.mobile-image-slider');
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile && !wasMobile) {
            // Switched to mobile
            location.reload(); // Simple reload to restructure
        } else if (!isMobile && wasMobile) {
            // Switched to desktop
            location.reload(); // Simple reload to restructure
        }
    }, 250);
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('sizeGuideModal');
    if (event.target == modal) {
        closeSizeGuide();
    }
}

// Handle escape key for modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('sizeGuideModal');
        if (modal.style.display === 'block') {
            closeSizeGuide();
        }
    }
});

// Prevent body scroll when swiping on mobile
document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.querySelector('.main-image');
    if (mainImage && window.innerWidth <= 768) {
        let startY = 0;
        
        mainImage.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        mainImage.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const diff = startY - currentY;
            
            // If mostly horizontal swipe, prevent default
            if (Math.abs(diff) < 10) {
                e.preventDefault();
            }
        }, { passive: false });
    }
});

// Initialize unit toggle to show cm by default
document.addEventListener('DOMContentLoaded', function() {
    const cmButton = document.querySelector('.unit-toggle button[onclick*="cm"]');
    if (cmButton) {
        toggleUnit('cm');
    }
});