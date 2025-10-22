document.getElementById("sendEmail").addEventListener("click", function() {
    const destinatario = "diazmartinez.juridico@gmail.com";
    const asunto = encodeURIComponent("Consulta desde la web");
    const cuerpo = encodeURIComponent("");

    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${destinatario}&su=${asunto}&body=${cuerpo}`, '_blank');
});


document.getElementById("sendEmail2").addEventListener("click", function() {
    const destinatario = "diazmartinez.juridico@gmail.com";
    const asunto = encodeURIComponent("Consulta desde la web");
    const cuerpo = encodeURIComponent("");

    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${destinatario}&su=${asunto}&body=${cuerpo}`, '_blank');
});


// Función para validar el reCAPTCHA
function validarRecaptcha() {
    if (typeof grecaptcha === "undefined") {
        alert("Error: El reCAPTCHA no se ha cargado correctamente.");
        return false;
    }

    const response = grecaptcha.getResponse();
    if (response.length === 0) {
        alert("Por favor, completa el reCAPTCHA antes de enviar el formulario.");
        return false;
    }

    return true; // Permite enviar el formulario si el reCAPTCHA está completo
}

// Evento de envío del formulario
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío automático del formulario

    // 🔹 Validar el reCAPTCHA antes de enviar
    if (!validarRecaptcha()) {
        return; // Detiene la ejecución si el reCAPTCHA no está validado
    }

    const formData = new FormData(this);
    const responseMessageDiv = document.getElementById('responseMessage');

    // Muestra mensaje de "Enviando..."
    responseMessageDiv.style.display = 'block';
    responseMessageDiv.style.color = '#000';
    responseMessageDiv.innerHTML = 'Enviando Mensaje . . .';

    // Enviar datos con fetch
    fetch('correo.php', { 
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            responseMessageDiv.style.color = '#25d366'; // Verde
            responseMessageDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + data.message;
            document.getElementById('contactForm').reset(); // Limpia el formulario
            grecaptcha.reset(); // 🔹 Resetea el reCAPTCHA después del envío
        } else {
            responseMessageDiv.style.color = 'red';
            responseMessageDiv.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ' + data.message;
        }
    })
    .catch(error => {
        responseMessageDiv.style.color = '#f65b55'; // Rojo
        responseMessageDiv.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error al enviar el mensaje. Inténtalo nuevamente.';
    });
});
