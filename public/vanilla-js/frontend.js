const init_dot = document.querySelector(".init-dot");
const init_dots_trail = document.querySelector(".init-dot > .trail");
const triangle_bg = document.querySelector(".minimal-bg polygon");
const login_pallete = document.querySelector(".login-pallete");
const dice_logo = document.querySelector(".dice-logo");
init_dots_trail.style.width = "5em";
init_dot.style.transform = `rotate(${Math.atan2(1.05 * window.innerHeight, window.innerWidth) * (180/Math.PI)}deg)`;
setTimeout(() => init_dots_trail.style.animation = "unstable-trail 2s linear infinite", 300);
setTimeout(() => triangle_bg.style.opacity = 0.8, 1000);
setTimeout(() => {
    login_pallete.style.transform = "translateY(0)";
    login_pallete.style.opacity = 1;
}, 2000);
setTimeout(() => dice_logo.style.animationName = "pop-up", 4000)
setTimeout(() => {
    dice_logo.style.animationName = "shaking";
    dice_logo.style.animationIterationCount = "infinite"
    dice_logo.style.animationDirection = "alternate"
}, 5000)