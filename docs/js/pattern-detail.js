console.log("pattern-details.js loaded");

/**
 * ==========================================
 * GET PATTERN KEY FROM URL
 * Example:
 * pattern-detail.html?type=chevron
 * ==========================================
 */
function getPatternKey() {
    const params = new URLSearchParams(window.location.search);
    return params.get("type") || "straight";
}

/**
 * ==========================================
 * LOAD PATTERN DATA
 * ==========================================
 */
async function loadPattern() {

    try {

        const response = await fetch("./data/patterns.json");

        if (!response.ok) {
            throw new Error(
                `Failed to load patterns.json (${response.status})`
            );
        }

        const data = await response.json();

        const patternKey = getPatternKey();

        console.log("Selected pattern:", patternKey);

        const pattern = data[patternKey];

        if (!pattern) {

            console.error(
                "Available patterns:",
                Object.keys(data)
            );

            throw new Error(
                `Pattern not found: ${patternKey}`
            );
        }

        renderPattern(pattern);

    } catch (error) {

        console.error(
            "Pattern loading error:",
            error
        );

        showError(error.message);
    }
}

/**
 * ==========================================
 * RENDER PATTERN
 * ==========================================
 */
function renderPattern(pattern) {

    // TITLE
    const title =
        document.getElementById("patternTitle");

    if (title) {
        title.textContent =
            pattern.title || "Untitled Pattern";
    }

    // HERO IMAGE (Wireframe / Diagram)
    const hero =
        document.getElementById("patternHero");

    if (hero) {

        hero.src =
            pattern.heroImage ||
            "pictures/placeholder.jpg";

        hero.alt =
            pattern.title ||
            "Tile Pattern";
    }

    // EXAMPLE IMAGE (Actual Installation Photo)
    const example =
        document.getElementById("patternExample");

    if (example) {

        example.src =
            pattern.exampleImage ||
            "pictures/placeholder.jpg";

        example.alt =
            `${pattern.title} Example`;
    }

    // WASTE MULTIPLIER
    const multiplier =
        document.getElementById(
            "patternMultiplier"
        );

    if (multiplier) {

        multiplier.textContent =
            pattern.multiplierDisplay ||
            "N/A";
    }

    // DESCRIPTION
    const description =
        document.getElementById(
            "patternDesc"
        );

    if (description) {

        description.textContent =
            pattern.description ||
            "No description available.";
    }

    // BEST USED FOR
    const usage =
        document.getElementById(
            "patternUsage"
        );

    if (usage) {

        usage.textContent =
            pattern.bestUsedFor ||
            "Not specified.";
    }

    // INSTALLATION NOTES
    const difficulty =
        document.getElementById(
            "patternDifficulty"
        );

    if (difficulty) {

        difficulty.textContent =
            pattern.difficulty ||
            "No installation notes available.";
    }

    console.log(
        `${pattern.title} rendered successfully`
    );
}

/**
 * ==========================================
 * DISPLAY ERROR ON PAGE
 * ==========================================
 */
function showError(message) {

    const title =
        document.getElementById("patternTitle");

    if (title) {
        title.textContent =
            "Pattern Not Found";
    }

    const description =
        document.getElementById("patternDesc");

    if (description) {
        description.textContent =
            message;
    }
}

/**
 * ==========================================
 * INIT
 * ==========================================
 */
document.addEventListener(
    "DOMContentLoaded",
    loadPattern
);