<?php

namespace App\MessageHandler;

use App\Entity\Participants;
use App\Message\QRNotification;
use App\Repository\ParticipantsRepository;
use App\Service\GetQRService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Part\DataPart;

#[AsMessageHandler]
class QRNotificationHandler
{

    public function __construct(
        private EntityManagerInterface $entityManager,
        private ParticipantsRepository $participantsRepository,
        private MailerInterface $mailer,
        private GetQRService $getQRService
    )
    {
    }

    public function __invoke(QRNotification $notification)
    {
        try {
            // Add delay 500 ms
            sleep(0.5);
            // Get the participant from the notification
            $participant = $notification->getParticipant();
            // fetch the participant from the database
            $participant = $this->participantsRepository->find($participant);
            // send the mail
            $mail = (new TemplatedEmail())
                ->from(
                    new Address('crp@bloomfield-investment.com', 'Bloomfield Investment Corporation')
                )
                ->to($participant->getMail())
                ->subject('LES CONFÉRENCES RISQUE PAYS BLOOMFIELD | Votre invitation')
                ->htmlTemplate('mails/new_qr_mail.html.twig')
                // generate the QR code and attach it to the mail
                ->attachPart(
                    (new DataPart(
                        (($this->getQRService)($participant))->getString(),
                        'qr_code',
                        'image/png'
                    ))->asInline()
                )->attachPart(
                    (new DataPart(
                        // dsfds.png in images in public folder
                        (fopen(__DIR__ . '/../../public/images/dsfds.png', 'r')),
                        'banner',
                        'image/png'
                    ))->asInline()
                )
                ->context([
                    'name' => $participant->getPrenoms() . ' ' . $participant->getNom(),
                    'qrCode' => $this->getQRService->getContent($participant),
                    'time' => Participants::horaireLib[$participant->getHoraire()],
                ])
            ;
            $this->mailer->send($mail);
            // set the participant as notified
            $participant->setIsMailSended(true);
            // save the participant
            $this->entityManager->persist($participant);
            $this->entityManager->flush();
            dump('Participant notified' . $participant->getId());
        } catch (\Exception $e) {
            // dump the exception
            dump($e);
        }
    }
}