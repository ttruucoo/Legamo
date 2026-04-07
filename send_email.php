<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = strip_tags(trim($_POST["nombre"]));
    $correo = strip_tags(trim($_POST["correo"]));
    $mensaje = strip_tags(trim($_POST["mensaje"]));

    $to = "legamo@proyectoenjambre.cl";
    $subject = "Mensaje desde el sitio web de Légamo";
    $body = "Nombre: $nombre\nCorreo: $correo\n\nMensaje:\n$mensaje";
    $headers = "From: no-reply@proyectoenjambre.cl\r\n";
    $headers .= "Reply-To: $to\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "Gracias, nos comunicaremos contigo pronto.";
    } else {
        echo "Hubo un problema al enviar el mensaje.";
    }
} else {
    echo "Acceso no autorizado.";
}
?>