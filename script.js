function onPageLoaded() {
    // Write your javascript code here
    console.log("page loaded");
}

function showSection(sectionId) {
    // Hide all sections
    var sections = document.querySelectorAll(".section");
    sections.forEach(function (section) {
        section.style.display = "none";
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = "block";

    // Update active class for buttons
    var buttons = document.querySelectorAll("nav button");
    buttons.forEach(function (button) {
        button.classList.remove("active"); // Remove active class from all buttons
    });

    // Add active class to the clicked button
    var activeButton = document.getElementById(sectionId + "-btn");
    if (activeButton) {
        activeButton.classList.add("active");
    }
}

let currentSlideIndex = 0;
let project = null; // Global variable to store the current project

// Change slide function for the slideshow
function changeSlide(direction) {
    const slides = document.querySelectorAll(".slide");
    const descriptions = project.Images; // Access the current project's images for their descriptions

    // Hide the current slide
    slides[currentSlideIndex].style.display = "none";

    // Calculate the new slide index
    currentSlideIndex += direction;
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0; // Loop back to the first slide
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1; // Go to the last slide
    }

    // Show the new slide
    slides[currentSlideIndex].style.display = "block";

    // Update the image description
    document.getElementById("image-description").textContent =
        descriptions[currentSlideIndex].Description || "No description available";
}

// Add event listeners to the buttons
document.getElementById("home-btn").addEventListener("click", function () {
    showSection("home");
});

document.getElementById("about-btn").addEventListener("click", function () {
    showSection("about");
});

document.getElementById("portfolio-btn").addEventListener("click", function () {
    showSection("portfolio");
});
// Show the Home section by default and set the "home" button as active
showSection("home");

document.addEventListener("DOMContentLoaded", function () {
    console.log("page loaded");

    // Declare the tags Set
    const tags = new Set(); // Initialize the Set to collect tags

    // Event listeners for section buttons
    document.getElementById("home-btn").addEventListener("click", function () {
        showSection("home");
    });
    document.getElementById("about-btn").addEventListener("click", function () {
        showSection("about");
    });
    document.getElementById("portfolio-btn").addEventListener("click", function () {
        showSection("portfolio");
    });

    // Show the home section by default
    showSection("home");

    const lightbox = document.getElementById("lightbox");
    let currentSlideIndex = 0;
    let project = null;

    // Fetch the JSON data for projects
    fetch("projects.json")
        .then((response) => response.json())
        .then((data) => {
            const projects = data.projects;
        
            // Split the projects into those with and without Timeframe.Sortable
            const projectsWithTimeframe = projects.filter(project => project.Timeframe && project.Timeframe.Sortable);
            const projectsWithoutTimeframe = projects.filter(project => !project.Timeframe || !project.Timeframe.Sortable);

            // Sort projects by Timeframe.Sortable (newest first)
            projectsWithTimeframe.sort((a, b) => {
                return new Date(b.Timeframe.Sortable) - new Date(a.Timeframe.Sortable); // Sort descending by date
            });

            // Combine the two arrays: sorted projects first, then unsorted projects
            const sortedProjects = [...projectsWithTimeframe, ...projectsWithoutTimeframe];
        
            const gridContainer = document.querySelector(".grid-container");

            sortedProjects.forEach((project) => {
                // Add tags to the set
                if (project.Tags && Array.isArray(project.Tags)) {
                    project.Tags.forEach((tag) => tags.add(tag));
                }

                const gridItem = document.createElement("div");
                gridItem.classList.add("grid-item");
                gridItem.dataset.tags = project.Tags ? project.Tags.join(",") : "";

                let imageUrl =
                    project.ThumbnailImage && project.ThumbnailImage !== ""
                        ? project.ThumbnailImage
                        : "images/placeholder.jpg";
                gridItem.style.backgroundImage = `url(${imageUrl})`;

                const gridOverlay = document.createElement("div");
                gridOverlay.classList.add("grid-overlay");
                gridOverlay.textContent = project.Title;

                gridItem.appendChild(gridOverlay);
                gridContainer.appendChild(gridItem);

                // Add event listener to open the lightbox when grid item is clicked
                gridItem.addEventListener("click", () => {
                    showLightbox(project);
                });
            });

            // Add filter container to the portfolio section
            const portfolioSection = document.getElementById("portfolio");
            let filterContainer = document.createElement("div");
            filterContainer.classList.add("filter-container");

            // Create the "Filters" header
            const filtersHeader = document.createElement("h3");
            filtersHeader.textContent = "Filters";
            filterContainer.appendChild(filtersHeader); // Append the header to the filter container

            // Convert the Set to an array and sort alphabetically
            const sortedTags = Array.from(tags).sort();

            // Populate filter checkboxes
            sortedTags.forEach((tag) => {
                const label = document.createElement("label");
                label.textContent = tag;

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = tag;
                checkbox.style.display = "none"; // Hide the checkbox

                // Add click event to label
                label.addEventListener("click", () => {
                    checkbox.checked = !checkbox.checked; // Toggle the checkbox state
                    // Toggle the selected-filter class based on checkbox state
                    if (checkbox.checked) {
                        label.classList.add("selected-filter"); // Add class if checked
                    } else {
                        label.classList.remove("selected-filter"); // Remove class if unchecked
                    }
                    handleTagFilter(); // Call the filter function
                });

                label.prepend(checkbox);
                filterContainer.appendChild(label);
            });
        
            portfolioSection.insertBefore(filterContainer, portfolioSection.firstChild);
        })
    
        .catch((error) => console.error("Error fetching the JSON file:", error));

    function handleTagFilter() {
        const selectedTags = Array.from(document.querySelectorAll(".filter-container input:checked")).map(
            (input) => input.value
        );

        // Display all projects if no tags are selected
        if (selectedTags.length === 0) {
            document.querySelectorAll(".grid-item").forEach((item) => (item.style.display = "block"));
            return;
        }

        // Filter projects based on selected tags
        document.querySelectorAll(".grid-item").forEach((item) => {
            const projectTags = item.dataset.tags ? item.dataset.tags.split(",") : [];
            if (selectedTags.some((tag) => projectTags.includes(tag))) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    }

    // Filter projects based on selected tags
    document.querySelectorAll(".grid-item").forEach((item) => {
        const projectTags = item.dataset.tags ? item.dataset.tags.split(",") : [];
        if (selectedTags.some((tag) => projectTags.includes(tag))) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });

function showLightbox(selectedProject) {
    project = selectedProject; // Store the current project

    // Load the lightbox template
    fetch('lightbox-template.html')
        .then(response => response.text())
        .then(template => {
            lightbox.innerHTML = template;

            // Insert project title and timeframe
            document.getElementById('lightbox-title').textContent = project.Title;
            document.getElementById('lightbox-timeframe').textContent = project.Timeframe.Display;

            // Insert BodyContent as HTML (to handle <iframe> and other HTML tags)
            document.getElementById('project-description').innerHTML = project.BodyContent;

            const slideshowContainer = document.getElementById('slideshow-images');
            const thumbnailContainer = document.getElementById('thumbnail-navigation');
            const prevArrow = document.querySelector('.prev');
            const nextArrow = document.querySelector('.next');
            const descriptionElement = document.getElementById('image-description');

            if (project.Images && project.Images.length > 0) {
                // Process images as before
                project.Images.forEach((image, index) => {
                    const slide = document.createElement('div');
                    slide.classList.add('slide');
                    if (index === 0) slide.style.display = 'block';

                    const imgElement = document.createElement('img');
                    imgElement.src = image.ImageURL;
                    imgElement.alt = image.Description || `Image ${index + 1}`;
                    imgElement.style.width = "100%";
                    slide.appendChild(imgElement);

                    slideshowContainer.appendChild(slide);

                    if (project.Images.length > 1) {
                        const thumbColumn = document.createElement('div');
                        thumbColumn.classList.add('column');

                        const thumbnail = document.createElement('img');
                        thumbnail.src = image.ImageURL;
                        thumbnail.classList.add('demo');
                        thumbnail.alt = image.Description || `Image ${index + 1}`;
                        thumbnail.style.width = "100%";
                        thumbnail.addEventListener('click', () => {
                            showSlide(index);
                        });

                        thumbColumn.appendChild(thumbnail);
                        thumbnailContainer.appendChild(thumbColumn);
                    }
                });

                // Show/hide navigation elements based on the number of images
                if (project.Images.length <= 1) {
                    prevArrow.style.display = 'none';
                    nextArrow.style.display = 'none';
                    thumbnailContainer.style.display = 'none';
                }

                // Show the initial description
                descriptionElement.textContent = project.Images[0].Description || "No description available";
            } else {
                // No images, hide arrows, description, and thumbnail navigation
                prevArrow.style.display = 'none';
                nextArrow.style.display = 'none';
                thumbnailContainer.style.display = 'none';
                descriptionElement.style.display = 'none';

                if (project.Iframes && project.Iframes.length > 0) {
                    // Handle iframes if no images
                    project.Iframes.forEach(iframeSrc => {
                        const iframe = document.createElement('iframe');
                        iframe.src = iframeSrc;
                        iframe.width = '100%';
                        iframe.height = '500px';
                        iframe.frameBorder = '0';
                        slideshowContainer.appendChild(iframe);
                    });
                } else if (project.Scripts && project.Scripts.length > 0) {
                    // Handle JavaScript outputs
                    project.Scripts.forEach(scriptCode => {
                        const scriptContainer = document.createElement('div');
                        scriptContainer.classList.add('script-output');
                        const script = document.createElement('script');
                        script.textContent = scriptCode;
                        scriptContainer.appendChild(script);
                        slideshowContainer.appendChild(scriptContainer);
                    });
                }
            }

            lightbox.style.display = 'flex'; // Show the lightbox
        })
        .catch(error => console.error('Error loading the template:', error));
}


    function showSlide(slideIndex) {
        const slides = document.querySelectorAll(".slide");
        const thumbnails = document.querySelectorAll(".demo");

        if (slideIndex >= slides.length) {
            currentSlideIndex = 0;
        } else if (slideIndex < 0) {
            currentSlideIndex = slides.length - 1;
        } else {
            currentSlideIndex = slideIndex;
        }

        // Hide all slides
        slides.forEach((slide) => {
            slide.style.display = "none";
        });

        // Remove active class from all thumbnails
        thumbnails.forEach((thumb) => {
            thumb.classList.remove("active");
        });

        // Show the current slide and highlight the thumbnail
        slides[currentSlideIndex].style.display = "block";
        thumbnails[currentSlideIndex].classList.add("active");

        // Update image description
        document.getElementById("image-description").textContent =
            project.Images[currentSlideIndex].Description || "No description available";
    }

    // Next/previous controls
    function changeSlide(direction) {
        showSlide(currentSlideIndex + direction);
    }

    // Close the lightbox when clicking outside or on the close button
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox || event.target.matches(".close")) {
            lightbox.style.display = "none"; // Hide lightbox
        }
    });

    window.showLightbox = showLightbox; // Expose function globally
    window.changeSlide = changeSlide; // Expose function globally
});
