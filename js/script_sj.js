document.addEventListener('DOMContentLoaded', function() {
    // Global currency variables - moved to top level for consistency
    let currentCurrency = localStorage.getItem('selectedCurrency') || 'USD';
    let currentSymbol = localStorage.getItem('selectedSymbol') || '$';
    let currentRate = parseFloat(localStorage.getItem('selectedRate')) || 1;

    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const menuClose = document.querySelector('.mobile-menu-close');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', function() {
            nav.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Ship to dropdown functionality
    const shipToSelector = document.querySelector('.ship-to-selector');
    const shipToDropdown = document.querySelector('.ship-to-dropdown');
    const shipToOptions = document.querySelectorAll('.ship-to-option');
    
    if (shipToSelector && shipToDropdown) {
        // Toggle ship to dropdown
        shipToSelector.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            shipToDropdown.classList.toggle('active');
        });
        
        // Prevent dropdown from closing when clicking inside it
        shipToDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            if (shipToDropdown.classList.contains('active')) {
                shipToDropdown.classList.remove('active');
            }
        });
        
        // Country/currency selection
        if (shipToOptions.length) {
            shipToOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const country = this.getAttribute('data-country');
                    const currency = this.getAttribute('data-currency');
                    const symbol = this.getAttribute('data-symbol');
                    
                    // Update display in selector
                    const imgElement = shipToSelector.querySelector('img');
                    const textElement = shipToSelector.querySelector('span');
                    
                    if (imgElement && textElement) {
                        imgElement.src = `https://flagcdn.com/16x12/${country}.png`;
                        imgElement.alt = this.textContent.trim();
                        textElement.textContent = this.textContent.trim();
                    }
                    
                    // Update global currency variables for immediate use
                    currentCurrency = currency;
                    currentSymbol = symbol;
                    currentRate = parseFloat(getRateForCurrency(currency));
                    
                    // Update stored currency info for conversion
                    localStorage.setItem('selectedCurrency', currency);
                    localStorage.setItem('selectedSymbol', symbol);
                    localStorage.setItem('selectedRate', currentRate);
                    
                    // Convert all prices
                    convertAllPrices();
                    
                    // Close dropdown
                    shipToDropdown.classList.remove('active');
                });
            });
        }
    }
    
    // Helper function to get exchange rate for a currency
    function getRateForCurrency(currency) {
        switch(currency) {
            case 'BDT': return 110.5;
            case 'INR': return 83.2;
            case 'AUD': return 1.52;
            case 'USD': return 1;
            case 'EUR': return 0.92;
            case 'CAD': return 1.36;
            default: return 1;
        }
    }
    
    // Currency selector functionality
    const currencySelector = document.querySelector('.currency-selector');
    const currencyDropdown = document.querySelector('.currency-dropdown');
    const currencyOptions = document.querySelectorAll('.currency-option');
    const currentCurrencyDisplay = document.querySelector('.current-currency span');
    const currentCurrencyFlag = document.querySelector('.current-currency img');
    
    if (currencySelector && currencyDropdown) {
        // Toggle currency dropdown when clicking the selector
        currencySelector.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            currencyDropdown.classList.toggle('active');
        });
        
        // Prevent dropdown from closing when clicking inside it
        currencyDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            if (currencyDropdown.classList.contains('active')) {
                currencyDropdown.classList.remove('active');
            }
        });
        
        // Currency option selection
        if (currencyOptions.length) {
            currencyOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const currency = this.getAttribute('data-currency');
                    const symbol = this.getAttribute('data-symbol');
                    const rate = parseFloat(this.getAttribute('data-rate'));
                    
                    // Update global currency variables for immediate use
                    currentCurrency = currency;
                    currentSymbol = symbol;
                    currentRate = rate;
                    
                    // Update display in selector
                    if (currentCurrencyDisplay && currentCurrencyFlag) {
                        currentCurrencyDisplay.textContent = `${currency} (${symbol})`;
                        const countryCode = getCurrencyCountryCode(currency);
                        currentCurrencyFlag.src = `https://flagcdn.com/16x12/${countryCode}.png`;
                        currentCurrencyFlag.alt = getCountryName(countryCode);
                    }
                    
                    // Update stored currency info for conversion
                    localStorage.setItem('selectedCurrency', currency);
                    localStorage.setItem('selectedSymbol', symbol);
                    localStorage.setItem('selectedRate', rate);
                    
                    // Also update ship-to display if it exists
                    initializeShipToDisplay();
                    
                    // Convert all prices with a small visual indication
                    convertAllPrices(true);
                    
                    // Close dropdown
                    currencyDropdown.classList.remove('active');
                });
            });
        }
    }
    
    // Collection dropdown functionality
    const collectionLink = document.querySelector('.collection-link');
    const collectionSubmenu = document.querySelector('.has-submenu');
    const submenuOverlay = document.querySelector('.submenu-overlay');
    const closeBtn = document.querySelector('.close-btn');
    const backBtn = document.querySelector('.back-btn');
    
    // Collection link click handler - different for mobile and desktop
    if (collectionLink) {
        collectionLink.addEventListener('click', function(e) {
            // Only prevent default and toggle submenu on mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();
                collectionSubmenu.classList.toggle('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    }
    
    // Close and back buttons for mobile
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            collectionSubmenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            collectionSubmenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close submenu when clicking overlay
    if (submenuOverlay) {
        submenuOverlay.addEventListener('click', function() {
            collectionSubmenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Collection sliders functionality
    const sliders = document.querySelectorAll('.collection-slider');
    
    sliders.forEach(slider => {
        const slides = slider.querySelector('.collection-slides');
        const slideElements = slider.querySelectorAll('.collection-slide');
        
        if (slideElements.length <= 1) return; // Skip if only one slide
        
        let currentIndex = 0;
        let touchStartX;
        let touchEndX;
        
        // Clone first and last slides for infinite effect if multiple slides
        if (slideElements.length > 1) {
            const firstSlideClone = slideElements[0].cloneNode(true);
            const lastSlideClone = slideElements[slideElements.length - 1].cloneNode(true);
            
            slides.appendChild(firstSlideClone);
            slides.insertBefore(lastSlideClone, slideElements[0]);
            
            // Update slides after cloning
            const allSlides = slider.querySelectorAll('.collection-slide');
            
            // Position slides at first real slide (index 1 after cloning)
            slides.style.transform = `translateX(-100%)`;
            
            // Event listeners for touch
            slider.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            slider.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                
                if (touchEndX < touchStartX - 50) {
                    goToSlide(currentIndex + 1);
                }
                
                if (touchEndX > touchStartX + 50) {
                    goToSlide(currentIndex - 1);
                }
            });
            
            // Function to move to a specific slide
            function goToSlide(index) {
                currentIndex = index;
                slides.style.transition = 'transform 0.5s ease';
                slides.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
            }
            
            // Function to handle transition end
            function handleTransitionEnd() {
                // If we transitioned to the clone of the first slide, jump to the real first slide
                if (currentIndex === allSlides.length - 2) {
                    slides.style.transition = 'none';
                    currentIndex = 0;
                    slides.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
                }
                
                // If we transitioned to the clone of the last slide, jump to the real last slide
                if (currentIndex === -1) {
                    slides.style.transition = 'none';
                    currentIndex = allSlides.length - 3;
                    slides.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
                }
            }
            
            // Transition end event
            slides.addEventListener('transitionend', handleTransitionEnd);
        }
    });
    
    // Slideshow functionality for main banner
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slideshow-slide');
    const dotsContainer = document.querySelector('.slideshow-dots');
    
    // Create dots for each slide
    if (slides.length > 0 && dotsContainer) {
        dotsContainer.innerHTML = ''; // Clear any existing dots
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                showSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
    }
    
    // Get all dots after they've been created
    const dots = document.querySelectorAll('.dot');
    
    // Function to show a specific slide
    function showSlide(n) {
        // Reset index if out of bounds
        if (n >= slides.length) {
            slideIndex = 0;
        } else if (n < 0) {
            slideIndex = slides.length - 1;
        } else {
            slideIndex = n;
        }
        
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide and activate current dot
        if (slides.length > 0) {
            slides[slideIndex].style.display = 'block';
            slides[slideIndex].classList.add('active');
        }
        
        if (dots.length > 0) {
            dots[slideIndex].classList.add('active');
        }
    }
    
    // Function to advance slide
    function nextSlide() {
        showSlide(slideIndex + 1);
    }
    
    // Initialize slideshow
    if (slides.length > 0) {
        showSlide(0);
        
        // Auto advance slides every 5 seconds
        let slideshowInterval = setInterval(nextSlide, 5000);
        
        // Pause slideshow on hover
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', () => {
                clearInterval(slideshowInterval);
            });
            
            slideshowContainer.addEventListener('mouseleave', () => {
                slideshowInterval = setInterval(nextSlide, 5000);
            });
            
            // Swipe functionality for main slideshow
            let mainTouchStartX = 0;
            let mainTouchEndX = 0;
            
            function checkMainSwipeDirection() {
                if (mainTouchEndX < mainTouchStartX - 50) {
                    // Swipe left, go to next slide
                    nextSlide();
                }
                if (mainTouchEndX > mainTouchStartX + 50) {
                    // Swipe right, go to previous slide
                    showSlide(slideIndex - 1);
                }
            }
            
            slideshowContainer.addEventListener('touchstart', e => {
                mainTouchStartX = e.changedTouches[0].screenX;
            });
            
            slideshowContainer.addEventListener('touchend', e => {
                mainTouchEndX = e.changedTouches[0].screenX;
                checkMainSwipeDirection();
            });
        }
    }
    
    // CTA button event
    const ctaButton = document.querySelector('.cta button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            alert("You'll be connected with our stylists soon.");
        });
    }
    
    // Handle window resize - remove active class on desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (collectionSubmenu && collectionSubmenu.classList.contains('active')) {
                collectionSubmenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        }
    });

    // Search icon functionality
    const searchToggle = document.querySelector('.search-toggle');
    const searchBox = document.querySelector('.search-box');
    const searchClose = document.querySelector('.search-close');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-form input');
    const searchTags = document.querySelectorAll('.search-tag');

    if (searchToggle && searchBox) {
        // Toggle search box when clicking the search icon
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Stop event from bubbling
            searchBox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Focus the input when opening
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        });
        
        // Close search when clicking the close button
        if (searchClose) {
            searchClose.addEventListener('click', function() {
                searchBox.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
        }
        
        // Handle search form submission
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    // Here you would normally redirect to search results
                    alert('Searching for: ' + searchTerm);
                    // window.location.href = '/search?q=' + encodeURIComponent(searchTerm);
                }
            });
        }
        
        // Handle search tag clicks
        if (searchTags.length) {
            searchTags.forEach(tag => {
                tag.addEventListener('click', function() {
                    const searchText = this.textContent.trim();
                    searchInput.value = searchText;
                    searchInput.focus();
                });
            });
        }

        // Close search box when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchBox.classList.contains('active')) {
                searchBox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Initialize Ship To display with stored currency or default
    function initializeShipToDisplay() {
        const shipToSelector = document.querySelector('.ship-to-selector');
        
        if (shipToSelector) {
            const imgElement = shipToSelector.querySelector('img');
            const textElement = shipToSelector.querySelector('span');
            
            if (imgElement && textElement) {
                const countryCode = getCurrencyCountryCode(currentCurrency);
                const countryName = getCountryName(countryCode);
                
                imgElement.src = `https://flagcdn.com/16x12/${countryCode}.png`;
                imgElement.alt = countryName;
                textElement.textContent = `${countryName} ${currentSymbol}`;
            }
        }
    }
    
    // Initialize currency display on page load
    function initializeCurrencyDisplay() {
        if (currentCurrencyDisplay && currentCurrencyFlag) {
            currentCurrencyDisplay.textContent = `${currentCurrency} (${currentSymbol})`;
            const countryCode = getCurrencyCountryCode(currentCurrency);
            currentCurrencyFlag.src = `https://flagcdn.com/16x12/${countryCode}.png`;
            currentCurrencyFlag.alt = getCountryName(countryCode);
        }
    }
    
    // Initialize displays and convert prices
    initializeCurrencyDisplay();
    initializeShipToDisplay();
    convertAllPrices();
    
    // Helper function to get country code from currency - FIXED: Added CAD case
    function getCurrencyCountryCode(currency) {
        switch(currency) {
            case 'BDT': return 'bd';
            case 'INR': return 'in';
            case 'AUD': return 'au';
            case 'USD': return 'us';
            case 'EUR': return 'eu';
            case 'CAD': return 'ca';  // Added Canadian Dollar
            default: return 'us';
        }
    }
    
    // Helper function to get country name from country code - FIXED: Added Canada case
    function getCountryName(countryCode) {
        switch(countryCode) {
            case 'bd': return 'Bangladesh';
            case 'in': return 'India';
            case 'au': return 'Australia';
            case 'us': return 'USA';
            case 'eu': return 'Europe';
            case 'ca': return 'Canada';  // Added Canada
            default: return 'USA';
        }
    }
    
    // Function to convert all prices on the page with visual feedback
    function convertAllPrices(withAnimation = false) {
        // Target both generic price elements and specific product prices
        const priceElements = document.querySelectorAll('.price, .product-price');
        
        priceElements.forEach(element => {
            // Add converting class for animation if requested
            if (withAnimation) {
                element.classList.add('converting');
            }
            
            // Get original price if stored, otherwise extract from current text
            let originalPrice;
            if (element.hasAttribute('data-original-price')) {
                originalPrice = parseFloat(element.getAttribute('data-original-price'));
            } else {
                // Extract numeric value from text
                const priceText = element.textContent.trim();
                
                // Handle "Tk. 25,000" format
                if (priceText.startsWith('Tk.')) {
                    const numericValue = priceText.replace('Tk.', '').replace(/,/g, '').trim();
                    originalPrice = parseFloat(numericValue);
                    // Store the base price in BDT for future conversions
                    element.setAttribute('data-original-currency', 'BDT');
                    element.setAttribute('data-original-price', originalPrice);
                } else {
                    // Handle other formats - extract numeric portion
                    const numericValue = priceText.replace(/[^0-9.]/g, '');
                    originalPrice = parseFloat(numericValue);
                    // Assume USD if not specified
                    element.setAttribute('data-original-currency', 'USD');
                    element.setAttribute('data-original-price', originalPrice);
                }
            }
            
            // Get the original currency to apply the correct conversion
            const originalCurrency = element.getAttribute('data-original-currency') || 'USD';
            
            if (!isNaN(originalPrice)) {
                let convertedPrice;
                
                // Convert from original currency to selected currency
                if (originalCurrency === 'BDT') {
                    // Convert from BDT to USD first
                    const inUSD = originalPrice / 110.5; // Using the BDT rate from your data
                    // Then convert USD to target currency
                    convertedPrice = (inUSD * currentRate).toFixed(2);
                } else {
                    // Direct conversion if original is in USD
                    convertedPrice = (originalPrice * currentRate).toFixed(2);
                }
                
                // Format based on currency conventions
                const formattedPrice = formatPrice(convertedPrice);
                
                // Update the price display
                element.textContent = formattedPrice;
            }
            
            // Remove converting class after animation if it was added
            if (withAnimation) {
                setTimeout(() => {
                    element.classList.remove('converting');
                }, 800);
            }
        });
    }
    
    // Helper function to format price based on currency - FIXED: Added CAD formatting
    function formatPrice(price) {
        const numPrice = parseFloat(price);
        
        // Format with thousand separators
        const formattedNumber = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numPrice);
        
        // Position symbol based on currency
        switch(currentCurrency) {
            case 'BDT':
                return `${currentSymbol} ${formattedNumber}`;
            case 'INR':
                return `${currentSymbol} ${formattedNumber}`;
            case 'AUD':
                return `${currentSymbol}${formattedNumber}`;
            case 'USD':
                return `${currentSymbol}${formattedNumber}`;
            case 'EUR':
                return `${formattedNumber} ${currentSymbol}`;
            case 'CAD':
                return `${currentSymbol}${formattedNumber}`;  // Added Canadian Dollar formatting
            default:
                return `${currentSymbol}${formattedNumber}`;
        }
    }

    // Close menu when clicking Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (collectionSubmenu && collectionSubmenu.classList.contains('active')) {
                collectionSubmenu.classList.remove('active');
            }
        }
    });

    // Footer collapse functionality for mobile
    // Check if we're on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Get all footer sections
    const footerSections = document.querySelectorAll('.footer-section');
    
    // Initialize footer sections as collapsed on mobile
    function initializeFooterSections() {
        footerSections.forEach(section => {
            if (isMobile()) {
                section.classList.add('collapsed');
            } else {
                section.classList.remove('collapsed');
            }
        });
    }
    
    // Add click handlers to footer section headers
    footerSections.forEach(section => {
        const header = section.querySelector('h3');
        
        if (header) {
            header.addEventListener('click', function() {
                if (isMobile()) {
                    section.classList.toggle('collapsed');
                }
            });
        }
    });
    
    // Initialize on load
    initializeFooterSections();
    
    // Re-initialize on window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initializeFooterSections();
        }, 250);
    });
});