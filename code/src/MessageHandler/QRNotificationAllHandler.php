<?php

namespace App\MessageHandler;

use App\Message\QRNotification;
use App\Message\QRNotificationAll;
use App\Repository\ParticipantsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsMessageHandler]
class QRNotificationAllHandler
{
    private $bus;
    private $participantsRepository;

    public function __construct(
        MessageBusInterface $bus,
        ParticipantsRepository $participantsRepository,
    )
    {
        $this->bus = $bus;
        $this->participantsRepository = $participantsRepository;
    }

    public function __invoke(QRNotificationAll $notification)
    {
        dump('Start notifying all participants');
        // Fetch ID of all participants that are not notified
        $participants = $this->participantsRepository->findBy(['isMailSended' => false]);
        // Loop through all participants
        foreach ($participants as $participant) {
            // Dispatch a QRNotification message for each participant
            $this->bus->dispatch(
                (new QRNotification($participant->getId()))
            );
        }
        dump('All participants notified');
    }
}