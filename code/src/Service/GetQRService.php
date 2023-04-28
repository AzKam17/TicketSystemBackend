<?php

namespace App\Service;

use App\Entity\Participants;
use Endroid\QrCode\Builder\BuilderInterface;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelHigh;

class GetQRService
{
    public function __construct(
        private BuilderInterface $qrCodeBuilder
    )
    {
    }

    public function __invoke(Participants $participant): \Endroid\QrCode\Writer\Result\ResultInterface
    {
        return $this->qrCodeBuilder
            ->size(300)
            ->encoding(new Encoding('UTF-8'))
            ->errorCorrectionLevel(new ErrorCorrectionLevelHigh())
            ->margin(30)
            // set path to logo, logo is in public/images/rfr.png
            ->logoPath(
                __DIR__ . '/../../public/images/rfr.png'
            )
            ->logoPunchoutBackground(true)
            ->logoResizeToHeight(100)

            ->data(
                $this->getContent($participant)
            )
            ->build();
    }

    public function getContent(Participants $participant): string
    {
        return 'ABJ#' . $participant->getQr();
    }
}