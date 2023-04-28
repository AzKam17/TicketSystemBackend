<?php

namespace App\Entity;

use Andante\TimestampableBundle\Timestampable\CreatedAtTimestampableInterface;
use Andante\TimestampableBundle\Timestampable\CreatedAtTimestampableTrait;
use Andante\TimestampableBundle\Timestampable\TimestampableInterface;
use App\Repository\ParticipantsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ParticipantsRepository::class)]
class Participants implements CreatedAtTimestampableInterface
{
    use CreatedAtTimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $qr = null;

    #[ORM\Column(length: 255)]
    private ?string $noms = null;

    #[ORM\Column(length: 255)]
    private ?string $mail = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $addFields = null;

    #[ORM\Column]
    private ?bool $isScanned = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $scannedAt = null;

    #[ORM\Column]
    private ?bool $isMailSended = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQr(): ?string
    {
        return $this->qr;
    }

    public function setQr(string $qr): self
    {
        $this->qr = $qr;

        return $this;
    }

    public function getNoms(): ?string
    {
        return $this->noms;
    }

    public function setNoms(string $noms): self
    {
        $this->noms = $noms;

        return $this;
    }

    public function getMail(): ?string
    {
        return $this->mail;
    }

    public function setMail(string $mail): self
    {
        $this->mail = $mail;

        return $this;
    }

    public function getAddFields(): ?string
    {
        return $this->addFields;
    }

    public function setAddFields(?string $addFields): self
    {
        $this->addFields = $addFields;

        return $this;
    }

    public function isIsScanned(): ?bool
    {
        return $this->isScanned;
    }

    public function setIsScanned(bool $isScanned): self
    {
        $this->isScanned = $isScanned;

        return $this;
    }

    public function getScannedAt(): ?\DateTimeImmutable
    {
        return $this->scannedAt;
    }

    public function setScannedAt(?\DateTimeImmutable $scannedAt): self
    {
        $this->scannedAt = $scannedAt;

        return $this;
    }

    public function isIsMailSended(): ?bool
    {
        return $this->isMailSended;
    }

    public function setIsMailSended(bool $isMailSended): self
    {
        $this->isMailSended = $isMailSended;

        return $this;
    }
}
