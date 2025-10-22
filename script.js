'use strict';

// =====================================================================
// === LÓGICA DE VIDEOS: LAZY LOAD, PREVIEW (HOVER) Y MODAL (CLICK) ===
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {
    const videoCards = document.querySelectorAll(".lf-videos-card");
    const modal = document.getElementById("lfVideosModal");
    const modalVideo = document.getElementById("lfVideosModalVideo");
    const closeModalBtn = document.getElementById("lfVideosClose");

    // Tiempos para el preview (hover) y generación de posters
    const VIDEO_START_TIMES = {
        'videos/1.mp4': 16,
        'videos/2.mp4': 5.5,
        'videos/3.mp4': 8,
        'videos/4.mp4': 1,
        'videos/5.mp4': 4,
        'videos/6.mp4': 6
    };

    // --- 1. Lazy Load (Carga la fuente real cuando está cerca) ---
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target.querySelector('video');
                
                if (video) {
                    const videoSrc = video.getAttribute('data-src');
                    
                    if (videoSrc && !video.src) { // Cargar solo si aún no tiene src
                        video.src = videoSrc;
                        video.load(); 
                        video.setAttribute('preload', 'metadata');
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { 
        rootMargin: "0px 0px 50px 0px" // Empieza a cargar 50px antes
    }); 

    videoCards.forEach(card => {
        lazyLoadObserver.observe(card);
    });

    // --- 2. Preview (Hover/Mouse) ---
    videoCards.forEach(card => {
        const videoElement = card.querySelector('video');
        const videoPath = card.getAttribute('data-video');
        const startTime = VIDEO_START_TIMES[videoPath] || 0;
        
        const startPreview = () => {
             // Solo si el video ya tiene SRC asignado por el Lazy Load
            if (videoElement.src && videoElement.muted) { 
                videoElement.currentTime = startTime; 
                // Asegura el loop y muted que se necesitan para el preview
                videoElement.muted = true;
                videoElement.loop = true;
                videoElement.play().catch(error => {
                    console.warn("Fallo al intentar reproducir el video (Preview):", error);
                });
            }
        };

        const stopPreview = () => {
            if (videoElement.src) {
                videoElement.pause();
                videoElement.currentTime = 0; 
                videoElement.load(); // Vuelve a cargar para mostrar el póster
            }
        };

        // Eventos de Desktop
        card.addEventListener('mouseenter', startPreview);
        card.addEventListener('mouseleave', stopPreview);

        // Eventos de Mobile (Previenen un preview no deseado durante el scroll/toque)
        // La lógica de reproducción debe estar en el evento 'click' o 'tap'.
        card.addEventListener('touchstart', (e) => {
             // Detener el preview si el usuario solo está tocando/deslizando
             stopPreview(); 
        }, { passive: true });
    });


    // --- 3. Modal (Click/Tap - SOLUCIÓN MÓVIL) ---
    
    function closeVideoModal() {
        modal.classList.remove("lf-videos-active");
        document.body.style.overflow = 'auto'; // Habilita el scroll
        // Detiene la reproducción y libera la fuente
        modalVideo.pause();
        modalVideo.currentTime = 0; 
        modalVideo.src = "";
        modalVideo.load(); 
    }

    // Evento CLICK en las tarjetas (Funciona para mouse y tap en móvil)
    videoCards.forEach(card => {
        card.addEventListener("click", (event) => {
            // Detiene el evento si el click fue en un elemento interactivo interno si lo hubiera
            if (event.target.closest('a')) return; 

            const videoSrc = card.getAttribute("data-video");
            
            // 1. Oculta el scroll principal
            document.body.style.overflow = 'hidden'; 
            
            // 2. Carga y abre el modal
            modalVideo.src = videoSrc;
            modal.classList.add("lf-videos-active");
            
            // 3. Intenta la reproducción (los navegadores pueden requerir un segundo tap del usuario)
            modalVideo.play().catch(error => {
                console.warn("Fallo la reproducción automática en el modal. El usuario debe presionar Play. Error:", error);
            });
            
            // 4. Pausa cualquier preview activo
            videoCards.forEach(vCard => {
                vCard.querySelector('video').pause();
            });
        });
    });

    // Eventos para cerrar el modal
    closeModalBtn.addEventListener("click", closeVideoModal);

    modal.addEventListener("click", e => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('lf-videos-active')) {
            closeVideoModal();
        }
    });
});


// =====================================================================
// === CÓDIGO DE NAVEGACIÓN Y SCROLL === (Sin cambios)
// =====================================================================

// ... (TU CÓDIGO DE NAVEGACIÓN Y SCROLL VA AQUÍ) ...

const menuToggleBtn = document.querySelector('[data-navbar-toggle-btn]');
const navbar = document.querySelector('[data-navbar]');
const navLinks = document.querySelectorAll('.nav-link'); 

const toggleMenu = function() {
    navbar.classList.toggle("active");
    menuToggleBtn.classList.toggle("active");

    const isOpen = navbar.classList.contains("active");
    const icon = menuToggleBtn.querySelector('i');
    if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen); 
    }
};

menuToggleBtn.addEventListener("click", toggleMenu);

document.addEventListener("click", function(event) {
    const isClickInside = navbar.contains(event.target) || menuToggleBtn.contains(event.target);
    if (!isClickInside) {
        closeMenu();
    }
});

navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
});

function closeMenu() {
    navbar.classList.remove("active");
    menuToggleBtn.classList.remove("active"); 
    const icon = menuToggleBtn.querySelector('i');
    if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
}

const goTopThreshold = 800; 
const headerThreshold = 50; 
const goTopButton = document.querySelector('[data-go-top]');
const headerContainer = document.querySelector('.container-header');
const logo = document.querySelector('.logo');

window.addEventListener('scroll', () => {
    if (window.scrollY >= goTopThreshold) {
        goTopButton.classList.add('active');
    } else {
        goTopButton.classList.remove('active');
    }

    if (window.scrollY >= headerThreshold) {
        headerContainer.classList.add('scrolled');
        logo.classList.add('small-logo'); 
    } else {
        headerContainer.classList.remove('scrolled');
        logo.classList.remove('small-logo');
    }
});


// =====================================================================
// === CÓDIGO DE CARRUSELES (SWIPER) === (Sin cambios)
// =====================================================================

// ... (TU CÓDIGO DE INICIALIZACIÓN DE SWIPER VA AQUÍ) ...

function initServicioSwiper() {
    let swiperServicio;
    function updateSwiper() {
        if (window.innerWidth >= 1024) {
            if (swiperServicio) {
                swiperServicio.destroy(true, true);
                swiperServicio = null;
            }
        } else {
            if (!swiperServicio) {
                swiperServicio = new Swiper('.servicio-contenedor', {
                    loop: true,
                    speed: 700,
                    spaceBetween: 30,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                        dynamicBullets: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }
                });
            }
        }
    }

    updateSwiper();
    window.addEventListener('resize', updateSwiper);
}

function initPrincipiosSwiper() {
    let swiperPrincipios;
    function updateSwiper() {
        if (window.innerWidth >= 1024) {
            if (swiperPrincipios) {
                swiperPrincipios.destroy(true, true);
                swiperPrincipios = null;
            }
        } else {
            if (!swiperPrincipios) {
                swiperPrincipios = new Swiper('.principios-contenedor', {
                    loop: true,
                    speed: 700,
                    spaceBetween: 30,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                        dynamicBullets: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }
                });
            }
        }
    }

    updateSwiper();
    window.addEventListener('resize', updateSwiper);
}

initServicioSwiper();
initPrincipiosSwiper();


// =====================================================================
// === CÓDIGO DE FORMULARIO Y WHATSAPP === (Sin cambios)
// =====================================================================

// ... (TU CÓDIGO DE WHATSAPP VA AQUÍ) ...

document.getElementById('btn-wsp').addEventListener('click', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const whatsappNumber = "5493834402914"; 

    const whatsappMessage = `Hola, mi nombre es ${name} ${lastname}.%0AEmail: ${email}.%0AMensaje: ${message}.`; 
    const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`;

    window.open(whatsappLink, '_blank'); 
});

// Nota: El bloque anterior de "CÓDIGO DE MODAL DE VIDEOS" fue eliminado 
// y su lógica se integró en la sección de videos principal.