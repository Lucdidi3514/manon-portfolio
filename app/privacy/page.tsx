import { Container } from '@/components/layout/container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz | Atelier',
  description: 'Datenschutzerklärung',
};

export default function PrivacyPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Datenschutzerklärung</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>

            <h3 className="text-xl font-semibold mb-3">Allgemeine Hinweise</h3>
            <p className="text-muted-foreground">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen
              Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten,
              mit denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Datenerfassung auf dieser Website</h2>

            <h3 className="text-xl font-semibold mb-3">Wer ist verantwortlich für die Datenerfassung?</h3>
            <p className="text-muted-foreground">
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
              Dessen Kontaktdaten können Sie dem Impressum entnehmen.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Wie erfassen wir Ihre Daten?</h3>
            <p className="text-muted-foreground mb-3">
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen.
              Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
            </p>
            <p className="text-muted-foreground">
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website
              durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser,
              Betriebssystem oder Uhrzeit des Seitenaufrufs).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Kontaktformular</h2>
            <p className="text-muted-foreground mb-3">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem
              Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung
              der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
            </p>
            <p className="text-muted-foreground">
              Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Hosting</h2>
            <p className="text-muted-foreground mb-3">
              Diese Website wird bei Netlify gehostet. Die Datenverarbeitung erfolgt auf Grundlage
              unserer berechtigten Interessen an einer sicheren und effizienten Bereitstellung
              unseres Webangebots gemäß Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Ihre Rechte</h2>
            <p className="text-muted-foreground mb-3">
              Sie haben jederzeit das Recht:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten</li>
              <li>Die Berichtigung unrichtiger personenbezogener Daten zu verlangen</li>
              <li>Die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen</li>
              <li>Die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen</li>
              <li>Der Verarbeitung Ihrer personenbezogenen Daten zu widersprechen</li>
            </ul>
          </section>

          <section className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Kontakt für Datenschutzfragen</h3>
            <p className="text-muted-foreground">
              Bei Fragen zum Datenschutz können Sie uns jederzeit über das{' '}
              <a href="/contact" className="text-primary hover:underline">
                Kontaktformular
              </a>
              {' '}erreichen.
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
