document.addEventListener('DOMContentLoaded', () => {
    // Definición de los tiempos de inicio para la generación de posters.
    const POSTER_TIMES = {
        'videos/1.mp4': 16,
        'videos/2.mp4': 5.5,
        'videos/3.mp4': 8,
        'videos/4.mp4': 1,
        'videos/5.mp4': 4,
        'videos/6.mp4': 6
    };

    const videoCards = document.querySelectorAll('.lf-videos-card');
    const canvas = document.createElement('canvas'); // Crear un canvas que se reutilizará
    const ctx = canvas.getContext('2d');

    /**
     * Genera la imagen de póster para un video en un tiempo específico.
     * @param {HTMLVideoElement} videoElement El elemento <video>.
     * @param {number} time El segundo exacto del frame a capturar.
     * @returns {Promise<string>} Una promesa que resuelve con el Data URL del poster.
     */
    function generatePoster(videoElement, time) {
        return new Promise((resolve) => {
            // Clonar el video para el proceso de captura y evitar interferir con el original
            const tempVideo = videoElement.cloneNode(true);
            tempVideo.src = videoElement.src;
            tempVideo.crossOrigin = 'anonymous'; // Necesario si los videos están en otro dominio

            tempVideo.addEventListener('loadeddata', () => {
                // 1. Establecer el tiempo exacto para capturar el frame
                tempVideo.currentTime = time;
            });

            tempVideo.addEventListener('seeked', () => {
                // 2. Dibujar el frame en el canvas
                canvas.width = tempVideo.videoWidth;
                canvas.height = tempVideo.videoHeight;
                ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);

                // 3. Obtener la imagen como un Data URL (JPEG por defecto)
                const posterUrl = canvas.toDataURL('image/webp', 0.9);
                
                // 4. Limpiar y resolver la promesa
                tempVideo.remove();
                resolve(posterUrl);
            }, { once: true });

            // Manejar errores de carga
            tempVideo.addEventListener('error', () => {
                console.error('Error al cargar el video para el poster:', tempVideo.src);
                resolve(''); // Resolver con cadena vacía si falla
            });

            // Iniciar la carga de metadatos si no ha ocurrido (aunque `preload="metadata"` ayuda)
            tempVideo.load();
        });
    }

    // Iterar sobre todas las tarjetas de video
    videoCards.forEach(card => {
        const videoElement = card.querySelector('video');
        const videoPath = card.getAttribute('data-video');
        const posterTime = POSTER_TIMES[videoPath];

        if (videoElement && posterTime !== undefined) {
            // Ocultar el video temporalmente (si es necesario) hasta que se aplique el poster
            // (Esto es opcional, tu CSS actual ya puede manejar la visibilidad)
            
            generatePoster(videoElement, posterTime)
                .then(posterUrl => {
                    if (posterUrl) {
                        // 5. Aplicar el Data URL generado como el atributo poster
                        videoElement.setAttribute('poster', posterUrl);
                    }
                });
        }
    });
});