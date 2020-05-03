<?php

//Message
$message = "New buy";

//Sent mail 
$mail = mail('medynska.maryna@gmail.com', 'MyGoogle Shop, $message');
if ($mail) {
    echo 'yes';
} else {
    echo 'no';
}

?>