// Modal elements
const modal = document.getElementById('carousel-modal');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const carouselTrack = document.getElementById('carousel-track');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const dotsContainer = document.getElementById('carousel-dots');

let currentSlide = 0;
let currentImages = [];

// Function to extract images from a cluster
function extractImagesFromCluster(clusterElement) {
    const images = [];
    const clusterImages = clusterElement.querySelectorAll('.cluster-image img');
    const clusterLabel = clusterElement.querySelector('.cluster-label').textContent.trim();
    
    clusterImages.forEach((img, index) => {
        // Get higher resolution version of image by replacing dimensions
        const highResSrc = img.src.replace(/w=400&h=400/, 'w=800&h=600');
        
        images.push({
            src: highResSrc,
            caption: img.dataset.caption || img.alt || `${clusterLabel} - Image ${index + 1}`
        });
    });
    
    return images;
}

// Function to get cluster title
function getClusterTitle(clusterElement) {
    const labelElement = clusterElement.querySelector('.cluster-label');
    if (labelElement) {
        // Remove the count span from the title
        const clonedLabel = labelElement.cloneNode(true);
        const countSpan = clonedLabel.querySelector('.cluster-count');
        if (countSpan) {
            countSpan.remove();
        }
        return clonedLabel.textContent.trim();
    }
    return 'Gallery';
}

// Open modal function
function openModal(clusterElement) {
    currentImages = extractImagesFromCluster(clusterElement);
    currentSlide = 0;
    modalTitle.textContent = getClusterTitle(clusterElement);

    // Create slides
    carouselTrack.innerHTML = '';
    currentImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `
            <img src="${image.src}" alt="Gallery Image ${index + 1}">
            <div class="carousel-caption">${image.caption}</div>
        `;
        carouselTrack.appendChild(slide);
    });

    // Create dots
    dotsContainer.innerHTML = '';
    currentImages.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal function
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Go to slide function
function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    const translateX = -slideIndex * 100;
    carouselTrack.style.transform = `translateX(${translateX}%)`;

    // Update dots
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
    });
}

// Next slide function
function nextSlide() {
    const nextIndex = (currentSlide + 1) % currentImages.length;
    goToSlide(nextIndex);
}

// Previous slide function
function prevSlide() {
    const prevIndex = (currentSlide - 1 + currentImages.length) % currentImages.length;
    goToSlide(prevIndex);
}

// Auto-update cluster counts based on actual images
function updateClusterCounts() {
    document.querySelectorAll('.gallery-cluster').forEach(cluster => {
        const imageCount = cluster.querySelectorAll('.cluster-image').length;
        const countElement = cluster.querySelector('.cluster-count');
        if (countElement) {
            countElement.textContent = imageCount;
        }
    });
}

// Event listeners
document.querySelectorAll('.gallery-cluster').forEach(cluster => {
    cluster.addEventListener('click', () => {
        openModal(cluster);
    });
});

modalClose.addEventListener('click', closeModal);
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    switch (e.key) {
        case 'Escape':
            closeModal();
            break;
        case 'ArrowLeft':
            prevSlide();
            break;
        case 'ArrowRight':
            nextSlide();
            break;
    }
});

// Initialize cluster counts on page load
document.addEventListener('DOMContentLoaded', updateClusterCounts);