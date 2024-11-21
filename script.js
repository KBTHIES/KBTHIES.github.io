function onPageLoaded() {
    // Write your javascript code here
    console.log("page loaded");
}

window.addEventListener("resize", adjustTextScale);
window.addEventListener("load", adjustTextScale); // Also adjust on page load

function adjustTextScale() {
    const homeContent = document.getElementById("home-content");
    const maxHeight = window.innerHeight * 0.8; // 80% of the viewport height

    // Check if the height of #home-content exceeds 80vh
    if (homeContent.offsetHeight > maxHeight) {
        homeContent.classList.add("scaled"); // Apply scaling if too tall
    } else {
        homeContent.classList.remove("scaled"); // Remove scaling if the height is normal
    }
}

const headerTitle = document.querySelector("header h1");
let homeOverlay = document.getElementById("home-overlay");
let portfolioOverlay = document.getElementById("fade-overlay");
let isHomeActive = true;
// Global variable to store delay time in seconds
let homeTransitionDelay = 1; // Delay in seconds
let homeInitialDelay = 3; // Delay in seconds

function updateHeaderOpacity(sectionId) {
    if (sectionId === "home") {
        headerTitle.style.opacity = "0"; // Set opacity to 0 when Home is active
    } else {
        headerTitle.style.opacity = "1"; // Set opacity to 1 for other sections
    }
}

function showSection(sectionId) {
    // select header and footer for editing
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    // Hide all sections
    const sections = document.querySelectorAll(".section");
    sections.forEach(function (section) {
        section.style.display = "none";
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = "block";

    // Update active class for buttons
    const buttons = document.querySelectorAll("nav button");
    buttons.forEach(function (button) {
        button.classList.remove("active");
    });

    // Add active class to the clicked button
    const activeButton = document.getElementById(sectionId + "-btn");
    if (activeButton) {
        activeButton.classList.add("active");
    }

    // Handle background color
    const backgroundOverlay = document.getElementById("background-overlay");
    if (sectionId === "home") {
        backgroundOverlay.style.backgroundColor = "gray"; // Uniform Gray for Home
    } else {
        backgroundOverlay.style.backgroundColor = "white"; // White for other sections
    }

    // Handle Portfolio section
    if (sectionId === "portfolio") {
        portfolioOverlay.style.transform = "translateY(0)"; // Reset position
        portfolioOverlay.style.zIndex = 9; // Ensure it's above other content
        portfolioOverlay.style.transition = "transform 2s"; // Smooth transition
        setTimeout(() => {
            portfolioOverlay.style.transform = "translateY(110vh)"; // Animate downward
        }, 100);
        // Enable box-shadow for header and footer
        header.classList.add("with-shadow");
        footer.classList.add("with-shadow");
    } else {
        portfolioOverlay.style.transform = "translateY(0)"; // Reset position
        portfolioOverlay.style.transition = "none"; // Instant reset
        portfolioOverlay.style.zIndex = -2; // Move it behind content
        // Disable box-shadow for header and footer
        header.classList.remove("with-shadow");
        footer.classList.remove("with-shadow");
    }

    // Reattach the scroll listener if Home is displayed
    if (sectionId === "home") {
        // Delay the addition of the scroll event listener
        setTimeout(() => {
            window.addEventListener("wheel", handleHomeScroll);
        }, homeTransitionDelay * 1000); // Multiply by 1000 to convert seconds to milliseconds

        // Set header opacity for Home
        updateHeaderOpacity("home");
    } else {
        // Remove the scroll event listener when not on Home page
        window.removeEventListener("wheel", handleHomeScroll);

        // Set header opacity for other sections
        updateHeaderOpacity(sectionId);
    }
}

const STAR_ICON = "✦"; // You can replace this with another icon or Unicode character if needed
let currentSlideIndex = 0;
let project = null; // Global variable to store the current project

// Function to handle scroll input on the Home section
function handleHomeScroll(event) {
    const deltaY = event.deltaY;

    // Check if Home is currently displayed
    const homeSection = document.getElementById("home");
    if (homeSection.style.display === "block" && deltaY > 0) {
        // User is scrolling down, navigate to Portfolio
        showSection("portfolio");

        // Temporarily remove the event listener to prevent repeated triggering
        window.removeEventListener("wheel", handleHomeScroll);
    }
}

setTimeout(() => {
    // Attach the scroll event listener
    window.addEventListener("wheel", handleHomeScroll);
}, homeInitialDelay * 1000); // Multiply by 1000 to convert seconds to milliseconds

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

    const aboutSectionsContainer = document.querySelector("#about-sections");

    fetch("about-data.json")
        .then((response) => response.json())
        .then((data) => {
            data.forEach((section) => {
                const sectionDiv = document.createElement("div");
                sectionDiv.classList.add("about-section");

                const title = document.createElement("h3");
                title.textContent = section.Title;
                sectionDiv.appendChild(title);

                const list = document.createElement("ul");
                section.listArray.forEach((item) => {
                    const listItem = document.createElement("li");
                    listItem.textContent = item;
                    list.appendChild(listItem);
                });

                sectionDiv.appendChild(list);
                aboutSectionsContainer.appendChild(sectionDiv);
            });
        });

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
            // Filter out projects with Hidden: true
            const projects = data.projects.filter((project) => !project.Hidden);

            // Separate favorite and non-favorite projects
            const favoriteProjects = projects.filter((project) => project.Favorite);
            const nonFavoriteProjects = projects.filter((project) => !project.Favorite);

            // Split projects with Timeframe.Sortable
            const favoriteWithTimeframe = favoriteProjects.filter(
                (project) => project.Timeframe && project.Timeframe.Sortable
            );
            const favoriteWithoutTimeframe = favoriteProjects.filter(
                (project) => !project.Timeframe || !project.Timeframe.Sortable
            );
            const nonFavoriteWithTimeframe = nonFavoriteProjects.filter(
                (project) => project.Timeframe && project.Timeframe.Sortable
            );
            const nonFavoriteWithoutTimeframe = nonFavoriteProjects.filter(
                (project) => !project.Timeframe || !project.Timeframe.Sortable
            );

            // Sort favorites and non-favorites by Timeframe.Sortable (newest first)
            favoriteWithTimeframe.sort((a, b) => new Date(b.Timeframe.Sortable) - new Date(a.Timeframe.Sortable));
            nonFavoriteWithTimeframe.sort((a, b) => new Date(b.Timeframe.Sortable) - new Date(a.Timeframe.Sortable));

            // Combine sorted arrays: favorites first, then non-favorites
            const sortedProjects = [
                ...favoriteWithTimeframe,
                ...favoriteWithoutTimeframe,
                ...nonFavoriteWithTimeframe,
                ...nonFavoriteWithoutTimeframe
            ];

            const gridContainer = document.querySelector(".grid-container");

            // Loop through all projects (sorted and unsorted)
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

                // Add gold star for favorites
                if (project.Favorite) {
                    const favoriteStar = document.createElement("div");
                    favoriteStar.classList.add("favorite-star");
                    favoriteStar.innerHTML = `${STAR_ICON}`; // Unicode for gold star
                    gridItem.appendChild(favoriteStar);
                }

                const gridOverlay = document.createElement("div");
                gridOverlay.classList.add("grid-overlay");

                // Title
                const title = document.createElement("h3");
                title.textContent = project.Title;
                gridOverlay.appendChild(title);

                // Description (if it exists)
                if (project.Description) {
                    const description = document.createElement("p");
                    description.classList.add("description");
                    description.textContent = project.Description;
                    gridOverlay.appendChild(description);
                }

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
        fetch("lightbox-template.html")
            .then((response) => response.text())
            .then((template) => {
                lightbox.innerHTML = template;

                // Insert project title
                const titleElement = document.getElementById("lightbox-title");
                titleElement.textContent = project.Title;

                // Insert "Favorite" badge if the project is marked as favorite
                if (project.Favorite) {
                    const favoriteBadge = document.createElement("div");
                    favoriteBadge.classList.add("favorite-badge");

                    // Add the star icon and "Favorite" text
                    favoriteBadge.innerHTML = `${STAR_ICON} <span>Favorite</span>`;

                    // Insert the badge after the title
                    const headerElement = document.querySelector(".lightbox-header");
                    headerElement.insertBefore(favoriteBadge, titleElement.nextSibling);
                }

                // Insert Timeframe
                document.getElementById("lightbox-timeframe").textContent = project.Timeframe.Display;

                // Insert BodyContent as HTML (to handle <iframe> and other HTML tags)
                document.getElementById("project-description").innerHTML = project.BodyContent;

                // Handle Tags (Add to bottom of lightbox-content)
                const lightboxContent = document.querySelector(".lightbox-content");
                const tagsContainer = document.createElement("div");
                tagsContainer.classList.add("tags-container");

                if (project.Tags && project.Tags.length > 0) {
                    // Sort tags alphabetically
                    const sortedTags = project.Tags.slice().sort();

                    // Create small text for the tags
                    const tagsText = document.createElement("small");
                    tagsText.textContent = `Tags: ${sortedTags.join(", ")}`;
                    tagsContainer.appendChild(tagsText);

                    // Append the tags container to the lightbox-content
                    lightboxContent.appendChild(tagsContainer);
                }

                const slideshowContainer = document.getElementById("slideshow-images");
                const thumbnailContainer = document.getElementById("thumbnail-navigation");
                const prevArrow = document.querySelector(".prev");
                const nextArrow = document.querySelector(".next");
                const descriptionElement = document.getElementById("image-description");

                // Add Collaborators Section if applicable
                const collaboratorsSection = document.getElementById("collaborators-section");
                const collaboratorsText = document.getElementById("collaborators-text");

                if (project.Collaborators && project.Collaborators.length > 0) {
                    let collaboratorText = "In collaboration with ";

                    // Handle one collaborator
                    if (project.Collaborators.length === 1) {
                        const collaborator = project.Collaborators[0];
                        collaboratorText += collaborator.Role
                            ? `${collaborator.Name} (${collaborator.Role})`
                            : collaborator.Name;
                    }
                    // Handle two collaborators (no comma between)
                    else if (project.Collaborators.length === 2) {
                        const collaborator1 = project.Collaborators[0];
                        const collaborator2 = project.Collaborators[1];
                        collaboratorText += collaborator1.Role
                            ? `${collaborator1.Name} (${collaborator1.Role})`
                            : collaborator1.Name;
                        collaboratorText += ` and `;
                        collaboratorText += collaborator2.Role
                            ? `${collaborator2.Name} (${collaborator2.Role})`
                            : collaborator2.Name;
                    }
                    // Handle three or more collaborators (with commas)
                    else {
                        project.Collaborators.forEach((collaborator, index) => {
                            if (index === project.Collaborators.length - 1) {
                                collaboratorText += `and ${collaborator.Name}`;
                            } else {
                                collaboratorText += `${collaborator.Name}${collaborator.Role ? ` (${collaborator.Role})` : ""}, `;
                            }
                        });
                    }

                    collaboratorsText.textContent = collaboratorText;
                    collaboratorsSection.style.display = "block"; // Show the collaborators section
                } else {
                    collaboratorsSection.style.display = "none"; // Hide the collaborators section if there are no collaborators
                }

                // Process images as before
                if (project.Images && project.Images.length > 0) {
                    project.Images.forEach((image, index) => {
                        const slide = document.createElement("div");
                        slide.classList.add("slide");
                        if (index === 0) slide.style.display = "block";

                        const imgElement = document.createElement("img");
                        imgElement.src = image.ImageURL;
                        imgElement.alt = image.Description || `Image ${index + 1}`;
                        imgElement.style.width = "100%";
                        slide.appendChild(imgElement);

                        slideshowContainer.appendChild(slide);

                        if (project.Images.length > 1) {
                            const thumbColumn = document.createElement("div");
                            thumbColumn.classList.add("column");

                            const thumbnail = document.createElement("img");
                            thumbnail.src = image.ImageURL;
                            thumbnail.classList.add("demo");
                            thumbnail.alt = image.Description || `Image ${index + 1}`;
                            thumbnail.style.width = "100%";
                            thumbnail.addEventListener("click", () => {
                                showSlide(index);
                            });

                            thumbColumn.appendChild(thumbnail);
                            thumbnailContainer.appendChild(thumbColumn);
                        }
                    });

                    // Show/hide navigation elements based on the number of images
                    if (project.Images.length <= 1) {
                        prevArrow.style.display = "none";
                        nextArrow.style.display = "none";
                        thumbnailContainer.style.display = "none";
                    }

                    // Show the initial description
                    descriptionElement.textContent = project.Images[0].Description || "No description available";
                } else {
                    // No images, hide arrows, description, and thumbnail navigation
                    prevArrow.style.display = "none";
                    nextArrow.style.display = "none";
                    thumbnailContainer.style.display = "none";
                    descriptionElement.style.display = "none";

                    if (project.Iframes && project.Iframes.length > 0) {
                        // Handle iframes if no images
                        project.Iframes.forEach((iframeSrc) => {
                            const iframe = document.createElement("iframe");
                            iframe.src = iframeSrc;
                            iframe.width = "100%";
                            iframe.height = "500px";
                            iframe.frameBorder = "0";
                            slideshowContainer.appendChild(iframe);
                        });
                    } else if (project.Scripts && project.Scripts.length > 0) {
                        // Handle JavaScript outputs
                        project.Scripts.forEach((scriptCode) => {
                            const scriptContainer = document.createElement("div");
                            scriptContainer.classList.add("script-output");
                            const script = document.createElement("script");
                            script.textContent = scriptCode;
                            scriptContainer.appendChild(script);
                            slideshowContainer.appendChild(scriptContainer);
                        });
                    }
                }

                lightbox.style.display = "flex"; // Show the lightbox
            })
            .catch((error) => console.error("Error loading the template:", error));
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
