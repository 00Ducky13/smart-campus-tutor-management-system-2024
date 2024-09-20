function navigateTo(page) {
    window.location.href = `${page}.html`;
}

document.addEventListener("DOMContentLoaded", function() {
    const tutorForm = document.getElementById('tutorForm');
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('tutorRating');
    const availabilityInput = document.querySelector('.flatpickr');

    // Initialize Flatpickr
    if (availabilityInput) {
        flatpickr(availabilityInput, {
            mode: 'multiple',
            enableTime: true,
            dateFormat: 'Y-m-d H:i',
            minDate: "today"
        });
    }

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            ratingInput.value = value;
            stars.forEach(s => s.classList.remove('selected'));
            for (let i = 0; i < value; i++) {
                stars[i].classList.add('selected');
            }
        });

        star.addEventListener('mouseover', function() {
            stars.forEach(s => s.classList.remove('hover'));
            for (let i = 0; i <= this.getAttribute('data-value') - 1; i++) {
                stars[i].classList.add('hover');
            }
        });

        star.addEventListener('mouseout', function() {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });

    if (tutorForm) {
        tutorForm.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Profile saved!');
            // Here you can add code to save the form data
        });
    }
});

