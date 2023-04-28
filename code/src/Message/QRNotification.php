<?php

namespace App\Message;

use App\Entity\Participants;

class QRNotification
{
    private $participant;

    public function __construct(
        $participant
    )
    {
        $this->participant = $participant;
    }

    public function getParticipant()
    {
        return $this->participant;
    }
}