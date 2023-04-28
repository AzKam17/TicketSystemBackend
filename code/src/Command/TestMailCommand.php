<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[AsCommand(name: 'redoc:test-mail')]
class TestMailCommand extends Command
{
    // Import mailer interface
    public function __construct(
        private MailerInterface $mailer,
    )
    {
        parent::__construct();
    }

    public function __configure() : void
    {
        $this
            ->setDescription('Send a test mail')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $mail = 'garba.avec.poisson.chaud@gmail.com';
        $output->writeln([
            'Test mail',
            '============',
            '',
        ]);
        // Get mail from console and send hello world
        $output->writeln('Sending mail to : ' . $mail);
        $this->mailer->send(
            (new Email())
                ->from('azizkamadou17@gmail.com')
                ->to($mail)
                ->subject('Hello world')
                ->text('Hello world')
        );
        return Command::SUCCESS;
    }
}