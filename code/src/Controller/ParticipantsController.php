<?php

namespace App\Controller;

use App\Entity\Participants;
use App\Message\QRNotification;
use App\Message\QRNotificationAll;
use App\Repository\ParticipantsRepository;
use App\Service\CreateParticipantService;
use App\Service\GetQRService;
use Doctrine\ORM\EntityManagerInterface;
use Endroid\QrCode\Builder\BuilderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api', name: 'api_')]
class ParticipantsController extends AbstractController
{
    #[Route('/participants', name: 'app_participants', methods: ['GET'])]
    public function index(
        ParticipantsRepository $participantsRepository,
    ): Response
    {
        return new Response(
            json_encode(array_merge([
                'title' => 'Liste des participants',
                'filters' => [],
                'headers' => [
                    'id' => [
                        'title' => 'ID',
                        'display' => true,
                        'type' => 'string',
                        'order' => 'ASC'
                    ],
                    'nom' => [
                        'title' => 'Nom',
                        'display' => true,
                        'type' => 'string',
                        'order' => 'ASC',
                        'search' => true
                    ],
                    'prenoms' => [
                        'title' => 'Prénoms',
                        'display' => true,
                        'type' => 'string',
                        'order' => 'ASC',
                        'search' => true
                    ],
                    'mail' => [
                        'title' => 'Adresse mail',
                        'display' => true,
                        'type' => 'string',
                        'order' => 'ASC',
                        'search' => true
                    ],
                    'telephone' => [
                        'title' => 'Téléphone',
                        'display' => true,
                        'type' => 'string',
                        'order' => 'ASC',
                        'search' => true
                    ],
                    'gender' => [
                        'title' => 'Genre',
                        'display' => true,
                        'type' => 'string',
                        'order' => 'ASC'
                    ],
                    'fonction' => [
                        'title' => 'Fonction',
                        'display' => true,
                        'type' => 'string',
                        'order' => 'ASC'
                    ],
                    'entreprise' => [
                        'title' => 'Fonction',
                        'display' => true,
                        'type' => 'string',
                        'order' => 'ASC'
                    ],
                    'horaire' => [
                        'title' => 'Horaire',
                        'display' => true,
                        'type' => 'string',
                        'order' => 'ASC'
                    ],
                    'secteur' => [
                        'title' => 'Secteur',
                        'display' => true,
                        'type' => 'string',
                        'order' => 'ASC'
                    ],
                    'currentState' => [
                        'title' => 'Etat actuel',
                        'display' => true,
                        'type' => 'object',
                        'order' => 'ASC'
                    ],
                    'subbedAt' => [
                        'title' => 'Date d\'inscription',
                        'display' => true,
                        'type' => 'string',
                        'order' => 'ASC'
                    ],
                ],
                'data' => array_map(
                    function (Participants $Participants) {
                        return [
                            'id' => $Participants->getId() . '',
                            'nom' => $Participants->getNom(),
                            'prenoms' => $Participants->getPrenoms(),
                            'mail' => $Participants->getMail(),
                            'telephone' => $Participants->getTelephone(),
                            'gender' => $Participants->isGender() ? 'Homme' : 'Femme',
                            'fonction' => $Participants->getFonction(),
                            'entreprise' => $Participants->getEntreprise(),
                            'horaire' => $Participants->getHoraire() === 'morning' ? 'Matin' : 'Après-midi',
                            'secteur' => $Participants->getSecteur(),
                            'currentState' => [
                                'label' => ($Participants->isIsScanned() ? 'Scanné' : 'Non scanné') . ' - ' . ($Participants->getHoraire() == 'morning' ? 'Matin' : 'Après-midi'),
                                'color' => $Participants->isIsScanned() ? 'success' : 'default'
                            ],
                            'subbedAt' => $Participants->getCreatedAt()->format('d/m/Y à H:i:s'),
                            'buttons' => [
                                [
                                    'title' => 'Télécharger QR',
                                    'color' => 'white',
                                    'type' => 'download',
                                    'link' => '/api/participants/qr/' . $Participants->getId(),
                                ]
                            ]
                        ];
                    },
                    // get only the first 30 participants
                    $participantsRepository->findAll()
                )
            ])), Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }

    #[Route('/participants/stats', name: 'app_participants_stats', methods: ['GET'])]
    public function stats(
        ParticipantsRepository $participantsRepository
    ): Response
    {
        return new Response(
            json_encode(
                [
                    'subbed' => $participantsRepository->count([]),
                    'scanned' => $participantsRepository->count(['isScanned' => true]),
                ]
            )
            , Response::HTTP_OK, ['Content-Type' => 'application/json']
        );
    }

    #[Route('/participants/qr/{id}', name: 'app_participants_qr', methods: ['GET'])]
    public function qr(
        Participants $participant,
        BuilderInterface $qrCodeBuilder
    ): Response
    {
        //Download name must be the participant's name followed by the participant's id separated by a dash
        //Transform user name to lowercase and replace spaces with dashes
        $qrCode = $qrCodeBuilder
            ->data(
                // ABJ# Followed by the participant's qr
                'ABJ#' . $participant->getQr()
            )
            ->build()
        ;


        return new Response(
            $qrCode->getString(),
            Response::HTTP_OK,
            [
                'Content-Type' => 'image/png',
                'Content-Disposition' => 'attachment; filename="' .
                    str_replace(' ', '-', strtolower($participant->getNom() . ' ' . $participant->getPrenoms()))
                    . '-' . $participant->getId() . '.png"'
            ]
        );
    }

    #[Route('/participants/infos/{id}', name: 'app_participants_show', methods: ['GET'])]
    public function show(
        Participants $participant,
        GetQRService $getQRService,
    ): Response
    {

        $qrCode = ($getQRService)($participant)->getDataUri();
        return new Response(
            json_encode(
                [
                    'id' => $participant->getId() . '',
                    'nom_prenoms' => $participant->getNom() . ' ' . $participant->getPrenoms(),
                    'mail' => $participant->getMail(),
                    'qr' => $qrCode,
                    'currentState' => [
                        'label' => $participant->isIsScanned() ? 'Scanné' . ' le ' . $participant->getScannedAt()->format('d/m/Y à H:i:s') : 'Non scanné',
                        'color' => $participant->isIsScanned() ? 'success' : 'default'
                    ],
                    'subbedAt' => $participant->getCreatedAt()->format('d/m/Y à H:i:s'),
                    'addFields' => [
                        'fonction' => [
                            'name' => 'Fonction',
                            'value' => $participant->getFonction(),
                        ],
                        'entreprise' => [
                            'name' => 'Entreprise',
                            'value' => $participant->getEntreprise(),
                        ],
                        'secteur' => [
                            'name' => 'Secteur',
                            'value' => $participant->getSecteur(),
                        ],
                        'gender' => [
                            'name' => 'Genre',
                            'value' => $participant->isGender() ? 'Homme' : 'Femme',
                        ],
                        'telephone' => [
                            'name' => 'Téléphone',
                            'value' => $participant->getTelephone(),
                        ],
                        'isNotified' => [
                            'name' => 'Notification',
                            'value' => $participant->isIsMailSended() ? 'QR Envoyé' : 'QR Non envoyé',
                        ],
                        'horaire' => [
                            'name' => 'Horaire',
                            'value' => $participant->getHoraire() === 'morning' ? 'Matin' : 'Après-midi',
                        ],
                    ],
                    'isNotified' => $participant->isIsMailSended(),
                ]
            )
            , Response::HTTP_OK, ['Content-Type' => 'application/json']
        );
    }


    // Create a Excel file with all participants using PHPSpreadsheet
    #[Route('/participants/excel/export', name: 'app_participants_excel_export', methods: ['GET'])]
    public function excel(
        ParticipantsRepository $participantsRepository,
        UrlGeneratorInterface $router,
    ): Response
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $spreadsheet
            ->getProperties()
            ->setCreator('TicketGo')
            ->setTitle('Rapport - LES CONFERENCES RISQUES PAYS BLOOMFIELD INVESTMENT CORPORATION')
            ->setSubject('Rapport - LES CONFERENCES RISQUES PAYS BLOOMFIELD INVESTMENT CORPORATION')
            ->setDescription('
             Fichier Excel généré par TicketGo
            ');
        $sheet = $spreadsheet->getActiveSheet();
        // Create a red background color for the first row, text in white
        $sheet->getStyle('A1:M1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF0000');
        $sheet->getStyle('A1:M1')->getFont()->getColor()->setARGB(\PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE);
        $sheet->setCellValue('A1', 'ID');
        $sheet->setCellValue('B1', 'Nom');
        $sheet->setCellValue('C1', 'Prénoms');
        $sheet->setCellValue('D1', 'Fonction');
        $sheet->setCellValue('E1', 'Entreprise');
        $sheet->setCellValue('F1', 'Email');
        $sheet->setCellValue('G1', 'Téléphone');
        $sheet->setCellValue('H1', 'Secteur');
        $sheet->setCellValue('I1', 'Genre');
        $sheet->setCellValue('J1', 'Horaire');
        $sheet->setCellValue('K1', 'Scanné');
        $sheet->setCellValue('L1', 'Date de scan');
        $sheet->setCellValue('M1', 'Heure de scan');

        $i = 2;
        foreach ($participantsRepository->findAll() as $participant) {
            $sheet->setCellValue('A' . $i, $participant->getId());
            $sheet->setCellValue('B' . $i, $participant->getNom());
            $sheet->setCellValue('C' . $i, $participant->getPrenoms());
            $sheet->setCellValue('D' . $i, $participant->getFonction());
            $sheet->setCellValue('E' . $i, $participant->getEntreprise());
            $sheet->setCellValue('F' . $i, $participant->getMail());
            // Format phone number to not be displayed as a number
            $sheet->setCellValueExplicit('G' . $i, $participant->getTelephone(), \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
            $sheet->setCellValue('H' . $i, $participant->getSecteur());
            $sheet->setCellValue('I' . $i, $participant->isGender() ? 'Homme' : 'Femme');
            $sheet->setCellValue('J' . $i, $participant->getHoraire() === 'morning' ? 'Matin' : 'Après-midi');
            $sheet->setCellValue('K' . $i, $participant->isIsScanned() ? 'Oui' : 'Non');
            $sheet->setCellValue('L' . $i, $participant->getScannedAt() ? $participant->getScannedAt()->format('d/m/Y') : '');
            $sheet->setCellValue('M' . $i, $participant->getScannedAt() ? $participant->getScannedAt()->format('H:i:s') : '');
            $i++;
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $writer->save('participants.xlsx');

        return new Response(
            file_get_contents('participants.xlsx'),
            Response::HTTP_OK,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition' => 'attachment; filename="participants.xlsx"'
            ]
        );
    }


    // Create a controller to import participants from an excel file
    // Fields are: nom(s) & prénom(s), adresse mail, champs additionnels
    #[Route('/participants/excel/import', name: 'app_participants_excel_import', methods: ['POST'])]
    public function import(
        Request $request,
        EntityManagerInterface $entityManager,
        ParticipantsRepository $participantsRepository,
        ValidatorInterface $validator,
        CreateParticipantService $createParticipantService,
    ): Response
    {
        $file = $request->files->get('file');
        if ($file) {
            // If file is not an excel file
            if ($file->getClientOriginalExtension() !== 'xlsx') {
                return new Response(
                    json_encode(
                        [
                            'message' => 'Le fichier doit être un fichier excel (.xlsx)'
                        ]
                    ),
                    Response::HTTP_BAD_REQUEST,
                    ['Content-Type' => 'application/json']
                );
            }
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file);
            $sheet = $spreadsheet->getActiveSheet();
            $highestRow = $sheet->getHighestRow();

            $participants = [];
            for ($i = 2; $i <= $highestRow; $i++) {
                dump($sheet->getCell('I' . $i)->getValue());
                $participant = ($createParticipantService)(
                    [
                        'nom' => $sheet->getCell('A' . $i)->getValue(),
                        'prenoms' => $sheet->getCell('B' . $i)->getValue(),
                        'fonction' => $sheet->getCell('C' . $i)->getValue(),
                        'entreprise' => $sheet->getCell('D' . $i)->getValue(),
                        'mail' => $sheet->getCell('E' . $i)->getValue(),
                        'telephone' => $sheet->getCell('F' . $i)->getValue(),
                        'secteur' => $sheet->getCell('G' . $i)->getValue(),
                        'gender' => $sheet->getCell('H' . $i)->getValue() === 'H',
                        'horaire' => 'morning',
                    ]
                );

                $errors = $validator->validate($participant);
                if (count($errors) > 0) {
                    return new Response(
                        json_encode(
                            [
                                'error' => 'Erreur de validation',
                                'message' => $errors
                            ]
                        )
                        , Response::HTTP_BAD_REQUEST, ['Content-Type' => 'application/json']
                    );
                }

                $participants[] = $participant;
            }
            dump($participants);

            $entityManager->getConnection()->beginTransaction();
            try {
                foreach ($participants as $participant) {
                    $entityManager->persist($participant);
                }
                $entityManager->flush();
                $entityManager->getConnection()->commit();
            } catch (\Exception $e) {
                $entityManager->getConnection()->rollBack();
                return new Response(
                    json_encode(
                        [
                            'error' => 'Erreur lors de l\'importation',
                            'message' => $e->getMessage()
                        ]
                    )
                    , Response::HTTP_BAD_REQUEST, ['Content-Type' => 'application/json']
                );
            }

            return new Response(
                json_encode(
                    [
                        'message' => 'Importation réussie'
                    ]
                )
                , Response::HTTP_OK, ['Content-Type' => 'application/json']
            );
        }

        return new Response( // If no file is provided
            json_encode(
                [
                    'error' => 'Erreur lors de l\'importation',
                    'message' => 'Aucun fichier fourni'
                ]
            )
            , Response::HTTP_BAD_REQUEST, ['Content-Type' => 'application/json']
        );
    }

    // Get user data from generated QR code
    #[Route('/participants/qr/scan/{id}', name: 'app_participants_qr_scan', methods: ['GET'])]
    public function qrScan(
        $id,
        EntityManagerInterface $entityManager,
    ): Response
    {

        /** @var Participants $participant */
        $participant = $entityManager->getRepository(Participants::class)->findOneBy(['qr' => $id]);

        if (!$participant) {
            return new Response(
                json_encode(
                    [
                        'error' => 'Erreur lors du scan',
                        'message' => 'Aucun participant trouvé'
                    ]
                )
                , Response::HTTP_BAD_REQUEST, ['Content-Type' => 'application/json']
            );
        }


        return new Response(
            json_encode(
                [
                    'id' => $participant->getId(), // For debug purpose
                    'nom_prenom' => $participant->getNom() . ' ' . $participant->getPrenoms(),
                    'mail' => $participant->getMail(),
                    'champs_additionnels' => [
                        'fonction' => [
                            'name' => 'Fonction',
                            'value' => $participant->getFonction(),
                        ],
                        'entreprise' => [
                            'name' => 'Entreprise',
                            'value' => $participant->getEntreprise(),
                        ],
                        'secteur' => [
                            'name' => 'Secteur',
                            'value' => $participant->getSecteur(),
                        ],
                        'gender' => [
                            'name' => 'Genre',
                            'value' => $participant->isGender() ? 'Homme' : 'Femme',
                        ],
                        'telephone' => [
                            'name' => 'Téléphone',
                            'value' => $participant->getTelephone(),
                        ],
                        'isNotified' => [
                            'name' => 'Notification',
                            'value' => $participant->isIsMailSended() ? 'QR Envoyé' : 'QR Non envoyé',
                        ],
                        'horaire' => [
                            'name' => 'Horaire',
                            'value' => $participant->getHoraire() === 'morning' ? 'Matin' : 'Après-midi',
                        ],
                    ],
                    'is_scanned' => $participant->isIsScanned() ? 'Scanné' : 'Non scanné',
                    'scanned_at' => $participant->getScannedAt() ? $participant->getScannedAt()->format('d/m/Y à H:i:s') : null,
                ]
            )
            , Response::HTTP_OK, ['Content-Type' => 'application/json']
        );
    }

    // Set participant as scanned
    #[Route('/participants/qr/valid/{id}', name: 'app_participants_qr_valid', methods: ['GET'])]
    public function qrValid(
        Participants $participant,
        EntityManagerInterface $entityManager,
    ): Response
    {
        $participant->setIsScanned(true);
        $participant->setScannedAt(new \DateTimeImmutable());

        $entityManager->persist($participant);
        $entityManager->flush();

        return new Response(
            json_encode(
                [
                    'result' => 'ok'
                ]
            )
            , Response::HTTP_OK, ['Content-Type' => 'application/json']
        );
    }

    // Send mail to participant, if user not found return error
    #[Route(
        '/participants/mail/{id}',
        name: 'app_participants_mail',
        requirements: ['id' => '\d+'],
        methods: ['GET'])
    ]
    public function mail(
        Participants $participant,
        MessageBusInterface $messageBus,
    ): Response
    {
        $message = new QRNotification($participant);
        $messageBus->dispatch($message);

        return new Response(
            json_encode(
                [
                    'result' => 'ok'
                ]
            )
            , Response::HTTP_OK, ['Content-Type' => 'application/json']
        );
    }

    // Send mail to all participants
    #[Route('/participants/mail/all', name: 'app_participants_mail_all', methods: ['GET'])]
    public function mailAll(
        MessageBusInterface $messageBus,
    ): Response
    {
        $message = new QRNotificationAll();
        $messageBus->dispatch($message);

        return new Response(
            json_encode(
                [
                    'result' => 'ok'
                ]
            )
            , Response::HTTP_OK, ['Content-Type' => 'application/json']
        );
    }

    // Status of mail to all participants in percentage
    #[Route('/participants/mail/status', name: 'app_participants_mail_status', methods: ['GET'])]
    public function mailStatus(
        EntityManagerInterface $entityManager,
    ): Response
    {
        /** @var Participants[] $participants */
        $participants = $entityManager->getRepository(Participants::class)->findAll();
        $participantsCount = count($participants);
        $participantsScannedCount = 0;
        foreach ($participants as $participant) {
            if ($participant->isIsMailSended()) {
                $participantsScannedCount++;
            }
        }

        if($participantsCount == 0)
        {
            return new Response(
                json_encode(
                    [
                        'is_done' => true,
                        'result' => 'Aucun participant'
                    ]
                )
                , Response::HTTP_OK, ['Content-Type' => 'application/json']
            );
        }

        return new Response(
            json_encode(
                [
                    'is_done' => $participantsCount === $participantsScannedCount,
                    'result' => $participantsScannedCount . '/' . $participantsCount . ' (' . round($participantsScannedCount / $participantsCount * 100, 2) . '%)'
                ]
            )
            , Response::HTTP_OK, ['Content-Type' => 'application/json']
        );
    }


}