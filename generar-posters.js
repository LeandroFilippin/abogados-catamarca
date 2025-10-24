'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Definición de los tiempos de inicio para la generación de posters.
    const POSTER_TIMES = {
        'videos/1.mp4': 14,
        'videos/2.mp4': 43,
        'videos/3.mp4': 29,
        'videos/4.mp4': 1.5,
        'videos/5.mp4': 20,
        'videos/6.mp4': 27
    };

    const videoCards = document.querySelectorAll('.lf-videos-card');
    const canvas = document.createElement('canvas'); // Crear un canvas que se reutilizará
    const ctx = canvas.getContext('2d');

    /**
     * Genera la imagen de póster para un video en un tiempo específico.
     * @param {HTMLVideoElement} videoElement El elemento <video> principal.
     * @param {number} time El segundo exacto del frame a capturar.
     * @returns {Promise<string>} Una promesa que resuelve con el Data URL del poster.
     */
    function generatePoster(videoElement, time) {
        // ⭐ CLAVE: Lee la fuente de 'data-src' (porque 'src' está vacío por Lazy Load)
        const videoSource = videoElement.getAttribute('data-src');

        return new Promise((resolve) => {
            if (!videoSource) {
                console.warn('No se encontró data-src para generar el póster.');
                return resolve('');
            }

            // Clonar el video para el proceso de captura temporal
            const tempVideo = document.createElement('video');
            tempVideo.src = videoSource; // Asignar la fuente del data-src
            tempVideo.crossOrigin = 'anonymous'; 
            tempVideo.muted = true; // Silenciar por si acaso

            tempVideo.addEventListener('loadeddata', () => {
                // 1. Establecer el tiempo exacto
                tempVideo.currentTime = time;
            });

            tempVideo.addEventListener('seeked', () => {
                // 2. Dibujar el frame en el canvas
                canvas.width = tempVideo.videoWidth;
                canvas.height = tempVideo.videoHeight;
                ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);

                // 3. Obtener la imagen como un Data URL
                const posterUrl = canvas.toDataURL('image/webp', 0.9);
                
                // 4. Limpiar y resolver la promesa
                tempVideo.remove();
                resolve(posterUrl);
            }, { once: true });

            tempVideo.addEventListener('error', () => {
                console.error('Error al cargar el video para el poster:', tempVideo.src);
                tempVideo.remove();
                resolve(''); 
            });

            // Iniciar la carga de metadatos del video temporal
            tempVideo.load();
        });
    }

    // Iterar sobre todas las tarjetas de video
    videoCards.forEach(card => {
        const videoElement = card.querySelector('video');
        const videoPath = card.getAttribute('data-video');
        const posterTime = POSTER_TIMES[videoPath];

        if (videoElement && posterTime !== undefined) {
            
            // Solo si aún no tiene un poster (para evitar regenerar)
            if (!videoElement.getAttribute('poster')) {
                 generatePoster(videoElement, posterTime)
                    .then(posterUrl => {
                        if (posterUrl) {
                            // 5. Aplicar el Data URL generado como el atributo poster
                            videoElement.setAttribute('poster', posterUrl);
                        }
                    });
            }
        }
    });
});