<?php

namespace App\Service;

use App\Entity\Participants;
use Symfony\Component\Uid\Uuid;

class CreateParticipantService
{
    public function __invoke(array $data) : Participants
    {
        return (new Participants())
            ->setNom($data['nom'])
            ->setPrenoms($data['prenoms'])
            ->setMail($data['mail'])
            ->setTelephone($data['telephone'])
            ->setGender($data['gender'])
            ->setFonction($data['fonction'])
            ->setEntreprise($data['entreprise'])
            ->setSecteur($data['secteur'])
            ->setHoraire($data['horaire'] ?? 'morning')
            ->setQr(Uuid::v4())
        ;
    }
}