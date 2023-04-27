<?php

namespace App\Controller;

use App\Entity\Participants;
use App\Repository\ParticipantsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Endroid\QrCode\Builder\BuilderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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
                    'nom_prenoms' => [
                        'title' => 'Nom(s) & Prénom(s)',
                        'display' => true,
                        'type' => 'string',
                        'order' => 'ASC'
                    ],
                    'mail' => [
                        'title' => 'Adresse mail',
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
                            'nom_prenoms' => $Participants->getNoms(),
                            'mail' => $Participants->getMail(),
                            'currentState' => [
                                'label' => $Participants->isIsScanned() ? 'Scanné' . ' le ' . $Participants->getScannedAt()->format('d/m/Y à H:i:s') : 'Non scanné',
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
                'Content-Disposition' => 'attachment; filename="' .  str_replace(' ', '-', strtolower($participant->getNoms()))
                    . '-' . $participant->getId() . '.png"'
            ]
        );
    }

    #[Route('/participants/infos/{id}', name: 'app_participants_show', methods: ['GET'])]
    public function show(
        Participants $participant,
        BuilderInterface $qrCodeBuilder
    ): Response
    {
        $qrCode = $qrCodeBuilder
            ->data(
                // ABJ# Followed by the participant's qr
                'ABJ#' . $participant->getQr()
            )
            ->build()->getDataUri();
        return new Response(
            json_encode(
                [
                    'id' => $participant->getId() . '',
                    'nom_prenoms' => $participant->getNoms(),
                    'mail' => $participant->getMail(),
                    'qr' => $qrCode,
                    'currentState' => [
                        'label' => $participant->isIsScanned() ? 'Scanné' . ' le ' . $participant->getScannedAt()->format('d/m/Y à H:i:s') : 'Non scanné',
                        'color' => $participant->isIsScanned() ? 'success' : 'default'
                    ],
                    'subbedAt' => $participant->getCreatedAt()->format('d/m/Y à H:i:s'),
                    'addFields' => $participant->getAddFields(),
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
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setCellValue('A1', 'ID');
        $sheet->setCellValue('B1', 'Nom(s) & Prénom(s)');
        $sheet->setCellValue('C1', 'Adresse mail');
        $sheet->setCellValue('D1', 'Etat actuel');
        $sheet->setCellValue('E1', 'Date d\'inscription');
        $sheet->setCellValue('F1', 'Champs additionnels');
        $sheet->setCellValue('G1', 'Date de scan');
        $sheet->setCellValue('H1', 'QR Code');

        $i = 2;
        foreach ($participantsRepository->findAll() as $participant) {
            $sheet->setCellValue('A' . $i, $participant->getId());
            $sheet->setCellValue('B' . $i, $participant->getNoms());
            $sheet->setCellValue('C' . $i, $participant->getMail());
            $sheet->setCellValue('D' . $i, $participant->isIsScanned() ? 'Scanné' . ' le ' . $participant->getScannedAt()->format('d/m/Y à H:i:s') : 'Non scanné');
            $sheet->setCellValue('E' . $i, $participant->getCreatedAt()->format('d/m/Y à H:i:s'));
            $sheet->setCellValue('F' . $i, json_encode($participant->getAddFields()));
            $sheet->setCellValue('G' . $i, $participant->isIsScanned() ? $participant->getScannedAt()->format('d/m/Y à H:i:s') : 'Pas encore scanné');
            // Lien vers le QR code
            $sheet->setCellValue('H' . $i, $router->generate('api_app_participants_qr', ['id' => $participant->getId()], UrlGeneratorInterface::ABSOLUTE_URL));
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
                $participant = new Participants();
                $participant->setNoms($sheet->getCell('B' . $i)->getValue());
                $participant->setMail($sheet->getCell('C' . $i)->getValue());
                $participant->setAddFields(json_decode($sheet->getCell('D' . $i)->getValue(), true));
                $participant->setQr(
                    // Uuid v4
                    Uuid::v4()
                );
                $participant->setIsScanned(false);
                $participant->setCreatedAt(new \DateTimeImmutable());
                $participant->setScannedAt(null);

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
                    'nom_prenom' => $participant->getNoms(),
                    'mail' => $participant->getMail(),
                    'champs_additionnels' => $participant->getAddFields(),
                    'is_scanned' => $participant->isIsScanned() ? 'Scanné' : 'Non scanné',
                    'scanned_at' => $participant->getScannedAt() ? $participant->getScannedAt()->format('d/m/Y à H:i:s') : null,
                ]
            )
            , Response::HTTP_OK, ['Content-Type' => 'application/json']
        );
    }


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
}