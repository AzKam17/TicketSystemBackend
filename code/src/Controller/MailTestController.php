<?php

namespace App\Controller;

use App\Entity\Participants;
use App\Service\GetQRService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MailTestController extends AbstractController
{
    #[Route('/mail/test', name: 'app_mail_test')]
    public function index(
        GetQRService $getQRService
    ): Response
    {
        // True for morning, false for afternoon
        $time = false;
        return $this->render('mails/new_qr_mail.html.twig',[
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/MailTestController.php',
            'name' => 'John Doe',
            'time' => $time,
            'qr_image' => ($getQRService)(
                (new Participants())->setQr('fwefweflkfbweljbfweljbfwejfbweflbwflwkefbwlekfbw')
            )->getDataUri()
        ]);
    }
}
