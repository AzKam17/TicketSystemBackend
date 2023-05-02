<?php

namespace App\DataFixtures;

use App\Entity\Participants;
use App\Service\CreateParticipantService;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Uid\Uuid;

class RefletEmployeesFixtures extends Fixture implements FixtureGroupInterface
{

    public function __construct(
        private CreateParticipantService $createParticipantService
    )
    {
    }


    public function load(ObjectManager $manager): void
    {
        $data = [
            /*[
                'nom_prenoms' => 'KANGA Yves Roland',
                'mail' => 'yves.kanga@relfetconsulting.com',
                'additionnalFields' => [
                    'secteur' => [
                        'name' => 'Secteur',
                        'value' => 'Privé',
                    ],
                    'phone' => [
                        'name' => 'Téléphone',
                        'value' => '+2250779688092',
                    ],
                    'gender' => [
                        'name' => 'Genre',
                        'value' =>  'Homme',
                    ],
                    'company' => [
                        'name' => 'Entreprise',
                        'value' => 'Reflet Consulting',
                    ],
                    'fonction' => [
                        'name' => 'Fonction',
                        'value' => 'CM',
                    ],
                ]
            ],*/
            [
                'nom_prenoms' => 'RAYMOND Martial',
                'mail' => 'raymond.martial@relfetconsulting.com',
                'gender' => true,
                'additionnalFields' => [
                    'secteur' => [
                        'name' => 'Secteur',
                        'value' => 'Privé',
                    ],
                    'phone' => [
                        'name' => 'Téléphone',
                        'value' => '0779273592',
                    ],
                    'company' => [
                        'name' => 'Entreprise',
                        'value' => 'Reflet Consulting',
                    ],
                    'fonction' => [
                        'name' => 'Fonction',
                        'value' => 'Graphiste',
                    ],
                ]
            ],
            // KAMAGATE Amadou Aziz
            [
                'nom_prenoms' => 'KAMAGATE Amadou Aziz',
                'mail' => 'azizkamadou17@gmail.com',
                'gender' => true,
                'additionnalFields' => [
                    'secteur' => [
                        'name' => 'Secteur',
                        'value' => 'Privé',
                    ],
                    'phone' => [
                        'name' => 'Téléphone',
                        'value' => '0779273592',
                    ],
                    'company' => [
                        'name' => 'Entreprise',
                        'value' => 'Reflet Consulting',
                    ],
                    'fonction' => [
                        'name' => 'Fonction',
                        'value' => 'Graphiste',
                    ],
                ]
            ],
            /*[
                'nom_prenoms' => 'BROU Fallone',
                'mail' => 'fallone.brou@refletconsulting.com',
                'additionnalFields' => [
                    'secteur' => [
                        'name' => 'Secteur',
                        'value' => 'Privé',
                    ],
                    'phone' => [
                        'name' => 'Téléphone',
                        'value' => '0708348726',
                    ],
                    'gender' => [
                        'name' => 'Genre',
                        'value' =>  'Femme',
                    ],
                    'company' => [
                        'name' => 'Entreprise',
                        'value' => 'Reflet Consulting',
                    ],
                    'fonction' => [
                        'name' => 'Fonction',
                        'value' => 'HOC',
                    ],
                ]
            ],
            [
                'nom_prenoms' => 'KOBRI Henoc',
                'mail' => 'henoc@refletconsulting.com',
                'additionnalFields' => [
                    'secteur' => [
                        'name' => 'Secteur',
                        'value' => 'Privé',
                    ],
                    'phone' => [
                        'name' => 'Téléphone',
                        'value' => '+212658572363',
                    ],
                    'gender' => [
                        'name' => 'Genre',
                        'value' =>  'Homme',
                    ],
                    'company' => [
                        'name' => 'Entreprise',
                        'value' => 'Reflet Consulting',
                    ],
                    'fonction' => [
                        'name' => 'Fonction',
                        'value' => 'DA',
                    ],
                ]
            ],
            [
                'nom_prenoms' => 'OUATTARA Emmanuelle',
                'mail' => 'emmanuelle.ouattara@refletconsulting.com',
                'additionnalFields' => [
                    'secteur' => [
                        'name' => 'Secteur',
                        'value' => 'Privé',
                    ],
                    'phone' => [
                        'name' => 'Téléphone',
                        'value' => '+212658572363',
                    ],
                    'gender' => [
                        'name' => 'Genre',
                        'value' =>  'Femme',
                    ],
                    'company' => [
                        'name' => 'Entreprise',
                        'value' => 'Reflet Consulting',
                    ],
                    'fonction' => [
                        'name' => 'Fonction',
                        'value' => 'PM',
                    ],
                ]
            ],
            [
                'nom_prenoms' => 'COULIBALY Gerard',
                'mail' => 'gerard.coulibaly@relfetconsulting.com',
                'additionnalFields' => [
                    'secteur' => [
                        'name' => 'Secteur',
                        'value' => 'Privé',
                    ],
                    'phone' => [
                        'name' => 'Téléphone',
                        'value' => '+212658572363',
                    ],
                    'gender' => [
                        'name' => 'Genre',
                        'value' =>  'Homme',
                    ],
                    'company' => [
                        'name' => 'Entreprise',
                        'value' => 'Reflet Consulting',
                    ],
                    'fonction' => [
                        'name' => 'Fonction',
                        'value' => 'PM',
                    ],
                ]
            ],
            [
                'nom_prenoms' => 'DIARA Gueye',
                'mail' => 'mame.gueye@relfetconsulting.com',
                'additionnalFields' => [
                    'secteur' => [
                        'name' => 'Secteur',
                        'value' => 'Privé',
                    ],
                    'phone' => [
                        'name' => 'Téléphone',
                        'value' => '+212658572363',
                    ],
                    'gender' => [
                        'name' => 'Genre',
                        'value' =>  'Femme',
                    ],
                    'company' => [
                        'name' => 'Entreprise',
                        'value' => 'Reflet Consulting',
                    ],
                    'fonction' => [
                        'name' => 'Fonction',
                        'value' => 'PM',
                    ],
                ]
            ],
            [
                'nom_prenoms' => 'BAMBA Madognan',
                'mail' => 'madognan.bamba@relfetconsulting.com',
                'additionnalFields' => [
                    'secteur' => [
                        'name' => 'Secteur',
                        'value' => 'Privé',
                    ],
                    'phone' => [
                        'name' => 'Téléphone',
                        'value' => '+212658572363',
                    ],
                    'gender' => [
                        'name' => 'Genre',
                        'value' =>  'Femme',
                    ],
                    'company' => [
                        'name' => 'Entreprise',
                        'value' => 'Reflet Consulting',
                    ],
                    'fonction' => [
                        'name' => 'Fonction',
                        'value' => 'APM',
                    ],
                ]
            ]*/
        ];

        foreach ($data as $p){
            $participant = ($this->createParticipantService)($p);

            $manager->persist($participant);
        }

        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['rc-fixtures'];
    }
}
