<?php

namespace App\DataFixtures;

use App\Entity\Participants;
use App\Service\CreateParticipantService;
use Carbon\Carbon;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ParticipantsFixtures extends Fixture
{
    public $faker;

    // Use fzanioti's FakerBundle to generate fake data
    public function __construct(
        private CreateParticipantService $createParticipantService
    )
    {
        $this->faker = \Faker\Factory::create('en_US');
    }

    public function load(ObjectManager $manager): void
    {
        for($i = 0; $i < 100; $i++){
            $p = $this->createParticipantService->__invoke($this->generateData());
            ;
            $manager->persist($p);
        }

        $manager->flush();
    }


    public function generateData() {
        return [
            'nom_prenoms' => $this->faker->name,
            'mail' => $this->faker->email,
            'gender' => $this->faker->randomElement([true, false]),
            'additionnalFields' => [
                'secteur' => [
                    'name' => 'Secteur',
                    'value' => $this->faker->randomElement(['Privé', 'Public']),
                ],
                'phone' => [
                    'name' => 'Téléphone',
                    'value' => $this->faker->phoneNumber,
                ],
                'company' => [
                    'name' => 'Entreprise',
                    'value' => $this->faker->company,
                ],
                'fonction' => [
                    'name' => 'Fonction',
                    'value' => $this->faker->word,
                ],
            ]
        ];
    }
}
