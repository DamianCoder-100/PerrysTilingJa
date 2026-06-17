console.log("gallery.js loaded");

const galleryGrid = document.getElementById("galleryGrid");

let galleryImages = [];

/**
 * LOAD GALLERY
 */
async function loadGallery() {
    try {
        const response = await fetch("./data/gallery.json");

        if (!response.ok) {
            throw new Error("Failed to load gallery data");
        }

        galleryImages = await response.json();

        initFilters();
        renderGallery(sortGallery(galleryImages));

    } catch (error) {
        console.error("Gallery Error:", error);
    }
}

/**
 * SORT LOGIC (YOUR EXACT REQUIREMENT)
 * - Non-pools first (bathroom, kitchen, living-room, stairs)
 * - Pools always last
 * - Then ID descending (15 → 1)
 */
function sortGallery(images) {

    return [...images].sort((a, b) => {

        const aIsPool = a.category === "pool";
        const bIsPool = b.category === "pool";

        // 1. Push pools to bottom
        if (aIsPool && !bIsPool) return 1;
        if (!aIsPool && bIsPool) return -1;

        // 2. Category priority (controls what shows first)
        const priority = {
            "bathroom": 1,
            "kitchen": 2,
            "living-room": 3,
            "stairs": 4,
            "pool": 99
        };

        const aPriority = priority[a.category] ?? 50;
        const bPriority = priority[b.category] ?? 50;

        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        // 3. Final fallback: ID (15 → 1)
        return b.id - a.id;
    });
}

/**
 * RENDER GRID
 */
function renderGallery(images) {

    if (!galleryGrid) {
        console.error("galleryGrid not found");
        return;
    }

    galleryGrid.innerHTML = "";

    images.forEach((image, index) => {

        const item = document.createElement("div");
        item.className = "gallery-item";

        item.style.animationDelay = `${index * 0.04}s`;

        item.innerHTML = `
            <div class="image-wrapper">

                <img
                    src="${image.src}"
                    class="gallery-img"
                    alt="${image.alt}"
                    data-title="${image.title}"
                    data-category="${image.category}"
                    onclick="openLightbox(this)"
                    data-bs-toggle="modal"
                    data-bs-target="#lightboxModal"
                >

            </div>
        `;

        galleryGrid.appendChild(item);
    });
}

/**
 * FILTER SYSTEM
 */
function initFilters() {

    const buttons = document.querySelectorAll("button[data-category]");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const category = button.dataset.category;

            const filtered = category === "all"
                ? galleryImages
                : galleryImages.filter(img => img.category === category);

            renderGallery(sortGallery(filtered));
        });
    });

    document.querySelector('[data-category="all"]')
        ?.classList.add("active");
}

/**
 * LIGHTBOX
 */
window.openLightbox = function (img) {

    const modalImage = document.getElementById("lightboxImage");
    const modalTitle = document.getElementById("lightboxTitle");

    if (modalImage) {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
    }

    if (modalTitle) {
        modalTitle.textContent = img.dataset.title || "";
    }
};

loadGallery();