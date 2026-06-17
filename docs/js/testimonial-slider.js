class TestimonialSlider {

    constructor(containerSelector, testimonialSelector) {

        this.container =
            document.querySelector(containerSelector);

        this.testimonials =
            document.querySelectorAll(testimonialSelector);

        this.dots =
            document.querySelectorAll(".dot");

        this.currentIndex = 0;
        this.isAnimating = false;
        this.slideInterval = null;

        this.init();

    }

    init() {

        if (
            !this.container ||
            this.testimonials.length === 0
        ) {
            console.error(
                "Testimonial container or testimonials not found"
            );
            return;
        }

        this.testimonials.forEach((testimonial, index) => {

            testimonial.style.position = "absolute";
            testimonial.style.top = "0";
            testimonial.style.left = "0";
            testimonial.style.width = "100%";

            if (index === 0) {

                testimonial.style.transform =
                    "translateX(0)";

                testimonial.style.opacity = "1";

            } else {

                testimonial.style.transform =
                    "translateX(100%)";

                testimonial.style.opacity = "0";

            }

        });

        this.updateDots();
        this.bindDots();
        this.startAutoSlide();

    }

    updateDots() {

        this.dots.forEach((dot, index) => {

            if (index === this.currentIndex) {

                dot.classList.add("active");

            } else {

                dot.classList.remove("active");

            }

        });

    }

    slideToNext() {

        if (
            this.isAnimating ||
            this.testimonials.length <= 1
        ) {
            return;
        }

        this.isAnimating = true;

        const currentTestimonial =
            this.testimonials[this.currentIndex];

        const nextIndex =
            (this.currentIndex + 1) %
            this.testimonials.length;

        const nextTestimonial =
            this.testimonials[nextIndex];

        currentTestimonial.style.transition =
            "transform 0.8s ease-in-out, opacity 0.8s ease-in-out";

        currentTestimonial.style.transform =
            "translateX(-100%)";

        currentTestimonial.style.opacity = "0";

        nextTestimonial.style.transition = "none";
        nextTestimonial.style.transform =
            "translateX(100%)";

        nextTestimonial.style.opacity = "0";

        setTimeout(() => {

            nextTestimonial.style.transition =
                "transform 0.8s ease-in-out, opacity 0.8s ease-in-out";

            nextTestimonial.style.transform =
                "translateX(0)";

            nextTestimonial.style.opacity = "1";

            this.currentIndex = nextIndex;

            this.updateDots();

            setTimeout(() => {

                this.isAnimating = false;

            }, 800);

        }, 50);

    }

    goToSlide(index) {

        if (
            this.isAnimating ||
            index === this.currentIndex
        ) {
            return;
        }

        this.isAnimating = true;
        const currentTestimonial =
            this.testimonials[this.currentIndex];
        const nextTestimonial =
            this.testimonials[index];
        currentTestimonial.style.transition =
            "transform 0.8s ease-in-out, opacity 0.8s ease-in-out";
        currentTestimonial.style.transform =
            "translateX(-100%)";
        currentTestimonial.style.opacity = "0";
        nextTestimonial.style.transition = "none";
        nextTestimonial.style.transform =
            "translateX(100%)";
        nextTestimonial.style.opacity = "0";

        setTimeout(() => {
            nextTestimonial.style.transition =
                "transform 0.8s ease-in-out, opacity 0.8s ease-in-out";
            nextTestimonial.style.transform =
                "translateX(0)";
            nextTestimonial.style.opacity = "1";
            this.currentIndex = index;
            this.updateDots();
            setTimeout(() => {
                this.isAnimating = false;

            }, 800);

        }, 50);

    }

    bindDots() {

        this.dots.forEach((dot, index) => {

            dot.addEventListener("click", () => {
                this.stopAutoSlide();
                this.goToSlide(index);
                this.startAutoSlide();

            });

        });

    }

    startAutoSlide() {

        this.stopAutoSlide();

        this.slideInterval = setInterval(() => {

            this.slideToNext();

        }, 5000);

    }

    stopAutoSlide() {

        if (this.slideInterval) {
            clearInterval(this.slideInterval);

        }
    }
    pauseOnHover() {
        this.container.addEventListener(
            "mouseenter",
            () => {

                this.stopAutoSlide();
            }
        );
        this.container.addEventListener(
            "mouseleave",
            () => {

                this.startAutoSlide();
            }
        );
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const slider =
            new TestimonialSlider(
                ".testimonial-container",
                ".testimonial-item"
            );

        slider.pauseOnHover();

    }
);
