'use strict';

// =====================================================================
// === OPTIMIZACIONES DE CARGA (Para mejorar el performance inicial) ===
// =====================================================================

// Inicializa los observadores para la carga diferida (lazy loading)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Carga diferida de Videos (para que no carguen todos al inicio)
    // El atributo 'preload="none"' en el HTML ya ayuda, pero esta lógica es más explícita
    const videoCards = document.querySelectorAll(".lf-videos-card");
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target.querySelector('video');
                // Se asegura de que el navegador solo cargue el poster e info metadata, no el video completo
                if (video) {
                    video.removeAttribute('autoplay');
                    video.removeAttribute('muted');
                    video.removeAttribute('loop');
                    video.setAttribute('preload', 'metadata');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -50px 0px" }); // Empieza a precargar un poco antes de que sea visible

    videoCards.forEach(card => {
        videoObserver.observe(card);
    });
});

//preview de videos al pasar el mouse
document.addEventListener('DOMContentLoaded', () => {
    // Definición de los tiempos de inicio para la generación de posters.
    // Asumo que tienes el script de generar-posters.js ejecutándose antes.
    const VIDEO_START_TIMES = {
        'videos/1.mp4': 16,
        'videos/2.mp4': 5.5,
        'videos/3.mp4': 8,
        'videos/4.mp4': 1,
        'videos/5.mp4': 4,
        'videos/6.mp4': 6
    };

    const videoCards = document.querySelectorAll('.lf-videos-card');

    videoCards.forEach(card => {
        const videoElement = card.querySelector('video');

        if (videoElement) {
            const videoPath = card.getAttribute('data-video');
            const startTime = VIDEO_START_TIMES[videoPath] || 0;
            
            // ===================================
            // Lógica para Mouse (Dispositivos de Escritorio)
            // ===================================

            card.addEventListener('mouseenter', () => {
                // Si el video está cargado o tiene una fuente, intenta reproducir
                if (videoElement.muted) {
                    
                    // Asegura que el video se cargue y se posicione antes de reproducir
                    // Esto es útil si en mouseleave usamos videoElement.load()
                    videoElement.load();

                    videoElement.currentTime = startTime; 
                    
                    videoElement.play().catch(error => {
                        console.error("Fallo al intentar reproducir el video:", error);
                        // Mensaje de debugging: si falla aquí, es por restricción del navegador.
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                videoElement.pause();
                
                // Opción 1 (Más limpia): Simplemente posiciona el video a 0 y carga.
                // Esto forzará al navegador a mostrar el POSTER.
                videoElement.currentTime = 0; 
                videoElement.load(); 
                
                // NOTA: Si esta opción no muestra el poster generado,
                // vuelve a la lógica de la respuesta anterior, pero solo si no puedes usar la Opción 2.
            });

            // ===================================
            // Lógica para Táctil (Dispositivos Móviles)
            // ===================================
            
            // La lógica touch en móviles no debería intentar un "preview"
            // ya que un 'touchstart' generalmente debe conducir a una reproducción completa.
            // Si la dejas, usa la misma lógica que mouseenter/mouseleave:
            
            card.addEventListener('touchstart', (e) => {
                e.preventDefault(); 
                
                if (videoElement.muted) {
                    videoElement.load(); // Vuelve a cargar antes de tocar
                    videoElement.currentTime = startTime;
                    
                    videoElement.play().catch(error => {
                        console.error("Fallo al intentar reproducir el video en touch:", error);
                    });
                }
            }, {passive: false}); // Usar {passive: false} para permitir preventDefault

            // Es crucial añadir un evento para detener en móvil,
            // ya que no hay 'mouseleave'. Puedes usar 'touchend' si es un preview rápido.
            card.addEventListener('touchend', () => {
                videoElement.pause();
                videoElement.currentTime = 0;
                videoElement.load();
            });
        }
    });
});

// =====================================================================
// === CÓDIGO DE NAVEGACIÓN Y SCROLL ===
// =====================================================================

// Selección de elementos
const menuToggleBtn = document.querySelector('[data-navbar-toggle-btn]');
const navbar = document.querySelector('[data-navbar]');
// Nota: 'ion-icon' no está incluido en tu HTML, asumo que es una clase/etiqueta que sí existe.
const menuIcon = menuToggleBtn.querySelector('i'); // Usando <i> para Font Awesome
const navLinks = document.querySelectorAll('.nav-link'); // Todos los enlaces del menú

// Función para alternar el menú y cambiar el ícono
const toggleMenu = function() {
    navbar.classList.toggle("active");
    menuToggleBtn.classList.toggle("active"); // Añade/quita la clase activa

    const isOpen = navbar.classList.contains("active");
    // Modificación para usar Font Awesome (fa-bars y fa-times/fa-xmark)
    const icon = menuToggleBtn.querySelector('i');
    if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen); // O 'fa-times' si prefieres
    }
};

// Evento para abrir/cerrar menú al hacer clic en el botón
menuToggleBtn.addEventListener("click", toggleMenu);

// Cerrar menú si se hace clic fuera de él
document.addEventListener("click", function(event) {
    const isClickInside = navbar.contains(event.target) || menuToggleBtn.contains(event.target);

    if (!isClickInside) {
        closeMenu();
    }
});

// Cerrar menú al hacer clic en cualquier enlace del menú
navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
});

// Función para cerrar el menú y resetear el ícono
function closeMenu() {
    navbar.classList.remove("active");
    menuToggleBtn.classList.remove("active"); // Remueve la clase activa del botón
    // Asegura que el ícono vuelva a "menu" (fa-bars)
    const icon = menuToggleBtn.querySelector('i');
    if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
}

// --- Código de desplazamiento (Header y Go-Top) ---
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
// === CÓDIGO DE CARRUSELES (SWIPER) - Optimizado para solo móvil/tablet ===
// =====================================================================

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

// Inicializar ambos carruseles
initServicioSwiper();
initPrincipiosSwiper();


// =====================================================================
// === CÓDIGO DE FORMULARIO Y WHATSAPP ===
// =====================================================================

//datos del formulario - Botón de WhatsApp
document.getElementById('btn-wsp').addEventListener('click', function (event) {
    // Evita que el formulario se envíe por defecto (útil si es un botón de tipo submit)
    event.preventDefault();

    // Obtén los valores de los campos del formulario
    const name = document.getElementById('name').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    // Número de WhatsApp del destinatario
    const whatsappNumber = "5493834402914"; // ¡Importante! Sin el '+'

    // Genera el mensaje de WhatsApp
    const whatsappMessage = `Hola, mi nombre es ${name} ${lastname}.%0AEmail: ${email}.%0AMensaje: ${message}.`; // %0A es salto de línea

    // Crea el enlace de WhatsApp
    const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`;

    // Abre WhatsApp con el mensaje
    window.open(whatsappLink, '_blank'); // Abre en una nueva pestaña
});


// =====================================================================
// === CÓDIGO DE MODAL DE VIDEOS - Reproducir solo al hacer clic ===
// =====================================================================

const lfVideosModal = document.getElementById("lfVideosModal");
const lfVideosModalVideo = document.getElementById("lfVideosModalVideo");
const lfVideosClose = document.getElementById("lfVideosClose");

document.querySelectorAll(".lf-videos-card").forEach(card => {
    card.addEventListener("click", () => {
        const videoSrc = card.getAttribute("data-video");
        
        // 1. Cargamos y preparamos el video
        lfVideosModalVideo.src = videoSrc;
        lfVideosModal.classList.add("lf-videos-active");
        
        // 2. Quitamos el 'preload="metadata"' para cargar el video completo en el modal
        lfVideosModalVideo.setAttribute('preload', 'auto'); 
        
        // 3. Reproducimos el video
        lfVideosModalVideo.play();
    });
});

// Cierra el modal al hacer clic en el botón de cerrar
lfVideosClose.addEventListener("click", () => {
    closeVideoModal();
});

// Cierra el modal al hacer clic fuera del video
lfVideosModal.addEventListener("click", e => {
    if (e.target === lfVideosModal) {
        closeVideoModal();
    }
});

function closeVideoModal() {
    lfVideosModal.classList.remove("lf-videos-active");
    // Detiene la reproducción y libera la fuente para ahorrar recursos
    lfVideosModalVideo.pause();
    lfVideosModalVideo.currentTime = 0; // Opcional: regresa al inicio
    lfVideosModalVideo.src = "";
    lfVideosModalVideo.load(); // Fuerza al navegador a liberar el recurso de video
}