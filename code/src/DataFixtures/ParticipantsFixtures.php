<?php

namespace App\DataFixtures;

use App\Entity\Participants;
use Carbon\Carbon;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ParticipantsFixtures extends Fixture
{
    public $faker;

    // Use fzanioti's FakerBundle to generate fake data
    public function __construct()
    {
        $this->faker = \Faker\Factory::create();
    }

    public function load(ObjectManager $manager): void
    {
        for($i = 0; $i < 100; $i++){
            $isScanned = mt_rand(0, 1) == 1 ? true : false;
            $p = (new Participants())
            ->setNoms($this->faker->name())
            ->setMail($this->faker->email())
            ->setQr($this->faker->uuid())
            ->setIsScanned(
                $isScanned
            )
            ->setScannedAt(
                // Create a datetime between 2020-01-01 and now with faker and convert it to datetimeimmutable with Carbon
                $isScanned ? (Carbon::instance($this->faker->dateTimeBetween('-1 years', 'now')))->toDateTimeImmutable() : null
            )
            ->setAddFields("qwdqwd")
            ;
            $manager->persist($p);
        }

        $manager->flush();
    }
}
