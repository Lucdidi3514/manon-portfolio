import { Container } from '@/components/layout/container';
import { ContactForm } from '@/components/contact/contact-form';
import { Metadata } from 'next';
import { Mail, Instagram, Facebook } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kontakt | Atelier',
  description: 'Nehmen Sie Kontakt auf für Maßanfertigungen, Zusammenarbeit oder einfach nur zum Hallo sagen.',
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Nehmen Sie
              <span className="block text-primary">Kontakt auf</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Haben Sie eine Frage oder möchten Sie eine Maßanfertigung besprechen? Ich freue mich von Ihnen zu hören.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Senden Sie mir eine Nachricht</h2>
              <p className="text-muted-foreground">
                Füllen Sie das Formular aus und ich melde mich so schnell wie möglich zurück.
                Normalerweise antworte ich innerhalb von 1-2 Werktagen.
              </p>
            </div>

            <ContactForm />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Weitere Kontaktmöglichkeiten</h2>
              <p className="text-muted-foreground">
                Bevorzugen Sie soziale Medien? Finden Sie mich auf diesen Plattformen.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:contact@atelier.com"
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted transition-colors group"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-muted-foreground">contact@atelier.com</p>
                </div>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted transition-colors group"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Instagram className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Instagram</h3>
                  <p className="text-sm text-muted-foreground">@atelier</p>
                </div>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted transition-colors group"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Facebook className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Facebook</h3>
                  <p className="text-sm text-muted-foreground">Atelier</p>
                </div>
              </a>
            </div>

            <div className="p-6 rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">Antwortzeit</h3>
              <p className="text-sm text-muted-foreground">
                Ich bemühe mich, alle Anfragen innerhalb von 1-2 Werktagen zu beantworten. Falls Sie
                nichts von mir gehört haben, prüfen Sie bitte Ihren Spam-Ordner oder kontaktieren Sie
                mich über soziale Medien.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
