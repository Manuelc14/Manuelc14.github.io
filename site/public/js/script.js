/*========= menu icon navbar =========*/

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};


/*========= scroll sections active link =========*/

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop -150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top <offset + height){
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ' ]').classList.add('active');
            });
        };
    });
    /*========= sticky navbar =========*/
    let header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 100);

    /*========= remove menu icon navbar when click navbar link(scroll) =========*/

    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');


}

/*========= swiper =========*/

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 40,
    loop: true,
    grabCursor: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

/*========= darck light mode =========*/

let darkModeIcon = document.querySelector('#darkMode-icon');

darkModeIcon.onclick = () => {
    darkModeIcon.classList.toggle('bxs-sun');
    document.body.classList.toggle('dark-mode');
}

/*========= scroll reveal =========*/

ScrollReveal({ 
    reset: true,
    distance: '80px',
    duration: 1000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img img, .services-container, .portfolio-box, .testimonial-wrapper, .about-content, .contact', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img img, .education-column, .skills-column, form', { origin: 'left' });
// ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' });


/*========= typed js =========*/

const typed = new Typed('.multiple-text', {
    strings: ['System Engineer', 'Developer', 'Web Designer'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});
const typeda = new Typed('.multiple-text-about', {
    strings: ['Proyect.', 'Web Site.'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});



ScrollReveal().reveal('.aparecer');

window.sr = ScrollReveal();
  sr.reveal('.animacion3', {
    duration: 2000,
    origin: 'bottom',
    distance: '100px'
  });