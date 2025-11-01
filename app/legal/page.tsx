import { Container } from '@/components/layout/container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum | Atelier',
  description: 'Impressum und rechtliche Angaben',
};

export default function LegalPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Impressum</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
            <div className="space-y-2 text-muted-foreground">
              <p className="font-semibold text-foreground">Atelier</p>
              <p>[Ihr Name]</p>
              <p>[Ihre Straße und Hausnummer]</p>
              <p>[Ihre PLZ und Stadt]</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Telefon:</span>{' '}
                [Ihre Telefonnummer]
              </p>
              <p>
                <span className="font-semibold text-foreground">E-Mail:</span>{' '}
                <a href="mailto:contact@atelier.com" className="text-primary hover:underline">
                  contact@atelier.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Umsatzsteuer-ID</h2>
            <p className="text-muted-foreground">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
            </p>
            <p className="text-muted-foreground font-mono">
              [Ihre USt-IdNr. - falls vorhanden]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Verantwortlich für den Inhalt</h2>
            <p className="text-muted-foreground">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
            </p>
            <div className="space-y-2 text-muted-foreground mt-2">
              <p>[Ihr Name]</p>
              <p>[Ihre Adresse]</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Streitschlichtung</h2>
            <p className="text-muted-foreground">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="text-muted-foreground mt-3">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Haftung für Inhalte</h2>
            <p className="text-muted-foreground">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Haftung für Links</h2>
            <p className="text-muted-foreground">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
              der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Urheberrecht</h2>
            <p className="text-muted-foreground">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <section className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Hinweis zum Impressum</h3>
            <p className="text-sm text-muted-foreground">
              ⚠️ <strong>Wichtig:</strong> Bitte ersetzen Sie die Platzhalter in eckigen Klammern [...]
              mit Ihren tatsächlichen Angaben. Ein vollständiges Impressum ist rechtlich verpflichtend
              für gewerbliche Websites in Deutschland.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Sie können das Impressum jederzeit über den Admin-Bereich bearbeiten.
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </Container>
  );
}
