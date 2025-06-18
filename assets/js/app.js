// Language functionality
let currentLanguage = 'en';

// Load saved language from localStorage
function loadSavedLanguage() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        currentLanguage = savedLanguage;
        switchLanguage(currentLanguage);
    }
}

// Save language to localStorage
function saveLanguage(language) {
    localStorage.setItem('selectedLanguage', language);
}

function switchLanguage(language) {
    currentLanguage = language;
    saveLanguage(language);

    // Update HTML direction
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);

    // Update all text content
    const elements = document.querySelectorAll('[data-en][data-ar]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${language}`);
        if (text) {
            element.textContent = text;
        }
    });

    // Update placeholders
    const inputs = document.querySelectorAll('input[data-placeholder-en][data-placeholder-ar]');
    inputs.forEach(input => {
        const placeholder = input.getAttribute(`data-placeholder-${language}`);
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });

    // Update language selector
    const currentFlag = document.getElementById('currentFlag');
    const currentLanguageText = document.getElementById('currentLanguage');

    if (language === 'ar') {
        currentFlag.className = 'flag-icon flag-sa';
        currentLanguageText.textContent = 'العربية';
    } else {
        currentFlag.className = 'flag-icon flag-uk';
        currentLanguageText.textContent = 'English';
    }

    // Update selected option
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-lang') === language) {
            option.classList.add('selected');
        }
    });

    // Update segmented control position for RTL
    updatePillPosition();
}

// Tab functionality
document.addEventListener('DOMContentLoaded', function () {
    // Load saved language first
    loadSavedLanguage();

    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs and content
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Copy functionality for shareable links
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.previousElementSibling;
            input.select();
            document.execCommand('copy');

            const originalText = this.textContent;
            const copiedText = currentLanguage === 'ar' ? 'تم النسخ!' : 'Copied!';
            this.textContent = copiedText;
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        });
    });

    // Language selector functionality
    const languageTrigger = document.getElementById('languageTrigger');
    const languageOptions = document.getElementById('languageOptions');

    languageTrigger.addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('active');
        languageOptions.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function () {
        languageTrigger.classList.remove('active');
        languageOptions.classList.remove('show');
    });

    // Language option selection
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function () {
            const selectedLang = this.getAttribute('data-lang');
            switchLanguage(selectedLang);
            languageTrigger.classList.remove('active');
            languageOptions.classList.remove('show');
        });
    });
});


// inspired by
// https://www.cssscript.com/demo/ios-segmented-controls/

// Constants
const SEGMENTED_CONTROL_BASE_SELECTOR = ".ios13-segmented-control";
const SEGMENTED_CONTROL_INDIVIDUAL_SEGMENT_SELECTOR =
    ".ios13-segmented-control .option input";
const SEGMENTED_CONTROL_BACKGROUND_PILL_SELECTOR =
    ".ios13-segmented-control .selection";
// Main
document.addEventListener("DOMContentLoaded", setup);
// Body functions
function setup() {
    forEachElement(SEGMENTED_CONTROL_BASE_SELECTOR, (elem) => {
        elem.addEventListener("change", updatePillPosition);
    });
    window.addEventListener("resize", updatePillPosition); // Prevent pill from detaching from element when window resized. Becuase this is rare I haven't bothered with throttling the event
}

function updatePillPosition() {
    forEachElement(
        SEGMENTED_CONTROL_INDIVIDUAL_SEGMENT_SELECTOR,
        (elem, index) => {
            if (elem.checked) {
                moveBackgroundPillToElement(elem, index);
            }
        }
    );
}

// function moveBackgroundPillToElement(elem, index) {
//     const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
//     const segmentedControl = elem.closest('.ios13-segmented-control');
//     const totalOptions = segmentedControl.querySelectorAll('.option').length;

//     let translateX;
//     if (isRTL) {
//         // In RTL, reverse the index calculation
//         translateX = elem.offsetWidth * (totalOptions - 1 - index);

//     } else {
//         translateX = elem.offsetWidth * index;
//     }

//     document.querySelector(
//         SEGMENTED_CONTROL_BACKGROUND_PILL_SELECTOR
//     ).style.transform = "translateX(" + translateX + "px)";
// }

function moveBackgroundPillToElement(elem, index) {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    const segmentedControl = elem.closest('.ios13-segmented-control');
    const totalOptions = segmentedControl.querySelectorAll('.option').length;

    let translateX;
    if (isRTL) {
        // In RTL, use negative translation
        translateX = -elem.offsetWidth * index;
    } else {
        translateX = elem.offsetWidth * index;
    }

    document.querySelector(
        SEGMENTED_CONTROL_BACKGROUND_PILL_SELECTOR
    ).style.transform = "translateX(" + translateX + "px)";
}

// Helper functions
function forEachElement(className, fn) {
    Array.from(document.querySelectorAll(className)).forEach(fn);
}