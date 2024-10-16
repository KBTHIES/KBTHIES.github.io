function onPageLoaded() {
    // Write your javascript code here
    console.log("page loaded");
}

function showSection(sectionId) {
    // Hide all sections
    var sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
        section.style.display = 'none';
    });
    
    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}

// Add event listeners to the buttons
document.getElementById('home-btn').addEventListener('click', function() {
    showSection('home');
});

document.getElementById('about-btn').addEventListener('click', function() {
    showSection('about');
});

document.getElementById('portfolio-btn').addEventListener('click', function() {
    showSection('portfolio');
});

document.addEventListener('DOMContentLoaded', function() {
    // Listen for clicks on elements with the class 'play-button'
    document.querySelectorAll('.play-button').forEach(function(button) {
        button.addEventListener('click', function() {
            // When a play button is clicked, simulate a click on the <a> tag within the same .video-container
            this.parentNode.querySelector('a').click();
        });
    });
});
