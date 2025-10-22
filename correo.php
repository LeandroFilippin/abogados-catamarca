<?php

header('Content-Type: application/json');

// Verificar que los datos fueron enviados correctamente
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Obtener datos del formulario y limpiarlos
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $lastname = isset($_POST['lastname']) ? trim($_POST['lastname']) : '';
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Validar que los campos no estén vacíos
    if (empty($name) || empty($lastname) || empty($email) || empty($message)) {
        echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios."]);
        exit();
    }

    // Validar formato de correo
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Correo electrónico no válido."]);
        exit();
    }

    // Configuración del destinatario y asunto
    $recipient = "diazmartinez.juridico@gmail.com"; 
    $subject = "Nuevo mensaje del formulario de contacto web";

    // Formato HTML del mensaje
    $formcontent = "
    <html>
        <head>
            <title>Nuevo mensaje de contacto</title>
            <style>
            body { font-family: Arial, sans-serif; }
                a{
                    color: #459ea6;
                    text-decoration: none;
                }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px; background-color: #f4f4f464; 
                    border-radius: 5px; }
                h2 { color: #045c68;
                text-align: center; }
                p { font-size: 20px; color: #555; }
                p > strong{
                    color: #056f7d;
                    font-size: 1.1rem;
                    font-weight: 600;
                }
                .footer { margin-top: 20px; font-size: 18px; color: #777; }
            </style>
        </head>
        <body>
            <div class='container'>
                <h2>Nuevo mensaje de contacto</h2>
                <p><strong>Nombre: </strong> $name $lastname</p>
                <p><strong>Email: </strong> $email</p>
                <p><strong>Mensaje: </strong></p>
                <p>$message</p>
                <div class='footer'>Este mensaje fue enviado desde el formulario de contacto de tu sitio web.<a href='https://abogadosdma.com' target='_blank'>Abogadosdma.com</a></div>
            </div>
        </body>
    </html>";

    // Cabeceras para envío del correo
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    // Enviar correo
    if (mail($recipient, $subject, $formcontent, $headers)) {
        echo json_encode(["status" => "success", "message" => "Correo enviado exitosamente."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al enviar el correo. Inténtalo nuevamente más tarde."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Acceso no permitido."]);
}

?>