<?php 
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once 'contect/PHPmailer/Exception.php';
require_once 'contect/PHPmailer/PHPMailer.php';
require_once 'contect/PHPmailer/SMTP.php';


$mail = new PHPMailer(true);

if(isset($_POST['submit'])){

    $name = $_POST['name'];
    $email = $_POST['email'];
    $mobile = $_POST['mobile'];
    $intrest = $_POST['intrest'];
    echo $name;
    try{
        $mail->isSMTP();
        $mail->Host = 'stmp.gmail.com';
        $mail-> SMTPAuth = true;
        $mail->Username = 'infoaryagroups.private@gmail.com';
        $mail->Password = 'ary@!nfo2021';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = '587';

        $mail->setFrom('infoaryagroups.private@gmail.com');
        $mail->addAddress('jasja0011@gmail.com');

        $mail->isHTML(true);
        $mail->Subject = '';
        $mail->Body = "<h3>Name : $name <br> Email id: $email <br>Mobile : $mobile<br> Intrested In : $intrest</h3>";
        
        $mail->send();
        echo "<script>alert('mail sent') </script>";

    }
    catch (Exception $e){
            echo $e->getMessage();
    }
}



?>