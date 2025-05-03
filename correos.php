<?php
    $destinatario = 'ignas.manuel@hotmail.com';
     //correo a quien se enviara el formulario
    $nombres = $_POST['nombres'];
    $email = $_POST['email'];
    $telefono = $_POST['telefono'];
    $cuentanos = $_POST['cuentanos'];

    $header = "Enviado desde Portfolio MC";
    $mensajeCompleto = $mensaje .  "\n Atentamente: " . $nombres . "\n Telefono: " . $telefono;

    mail($destinatario, $mensajeCompleto, $header);
    echo"<script> alert('Correo enviado exitosamente')</script>";
    echo "<script> setTimeout(\"location.href='index.html'\",1000) </script>";

?>