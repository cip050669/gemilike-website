/**
 * Script zum Initialisieren rechtsverbindlicher Musterexte
 * für alle rechtlichen Seiten und "Wer sind wir" Inhalte
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const legalPages = [
  {
    slug: 'imprint',
    title: 'Impressum',
    locale: 'de',
    content: `# Impressum

## Angaben gemäß § 5 TMG

**Gemilike Edelsteine Handelsgesellschaft mbH**
Musterstraße 123
12345 Musterstadt
Deutschland

## Kontakt

**Telefon:** +49 (0) 123 456789
**E-Mail:** info@gemilike.de
**Website:** https://gemilike.de

## Registereintrag

**Registergericht:** Amtsgericht Musterstadt
**Registernummer:** HRB 12345
**Umsatzsteuer-ID:** DE123456789

## Geschäftsführung

Max Mustermann
Muster Mustermann

## Aufsichtsbehörde

**Gewerbeaufsichtsamt Musterstadt**
Musterweg 456
12345 Musterstadt

## Berufsbezeichnung und berufsständische Kammer

**Berufsbezeichnung:** Edelsteinhändler
**Zuständige Kammer:** Industrie- und Handelskammer (IHK) Musterstadt
**Verliehen in:** Deutschland

## Redaktionell verantwortlich

Max Mustermann
Gemilike Edelsteine Handelsgesellschaft mbH
Musterstraße 123
12345 Musterstadt

## EU-Streitschlichtung

Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/
Unsere E-Mail-Adresse finden Sie oben im Impressum.

Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

## Haftung für Inhalte

Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.

Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.

## Haftung für Links

Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.

Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.

## Urheberrecht

Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.

Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.`,
  },
  {
    slug: 'privacy',
    title: 'Datenschutzerklärung',
    locale: 'de',
    content: `# Datenschutzerklärung

## 1. Verantwortlicher

**Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO):**

Gemilike Edelsteine Handelsgesellschaft mbH
Musterstraße 123
12345 Musterstadt
Deutschland

**Geschäftsführer:** Max Mustermann
**Kontakt:**
E-Mail: datenschutz@gemilike.de
Telefon: +49 (0) 123 456789

## 2. Allgemeines zur Datenverarbeitung

### 2.1 Umfang der Verarbeitung personenbezogener Daten

Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung personenbezogener Daten erfolgt regelmäßig nur nach Einwilligung des Betroffenen. Eine Ausnahme gilt in solchen Fällen, in denen eine vorherige Einholung einer Einwilligung aus tatsächlichen Gründen nicht möglich ist und die Verarbeitung der Daten durch gesetzliche Vorschriften gestattet ist.

### 2.2 Rechtsgrundlage für die Verarbeitung personenbezogener Daten

Soweit wir für Verarbeitungsvorgänge personenbezogener Daten eine Einwilligung der betroffenen Person einholen, dient Art. 6 Abs. 1 lit. a EU-Datenschutzgrundverordnung (DSGVO) als Rechtsgrundlage.

Bei der Verarbeitung von personenbezogenen Daten, die zur Erfüllung eines Vertrages, dessen Vertragspartei die betroffene Person ist, erforderlich ist, dient Art. 6 Abs. 1 lit. b DSGVO als Rechtsgrundlage. Dies gilt auch für Verarbeitungsvorgänge, die zur Durchführung vorvertraglicher Maßnahmen erforderlich sind.

Soweit eine Verarbeitung personenbezogener Daten zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist, der unser Unternehmen unterliegt, dient Art. 6 Abs. 1 lit. c DSGVO als Rechtsgrundlage.

Für den Fall, dass lebenswichtige Interessen der betroffenen Person oder einer anderen natürlichen Person eine Verarbeitung personenbezogener Daten erforderlich machen, dient Art. 6 Abs. 1 lit. d DSGVO als Rechtsgrundlage.

Ist die Verarbeitung zur Wahrung eines berechtigten Interesses unseres Unternehmens oder eines Dritten erforderlich und überwiegen die Interessen, Grundrechte und Grundfreiheiten des Betroffenen das erstgenannte Interesse nicht, so dient Art. 6 Abs. 1 lit. f DSGVO als Rechtsgrundlage für die Verarbeitung.

## 3. Bereitstellung der Website und Erstellung von Logfiles

### 3.1 Beschreibung und Umfang der Datenverarbeitung

Bei jedem Aufruf unserer Internetseite erfasst unser System automatisiert Daten und Informationen vom Computersystem des aufrufenden Rechners.

Folgende Daten werden hierbei erhoben:
- Informationen über den Browsertyp und die verwendete Version
- Das Betriebssystem des Nutzers
- Die IP-Adresse des Nutzers
- Datum und Uhrzeit des Zugriffs
- Websites, von denen das System des Nutzers auf unsere Internetseite gelangt
- Websites, die vom System des Nutzers über unsere Website aufgerufen werden

Die Daten werden ebenfalls in den Logfiles unseres Systems gespeichert. Eine Speicherung dieser Daten zusammen mit anderen personenbezogenen Daten des Nutzers findet nicht statt.

### 3.2 Rechtsgrundlage für die Datenverarbeitung

Die Rechtsgrundlage für die temporäre Speicherung der Daten und der Logfiles ist Art. 6 Abs. 1 lit. f DSGVO.

### 3.3 Zweck der Datenverarbeitung

Die temporäre Speicherung der IP-Adresse durch das System ist notwendig, um eine Auslieferung der Website an den Rechner des Nutzers zu ermöglichen. Hierfür muss die IP-Adresse des Nutzers für die Dauer der Sitzung gespeichert bleiben.

Die Speicherung in Logfiles erfolgt, um die Funktionsfähigkeit der Website sicherzustellen. Zudem dienen uns die Daten zur Optimierung der Website und zur Sicherstellung der Sicherheit unserer informationstechnischen Systeme. Eine Auswertung der Daten zu Marketingzwecken findet in diesem Zusammenhang nicht statt.

In diesen Zwecken liegt auch unser berechtigtes Interesse an der Datenverarbeitung nach Art. 6 Abs. 1 lit. f DSGVO.

### 3.4 Dauer der Speicherung

Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind. Im Falle der Erfassung der Daten zur Bereitstellung der Website ist dies der Fall, wenn die jeweilige Sitzung beendet ist.

Im Falle der Speicherung der Daten in Logfiles ist dies spätestens nach sieben Tagen der Fall. Eine darüberhinausgehende Speicherung ist möglich. In diesem Fall werden die IP-Adressen der Nutzer gelöscht oder verfremdet, sodass eine Zuordnung des aufrufenden Clients nicht mehr möglich ist.

### 3.5 Widerspruchs- und Beseitigungsmöglichkeit

Die Erfassung der Daten zur Bereitstellung der Website und die Speicherung der Daten in Logfiles ist für den Betrieb der Internetseite zwingend erforderlich. Es besteht folglich seitens des Nutzers keine Widerspruchsmöglichkeit.

## 4. Verwendung von Cookies

### 4.1 Beschreibung und Umfang der Datenverarbeitung

Unsere Website nutzt Cookies. Bei Cookies handelt es sich um Textdateien, die im Internetbrowser bzw. vom Internetbrowser auf dem Computersystem des Nutzers gespeichert werden. Ruft ein Nutzer eine Website auf, so kann ein Cookie auf dem Betriebssystem des Nutzers gespeichert werden. Dieser Cookie enthält eine charakteristische Zeichenfolge, die eine eindeutige Identifizierung des Browsers beim erneuten Aufrufen der Website ermöglicht.

Wir setzen Cookies ein, um unsere Website nutzerfreundlicher zu gestalten. Einige Elemente unserer Internetseite erfordern es, dass der aufrufende Browser auch nach einem Seitenwechsel identifiziert werden kann.

In den Cookies werden dabei folgende Daten gespeichert und übermittelt:
- Log-In-Informationen
- Spracheinstellungen
- Warenkorb-Inhalte
- Eingaben in Formularen

### 4.2 Rechtsgrundlage für die Datenverarbeitung

Die Rechtsgrundlage für die Verarbeitung personenbezogener Daten unter Verwendung von Cookies ist Art. 6 Abs. 1 lit. f DSGVO.

### 4.3 Zweck der Datenverarbeitung

Der Zweck der Verwendung technisch notwendiger Cookies ist, die Nutzung von Websites für die Nutzer zu vereinfachen. Einige Funktionen unserer Internetseite können ohne den Einsatz von Cookies nicht angeboten werden. Für diese ist es erforderlich, dass der Browser auch nach einem Seitenwechsel wiedererkannt wird.

Die durch technisch notwendige Cookies erhobenen Nutzerdaten werden nicht zur Erstellung von Nutzerprofilen verwendet.

In diesen Zwecken liegt auch unser berechtigtes Interesse in der Verarbeitung der personenbezogenen Daten nach Art. 6 Abs. 1 lit. f DSGVO.

### 4.4 Dauer der Speicherung, Widerspruchs- und Beseitigungsmöglichkeit

Cookies werden auf dem Rechner des Nutzers gespeichert und von diesem an unsere Seite übermittelt. Daher haben Sie als Nutzer auch die volle Kontrolle über die Verwendung von Cookies. Durch eine Änderung der Einstellungen in Ihrem Internetbrowser können Sie die Übertragung von Cookies deaktivieren oder einschränken. Bereits gespeicherte Cookies können jederzeit gelöscht werden. Dies kann auch automatisiert erfolgen. Werden Cookies für unsere Website deaktiviert, können möglicherweise nicht mehr alle Funktionen der Website vollumfänglich genutzt werden.

## 5. Registrierung und Bestellung

### 5.1 Beschreibung und Umfang der Datenverarbeitung

Auf unserer Internetseite bieten wir Nutzern die Möglichkeit, sich unter Angabe personenbezogener Daten zu registrieren und Bestellungen aufzugeben. Die Daten werden dabei in eine Eingabemaske eingegeben und an uns übermittelt und gespeichert. Eine Weitergabe der Daten an Dritte erfolgt nicht. Folgende Daten werden im Rahmen des Registrierungs- und Bestellprozesses erhoben:

**Bei Registrierung:**
- E-Mail-Adresse
- Passwort (verschlüsselt)
- Name, Vorname
- Anschrift
- Telefonnummer (optional)

**Bei Bestellung:**
- Rechnungsadresse
- Lieferadresse (falls abweichend)
- Zahlungsinformationen (je nach Zahlungsmethode)
- Bestellhistorie

### 5.2 Rechtsgrundlage für die Datenverarbeitung

Die Rechtsgrundlage für die Verarbeitung der Daten ist bei Vorliegen einer Einwilligung des Nutzers Art. 6 Abs. 1 lit. a DSGVO.

Dient die Registrierung der Erfüllung eines Vertrages, dessen Vertragspartei der Nutzer ist, oder der Durchführung vorvertraglicher Maßnahmen, so ist zusätzliche Rechtsgrundlage für die Verarbeitung der Daten Art. 6 Abs. 1 lit. b DSGVO.

### 5.3 Zweck der Datenverarbeitung

Eine Registrierung des Nutzers ist für das Vorhalten bestimmter Inhalte und Leistungen auf unserer Website erforderlich. Die Erhebung von Daten bei Bestellungen erfolgt zur Vertragsabwicklung und zur Erfüllung gesetzlicher Verpflichtungen.

### 5.4 Dauer der Speicherung

Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind.

Dies ist für die während des Registrierungsvorgangs erhobenen Daten der Fall, wenn die Registrierung auf unserer Internetseite aufgehoben oder abgeändert wird.

Für die im Rahmen einer Bestellung erhobenen Daten ist dies der Fall, wenn die Daten zur Vertragserfüllung nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten mehr bestehen. Auch nach Vertragsbeendigung können wir verpflichtet sein, personenbezogene Daten des Vertragspartners aufzubewahren, um handels- oder steuerrechtlichen Verpflichtungen nachzukommen.

### 5.5 Widerspruchs- und Beseitigungsmöglichkeit

Als Nutzer haben Sie jederzeit die Möglichkeit, die Registrierung aufzuheben. Sie können die über Sie gespeicherten personenbezogenen Daten jederzeit abändern lassen.

## 6. E-Mail-Kontakt

### 6.1 Beschreibung und Umfang der Datenverarbeitung

Auf unserer Internetseite ist es möglich, über die bereitgestellte E-Mail-Adresse bzw. ein Kontaktformular mit uns Kontakt aufzunehmen. Nimmt ein Nutzer diese Möglichkeit wahr, so werden die in der E-Mail bzw. im Kontaktformular übermittelten personenbezogenen Daten des Nutzers gespeichert.

Es erfolgt in diesem Zusammenhang keine Weitergabe der Daten an Dritte. Die Daten werden ausschließlich für die Verarbeitung der Konversation verwendet.

### 6.2 Rechtsgrundlage für die Datenverarbeitung

Die Rechtsgrundlage für die Verarbeitung der Daten ist bei Vorliegen einer Einwilligung des Nutzers Art. 6 Abs. 1 lit. a DSGVO.

Die Rechtsgrundlage für die Verarbeitung der Daten, die im Zuge einer Übersendung einer E-Mail übermittelt werden, ist Art. 6 Abs. 1 lit. f DSGVO. Zielt der E-Mail-Kontakt auf den Abschluss eines Vertrages ab, so ist zusätzliche Rechtsgrundlage für die Verarbeitung Art. 6 Abs. 1 lit. b DSGVO.

### 6.3 Zweck der Datenverarbeitung

Die Verarbeitung der personenbezogenen Daten dient uns allein zur Bearbeitung der Kontaktaufnahme. Im Falle einer Kontaktaufnahme per E-Mail liegt hieran auch das erforderliche berechtigte Interesse an der Verarbeitung der Daten.

### 6.4 Dauer der Speicherung

Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind. Für die personenbezogenen Daten, die per E-Mail oder Kontaktformular übersandt wurden, ist dies dann der Fall, wenn die jeweilige Konversation mit dem Nutzer beendet ist. Beendet ist die Konversation dann, wenn sich aus den Umständen entnehmen lässt, dass der betroffene Sachverhalt abschließend geklärt ist.

## 7. Rechte der betroffenen Person

Werden personenbezogene Daten von Ihnen verarbeitet, sind Sie Betroffener i.S.d. DSGVO und es stehen Ihnen folgende Rechte gegenüber dem Verantwortlichen zu:

### 7.1 Auskunftsrecht

Sie können von dem Verantwortlichen eine Bestätigung darüber verlangen, ob personenbezogene Daten, die Sie betreffen, von uns verarbeitet werden.

Liegt eine solche Verarbeitung vor, können Sie von dem Verantwortlichen über folgende Informationen Auskunft verlangen:
- die Zwecke, zu denen die personenbezogenen Daten verarbeitet werden;
- die Kategorien von personenbezogenen Daten, welche verarbeitet werden;
- die Empfänger bzw. die Kategorien von Empfängern, gegenüber denen die Sie betreffenden personenbezogenen Daten offengelegt wurden oder noch offengelegt werden;
- die geplante Dauer der Speicherung der Sie betreffenden personenbezogenen Daten oder, falls konkrete Angaben hierzu nicht möglich sind, Kriterien für die Festlegung der Speicherdauer;
- das Bestehen eines Rechts auf Berichtigung oder Löschung der Sie betreffenden personenbezogenen Daten, eines Rechts auf Einschränkung der Verarbeitung durch den Verantwortlichen oder eines Widerspruchsrechts gegen diese Verarbeitung;
- das Bestehen eines Beschwerderechts bei einer Aufsichtsbehörde;
- alle verfügbaren Informationen über die Herkunft der Daten, wenn die personenbezogenen Daten nicht bei der betroffenen Person erhoben werden;
- das Bestehen einer automatisierten Entscheidungsfindung einschließlich Profiling gemäß Art. 22 Abs. 1 und 4 DSGVO und — zumindest in diesen Fällen — aussagekräftige Informationen über die involvierte Logik sowie die Tragweite und die angestrebten Auswirkungen einer derartigen Verarbeitung für die betroffene Person.

### 7.2 Recht auf Berichtigung

Sie haben ein Recht auf Berichtigung und/oder Vervollständigung gegenüber dem Verantwortlichen, sofern die verarbeiteten personenbezogenen Daten, die Sie betreffen, unrichtig oder unvollständig sind. Der Verantwortliche hat die Berichtigung unverzüglich vorzunehmen.

### 7.3 Recht auf Löschung

Sie können von dem Verantwortlichen verlangen, dass die Sie betreffenden personenbezogenen Daten unverzüglich gelöscht werden, und der Verantwortliche ist verpflichtet, diese Daten unverzüglich zu löschen, sofern einer der folgenden Gründe zutrifft:
- Die Sie betreffenden personenbezogenen Daten sind für die Zwecke, für die sie erhoben oder auf sonstige Weise verarbeitet wurden, nicht mehr notwendig.
- Sie widerrufen Ihre Einwilligung, auf die sich die Verarbeitung gemäß Art. 6 Abs. 1 lit. a oder Art. 9 Abs. 2 lit. a DSGVO stützte, und es fehlt an einer anderweitigen Rechtsgrundlage für die Verarbeitung.
- Sie legen gemäß Art. 21 Abs. 1 DSGVO Widerspruch gegen die Verarbeitung ein und es liegen keine vorrangigen berechtigten Gründe für die Verarbeitung vor, oder Sie legen gemäß Art. 21 Abs. 2 DSGVO Widerspruch gegen die Verarbeitung ein.
- Die Sie betreffenden personenbezogenen Daten wurden unrechtmäßig verarbeitet.
- Die Löschung der Sie betreffenden personenbezogenen Daten ist zur Erfüllung einer rechtlichen Verpflichtung nach dem Unionsrecht oder dem Recht der Mitgliedstaaten erforderlich, dem der Verantwortliche unterliegt.
- Die Sie betreffenden personenbezogenen Daten wurden in Bezug auf angebotene Dienste der Informationsgesellschaft gemäß Art. 8 Abs. 1 DSGVO erhoben.

### 7.4 Recht auf Einschränkung der Verarbeitung

Sie haben das Recht, von dem Verantwortlichen die Einschränkung der Verarbeitung zu verlangen, wenn eine der folgenden Voraussetzungen gegeben ist:
- Die Richtigkeit der Sie betreffenden personenbezogenen Daten wird von Ihnen bestritten, und zwar für eine Dauer, die es dem Verantwortlichen ermöglicht, die Richtigkeit der personenbezogenen Daten zu überprüfen.
- Die Verarbeitung ist unrechtmäßig und Sie lehnen die Löschung der personenbezogenen Daten ab und verlangen stattdessen die Einschränkung der Nutzung der personenbezogenen Daten.
- Der Verantwortliche benötigt die Sie betreffenden personenbezogenen Daten für die Zwecke der Verarbeitung nicht länger, Sie benötigen sie jedoch zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.
- Sie haben Widerspruch gegen die Verarbeitung gemäß Art. 21 Abs. 1 DSGVO eingelegt und es steht noch nicht fest, ob die berechtigten Gründe des Verantwortlichen gegenüber Ihren Gründen überwiegen.

### 7.5 Recht auf Datenübertragbarkeit

Sie haben das Recht, die Sie betreffenden personenbezogenen Daten, die Sie dem Verantwortlichen bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten. Außerdem haben Sie das Recht, diese Daten einem anderen Verantwortlichen ohne Behinderung durch den Verantwortlichen, dem die personenbezogenen Daten bereitgestellt wurden, zu übermitteln.

### 7.6 Widerspruchsrecht

Sie haben das Recht, aus Gründen, die sich aus ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen.

### 7.7 Recht auf Widerruf der datenschutzrechtlichen Einwilligung

Sie haben das Recht, Ihre datenschutzrechtliche Einwilligung jederzeit zu widerrufen. Durch den Widerruf der Einwilligung wird die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung nicht berührt.

### 7.8 Automatisierte Entscheidung im Einzelfall einschließlich Profiling

Sie haben das Recht, nicht einer ausschließlich auf einer automatisierten Verarbeitung — einschließlich Profiling — beruhenden Entscheidung unterworfen zu werden, die Ihnen gegenüber rechtliche Wirkung entfaltet oder Sie in ähnlicher Weise erheblich beeinträchtigt.

### 7.9 Recht auf Beschwerde bei einer Aufsichtsbehörde

Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres Aufenthaltsorts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes, zu, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die DSGVO verstößt.

## 8. Datensicherheit

Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird. In der Regel handelt es sich dabei um eine 256 Bit Verschlüsselung. Falls Ihr Browser keine 256-Bit-Verschlüsselung unterstützt, greifen wir stattdessen auf 128-Bit v3 Technologie zurück.

Ob eine einzelne Seite unserer Internetpräsenz verschlüsselt übertragen wird, erkennen Sie an der geschlossenen Darstellung des Schlüssel- beziehungsweise Schloss-Symbols in der unteren Statusleiste Ihres Browsers.

Wir bedienen uns im Übrigen geeigneter technischer und organisatorischer Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert.`,
  },
  {
    slug: 'terms',
    title: 'Allgemeine Geschäftsbedingungen',
    locale: 'de',
    content: `# Allgemeine Geschäftsbedingungen (AGB)

## § 1 Geltungsbereich

(1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") der Gemilike Edelsteine Handelsgesellschaft mbH, Musterstraße 123, 12345 Musterstadt (nachfolgend "Verkäufer"), gelten für alle Verträge über die Lieferung von Waren, die ein Verbraucher oder Unternehmer (nachfolgend "Kunde") mit dem Verkäufer bezüglich der vom Verkäufer in seinem Online-Shop dargestellten Waren abschließt. Hiermit wird der Einbeziehung von eigenen Bedingungen des Kunden widersprochen, es sei denn, dass etwas anderes vereinbart ist.

(2) Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können.

(3) Unternehmer ist eine natürliche oder juristische Person oder eine rechtsfähige Personengesellschaft, die bei Abschluss eines Rechtsgeschäfts in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt.

## § 2 Vertragspartner, Vertragsschluss, Vertragsgegenstand

(1) Der Verkaufvertrag kommt zustande mit Gemilike Edelsteine Handelsgesellschaft mbH.

(2) Die Darstellung der Waren im Online-Shop stellt kein rechtlich bindendes Angebot, sondern eine unverbindliche Aufforderung zur Abgabe eines Angebots durch den Kunden dar.

(3) Der Kunde kann aus unserem Sortiment an Edelsteinen auswählen und die ausgewählten Waren über die Schaltfläche "In den Warenkorb" in einen so genannten Warenkorb aufnehmen. Dabei kann er die Auswahl jederzeit verändern. Mit Betätigung der Schaltfläche "Zur Kasse" / "Jetzt kaufen" gibt der Kunde eine verbindliche Bestellung der im Warenkorb enthaltenen Waren ab. Der Kunde kann vor der verbindlichen Übermittlung seiner Bestellung durch Abruf der Eingabemasken auf mögliche Eingabefehler hingewiesen werden und diese durch Klicken der Schaltfläche "Zurück" in den Browsereinstellungen des verwendeten Internet-Browsers korrigieren.

(4) Der Verkäufer schickt dem Kunden nach Eingang der Bestellung beim Verkäufer eine automatische E-Mail-Bestätigung, in welcher die Bestellung des Kunden nochmals aufgerufen wird und der Kunde seine Bestelldaten nach dem Absenden seiner Bestellung erneut einsehen kann (Bestellbestätigung). Die automatische E-Mail-Bestätigung dokumentiert lediglich, dass die Bestellung des Kunden beim Verkäufer eingegangen ist und stellt keine Annahme des Angebots dar. Der Kaufvertrag kommt erst durch die Übersendung einer Annahmeerklärung durch den Verkäufer zustande, die mit einer separaten E-Mail (Auftragsbestätigung) oder durch Übersendung der Ware versandt wird.

(5) Bei Auswahl der Zahlungsart "Vorkasse" erfolgt die Annahme des Angebots erst durch Erklärung der Annahme durch den Verkäufer, nachdem der Kaufpreis auf dem Konto des Verkäufers eingegangen ist.

(6) Die Vertragssprache ist Deutsch.

## § 3 Preise und Zahlungsbedingungen

(1) Alle Preise verstehen sich als Endpreise und enthalten die gesetzliche Umsatzsteuer. Alle Preisangaben sind in Euro (€).

(2) Bei Lieferungen außerhalb Deutschlands können zusätzliche Kosten (z. B. für Zollabfertigung, Mehrwertsteuer oder andere Abgaben) entstehen, die vom Kunden getragen werden müssen. Der Kunde hat gegebenenfalls Verzollungskosten zu tragen.

(3) Die Zahlungsmöglichkeiten werden dem Kunden auf der Internetseite des Verkäufers mitgeteilt. Die Zahlung ist bei Bestellung sofort fällig, soweit keine anderen Vereinbarungen getroffen wurden.

(4) Bei Zahlungsverzug ist der Verkäufer berechtigt, Verzugszinsen in Höhe von 9 Prozentpunkten über dem Basiszinssatz zu berechnen. Die Geltendmachung eines höheren Verzugsschadens bleibt dem Verkäufer vorbehalten.

## § 4 Lieferung und Versand

(1) Die Lieferung erfolgt grundsätzlich an die vom Kunden angegebene Lieferadresse, soweit keine andere Vereinbarung getroffen wurde.

(2) Sollte das in der Bestellbestätigung genannte Produkt trotz sorgfältiger Warenwirtschaft ausnahmsweise nicht verfügbar sein, wird der Kunde unverzüglich informiert und die bereits geleistete Gegenleistung wird unverzüglich erstattet.

(3) Die Versandkosten werden im jeweiligen Angebot aufgeführt. Die Versandkosten werden zusätzlich zum Warenpreis angezeigt. Eine kostenlose Lieferung ab einem Bestellwert von 50,00 € innerhalb Deutschlands ist vorgesehen.

(4) Die Versandkosten betragen:
- Standardversand innerhalb Deutschlands: 4,95 € (kostenlos ab 50,00 € Bestellwert)
- Expressversand: 9,95 €
- Versicherter Versand: 12,95 €
- Internationaler Versand: auf Anfrage

(5) Die Lieferzeit beträgt bei Zahlung per Vorkasse bis zu 3 Werktage nach Erhalt des Zahlungseingangs. Bei Zahlung per PayPal oder Kreditkarte beträgt die Lieferzeit bis zu 2 Werktage nach Bestelleingang. Bei Zahlung per Rechnung beträgt die Lieferzeit bis zu 3 Werktage nach Bestelleingang. Die Lieferzeit bei Expressversand beträgt 1-2 Werktage.

(6) Sollte dem Kunden eine Ware fehlerhaft geliefert worden sein, kann der Kunde eine Nachlieferung verlangen.

## § 5 Widerrufsrecht

(1) Der Kunde hat das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.

(2) Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.

(3) Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Gemilike Edelsteine Handelsgesellschaft mbH, Musterstraße 123, 12345 Musterstadt, Deutschland, E-Mail: widerruf@gemilike.de, Telefon: +49 (0) 123 456789) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief, Telefax oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür auch das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.

(4) Zur Wahrung der Widerrufsfrist genügt die rechtzeitige Absendung der Widerrufserklärung.

(5) Folgen des Widerrufs:
- Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.

- Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.

- Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.

- Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.

- Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.

## § 6 Gewährleistung und Haftung

(1) Für Ansprüche wegen Mängeln gelten die gesetzlichen Bestimmungen.

(2) Soweit nicht ausdrücklich etwas anderes vereinbart ist, richtet sich die Haftung auf Schadensersatz, gleich aus welchem Rechtsgrund, einschließlich der Haftung für Fehler bei der Vertragsverhandlung, wie folgt:

- Der Verkäufer haftet unbeschränkt, soweit die Schäden auf Vorsatz oder grober Fahrlässigkeit beruhen oder Leben, Körper oder Gesundheit verletzt wurden.

- Der Verkäufer haftet ferner unbeschränkt nach Maßgabe des Produkthaftungsgesetzes.

- Bei Verletzung von Kardinalpflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht und auf deren Einhaltung der Kunde regelmäßig vertrauen darf, haftet der Verkäufer bei leichter Fahrlässigkeit nur für den typischerweise vorhersehbaren Vertragsschaden.

- Bei leichter Fahrlässigkeit haftet der Verkäufer nur im Rahmen eines vorhersehbaren, typischerweise eintretenden Schadens.

- Im Übrigen ist eine Haftung ausgeschlossen.

(3) Die Haftungsbeschränkungen gelten nicht für die Gewährleistungsrechte des Kunden.

(4) Die Haftungsbeschränkungen gelten auch zugunsten der Mitarbeiter und Erfüllungsgehilfen des Verkäufers.

(5) Die Bestimmungen des Produkthaftungsgesetzes bleiben unberührt.

## § 7 Datenschutz

Die Erhebung, Verarbeitung und Nutzung Ihrer personenbezogenen Daten erfolgt ausschließlich im Rahmen der gesetzlichen Bestimmungen. Einzelheiten entnehmen Sie bitte unserer Datenschutzerklärung unter https://gemilike.de/privacy.

## § 8 Schlussbestimmungen

(1) Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.

(2) Erfüllungsort und Gerichtsstand ist bei allen Streitigkeiten aus diesem Vertragsverhältnis der Sitz des Verkäufers, wenn der Kunde Kaufmann, eine juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen ist.

(3) Sind einzelne Bestimmungen dieses Vertrages unwirksam oder wird dieser Vertrag lückenhaft, so wird hierdurch die Wirksamkeit des übrigen Vertrages nicht berührt. Die unwirksame Bestimmung soll durch eine wirksame ersetzt werden, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung möglichst nahekommt.`,
  },
  {
    slug: 'cookies',
    title: 'Cookie-Richtlinie',
    locale: 'de',
    content: `# Cookie-Richtlinie

## Was sind Cookies?

Cookies sind kleine Textdateien, die von Websites auf Ihrem Computer oder Mobilgerät gespeichert werden, wenn Sie eine Website besuchen. Cookies werden weitgehend verwendet, um Websites zum Funktionieren zu bringen oder effizienter zu arbeiten, sowie um Berichtsinformationen bereitzustellen.

Cookies ermöglichen es einer Website, Ihre Geräte und Browser zu erkennen, und erleichtern Ihnen das Navigieren zwischen den Seiten, indem sie Informationen speichern, die Sie zuvor eingegeben haben.

## Arten von Cookies, die wir verwenden

### 1. Technisch notwendige Cookies

Diese Cookies sind für die Funktion der Website unbedingt erforderlich und können nicht deaktiviert werden. Sie werden in der Regel nur als Reaktion auf von Ihnen getätigte Aktionen gesetzt, die einer Dienstanfrage entsprechen, wie z. B. das Festlegen Ihrer Datenschutzeinstellungen, das Anmelden oder das Ausfüllen von Formularen.

**Zweck:**
- Speicherung Ihrer Spracheinstellungen
- Warenkorbfunktion
- Sicherheit und Prävention von Betrug
- Anmeldung und Authentifizierung

### 2. Funktionale Cookies

Diese Cookies ermöglichen es der Website, erweiterte Funktionalität und Personalisierung bereitzustellen. Sie können von uns oder von Drittanbietern gesetzt werden, deren Dienste wir auf unseren Seiten hinzugefügt haben.

**Zweck:**
- Speicherung Ihrer Präferenzen (z. B. Sprache, Region)
- Verbesserung der Benutzerfreundlichkeit
- Speicherung von Formulardaten

### 3. Analyse-Cookies

Diese Cookies ermöglichen es uns, Besuche und Verkehrsquellen zu zählen, damit wir die Leistung unserer Website messen und verbessern können. Sie helfen uns zu wissen, welche Seiten am beliebtesten und am wenigsten beliebt sind und wie sich Besucher auf der Website bewegen.

**Zweck:**
- Analyse des Nutzerverhaltens
- Verbesserung der Website-Performance
- Erstellung von Statistiken

### 4. Marketing-Cookies

Diese Cookies werden möglicherweise von unseren Werbepartnern über unsere Website gesetzt. Sie können von diesen Unternehmen verwendet werden, um ein Profil Ihrer Interessen zu erstellen und Ihnen relevante Werbung auf anderen Websites zu zeigen.

**Zweck:**
- Personalisierte Werbung
- Messung der Werbewirksamkeit

## Cookie-Verwaltung

Sie haben die Kontrolle über Cookies. Die meisten Browser akzeptieren Cookies automatisch, aber Sie können Ihre Browser-Einstellungen so ändern, dass Cookies abgelehnt werden, wenn Sie dies wünschen.

### Browser-Einstellungen ändern

**Google Chrome:**
1. Öffnen Sie Chrome auf Ihrem Computer
2. Klicken Sie oben rechts auf "Mehr" (drei Punkte) → "Einstellungen"
3. Klicken Sie unter "Datenschutz und Sicherheit" auf "Cookies und andere Websitedaten"
4. Wählen Sie eine Option aus:
   - Alle Cookies blockieren
   - Cookies von Drittanbietern blockieren
   - Cookies beim Schließen von Chrome löschen

**Mozilla Firefox:**
1. Öffnen Sie Firefox
2. Klicken Sie auf das Menü (drei Linien) → "Einstellungen"
3. Wählen Sie "Datenschutz & Sicherheit"
4. Im Abschnitt "Cookies und Websitedaten" können Sie Ihre Präferenzen festlegen

**Safari:**
1. Öffnen Sie Safari
2. Klicken Sie auf "Safari" → "Einstellungen"
3. Wählen Sie "Datenschutz"
4. Aktivieren Sie "Alle Cookies blockieren" oder wählen Sie andere Optionen

**Microsoft Edge:**
1. Öffnen Sie Edge
2. Klicken Sie auf "Einstellungen und mehr" (drei Punkte) → "Einstellungen"
3. Wählen Sie "Cookies und Websitedatenberechtigungen"
4. Wählen Sie Ihre Cookie-Einstellungen

## Drittanbieter-Cookies

Einige Cookies werden von Drittanbietern gesetzt, die auf unserer Website Dienstleistungen erbringen. Diese Cookies ermöglichen es uns, Funktionen wie Social-Media-Funktionen, Anzeigen oder Analysefunktionen bereitzustellen.

### Google Analytics

Wir verwenden möglicherweise Google Analytics, um zu analysieren, wie Besucher unsere Website nutzen. Google Analytics verwendet Cookies, um Informationen über Ihre Nutzung der Website zu sammeln.

**Weitere Informationen:** [Google Analytics Datenschutzrichtlinie](https://policies.google.com/privacy)

## Cookie-Lebensdauer

### Session-Cookies

Diese Cookies sind temporär und werden gelöscht, wenn Sie Ihren Browser schließen. Sie ermöglichen es uns, Ihre Aktionen während einer Browser-Sitzung zu verknüpfen.

### Persistente Cookies

Diese Cookies bleiben auf Ihrem Gerät für einen bestimmten Zeitraum oder bis Sie sie löschen gespeichert. Sie ermöglichen es uns, Sie bei wiederholten Besuchen auf unserer Website zu erkennen.

## Ihre Rechte

Sie haben das Recht:
- Zu erfahren, welche Cookies verwendet werden
- Cookies zu akzeptieren oder abzulehnen
- Gespeicherte Cookies zu löschen
- Informationen über die Verwendung von Cookies zu erhalten

## Kontakt

Wenn Sie Fragen zu unserer Verwendung von Cookies haben, kontaktieren Sie uns bitte:

**E-Mail:** datenschutz@gemilike.de
**Telefon:** +49 (0) 123 456789
**Adresse:** Gemilike Edelsteine Handelsgesellschaft mbH, Musterstraße 123, 12345 Musterstadt

## Änderungen dieser Cookie-Richtlinie

Wir behalten uns vor, diese Cookie-Richtlinie von Zeit zu Zeit zu aktualisieren, um Änderungen in unseren Praktiken oder aus anderen betrieblichen, rechtlichen oder regulatorischen Gründen zu widerspiegeln. Wir werden Sie über wesentliche Änderungen informieren, indem wir eine neue Cookie-Richtlinie auf dieser Seite veröffentlichen.

**Letzte Aktualisierung:** Oktober 2025`,
  },
  {
    slug: 'returns',
    title: 'Widerrufsrecht',
    locale: 'de',
    content: `# Widerrufsrecht

## Widerrufsbelehrung

### Widerrufsrecht

Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.

Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag,
- an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat,
- an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die letzte Ware in Besitz genommen haben bzw. hat, wenn Sie mehrere Waren im Rahmen einer einheitlichen Bestellung bestellt haben und die Waren getrennt geliefert werden,
- an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die letzte Teillieferung oder das letzte Stück in Besitz genommen haben bzw. hat, wenn Sie eine Ware bestellt haben, die in mehreren Teillieferungen oder Stücken geliefert wird.

Um Ihr Widerrufsrecht auszuüben, müssen Sie uns

**Gemilike Edelsteine Handelsgesellschaft mbH**
Musterstraße 123
12345 Musterstadt
Deutschland

**E-Mail:** widerruf@gemilike.de
**Telefon:** +49 (0) 123 456789

mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief, Telefax oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.

Zur Wahrung der Widerrufsfrist genügt die rechtzeitige Absendung der Widerrufserklärung.

## Folgen des Widerrufs

Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.

Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.

Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.

Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.

Sie tragen die unmittelbaren Kosten der Rücksendung der Waren. Die Kosten werden auf maximal €4,95 begrenzt.

Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.

## Muster-Widerrufsformular

Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück an:

**Gemilike Edelsteine Handelsgesellschaft mbH**
Musterstraße 123
12345 Musterstadt
Deutschland

E-Mail: widerruf@gemilike.de

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*):

Bestellt am (*)/erhalten am (*): _________________

Name des/der Verbraucher(s): _________________

Anschrift des/der Verbraucher(s): _________________

Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): _________________

Datum: _________________

(*) Unzutreffendes streichen.`,
  },
  {
    slug: 'shipping',
    title: 'Versandinformationen',
    locale: 'de',
    content: `# Versandinformationen

## Standardversand

### Lieferzeit
3-5 Werktage (Montag bis Freitag, Feiertage ausgenommen)

### Kosten
- **Kostenlos** ab einem Bestellwert von 50,00 €
- **4,95 €** bei Bestellungen unter 50,00 €

### Versanddienstleister
Wir versenden standardmäßig innerhalb Deutschlands über DHL oder DPD.

### Liefergebiet
Deutschland

## Expressversand

### Lieferzeit
1-2 Werktage (Montag bis Freitag, Feiertage ausgenommen)

### Kosten
**9,95 €** (unabhängig vom Bestellwert)

### Besonderheiten
- Zustellung innerhalb Deutschlands am nächsten Werktag möglich
- Ideal für eilige Bestellungen
- Versand erfolgt per Expressdienstleister

## Versicherter Versand

### Lieferzeit
3-5 Werktage (Montag bis Freitag, Feiertage ausgenommen)

### Kosten
**12,95 €**

### Versicherungsschutz
Vollversichert bis zu einem Wert von 10.000 €

### Besonderheiten
- Besonders geeignet für wertvolle Edelsteine
- Volle Versicherung während des Transports
- Nachverfolgung der Sendung möglich

## Internationaler Versand

### Verfügbare Länder
- Österreich
- Schweiz

### Kosten
Die Versandkosten werden individuell berechnet und richten sich nach:
- Gewicht der Sendung
- Zielort
- Versandart (Standard oder Express)

### Zusatzkosten
Bei Bestellungen aus dem Ausland können zusätzliche Kosten entstehen:
- Zölle
- Einfuhrumsatzsteuer
- Bearbeitungsgebühren der Versanddienstleister

Diese Kosten sind vom Kunden zu tragen und werden nicht von uns übernommen.

### Kontakt für internationale Bestellungen
Für individuelle Versandkosten und weitere Informationen kontaktieren Sie uns bitte vor Ihrer Bestellung:

**E-Mail:** versand@gemilike.de
**Telefon:** +49 (0) 123 456789

## Versandverfolgung

Nach Versand Ihrer Bestellung erhalten Sie eine Versandbestätigung per E-Mail mit einer Tracking-Nummer, mit der Sie den Versandstatus Ihrer Sendung online verfolgen können.

## Verpackung

Wir verpacken alle Edelsteine sorgfältig und sicher:
- Individuelle Verpackung für jeden Edelstein
- Stoßfestes Material
- Bei wertvollen Steinen: zusätzliche Sicherheitsverpackung

## Versandzeiten

Bitte beachten Sie:
- Die angegebenen Lieferzeiten gelten ab Versand
- Feiertage werden nicht als Werktage gezählt
- Bei Zahlung per Vorkasse: Versand erfolgt nach Zahlungseingang
- Bei Zahlung per PayPal oder Kreditkarte: Versand innerhalb von 1-2 Werktagen nach Bestelleingang
- Bei Zahlung per Rechnung: Versand innerhalb von 3 Werktagen nach Bestelleingang

## Problematische Sendungen

Falls Ihre Sendung nicht ankommt oder beschädigt ist:
1. Kontaktieren Sie uns umgehend unter versand@gemilike.de
2. Geben Sie Ihre Bestellnummer an
3. Beschreiben Sie das Problem
4. Wir werden schnellstmöglich eine Lösung finden

Bei versicherten Sendungen werden Schäden vollständig abgedeckt.

## Retouren

Für Informationen zum Rücksendeverfahren siehe bitte unsere [Widerrufsbelehrung](/de/returns).

Die Rücksendekosten betragen maximal 4,95 € und werden dem Kunden erstattet, wenn die Rücksendung auf einen Mangel der Ware zurückzuführen ist.`,
  },
];

const aboutContent = [
  {
    section: 'title',
    title: null,
    content: 'Über Gemilike',
    locale: 'de',
  },
  {
    section: 'subtitle',
    title: null,
    content: 'Ihr Partner für außergewöhnliche Edelsteine',
    locale: 'de',
  },
  {
    section: 'intro1',
    title: null,
    content: 'Willkommen bei Gemilike – Ihrer Expertenquelle für hochwertige Edelsteine. Seit Jahren bieten wir eine exklusive Auswahl an natürlichen Edelsteinen, die für ihre außergewöhnliche Qualität und Schönheit bekannt sind.',
    locale: 'de',
  },
  {
    section: 'intro2',
    title: null,
    content: 'Unser Team von Edelsteinexperten steht Ihnen mit umfassendem Wissen und persönlicher Beratung zur Seite, um Ihnen zu helfen, den perfekten Edelstein zu finden.',
    locale: 'de',
  },
  {
    section: 'mission',
    title: 'Unsere Mission',
    content: '',
    locale: 'de',
  },
  {
    section: 'missionDesc',
    title: null,
    content: 'Unsere Mission ist es, Menschen dabei zu helfen, die Schönheit und Kraft natürlicher Edelsteine zu entdecken. Wir glauben, dass jeder Edelstein eine einzigartige Geschichte hat und dass diese Steine mehr als nur Schmuck sind – sie sind Verbindungen zur Natur und zu uns selbst.',
    locale: 'de',
  },
  {
    section: 'values',
    title: 'Unsere Werte',
    content: '',
    locale: 'de',
  },
  {
    section: 'valuesDesc',
    title: null,
    content: 'Bei Gemilike stehen Authentizität, Qualität und Kundenzufriedenheit im Mittelpunkt. Wir legen großen Wert auf ethisch verantwortungsvollen Handel, nachhaltige Praktiken und die Bereitstellung erstklassiger Produkte, die unsere hohen Standards erfüllen.',
    locale: 'de',
  },
  {
    section: 'expertise',
    title: 'Unsere Expertise',
    content: '',
    locale: 'de',
  },
  {
    section: 'expertiseDesc',
    title: null,
    content: 'Unser Team verfügt über jahrelange Erfahrung in der Edelsteinbranche. Wir haben enge Beziehungen zu vertrauenswürdigen Lieferanten auf der ganzen Welt aufgebaut und sind stolz darauf, nur die feinsten Edelsteine anzubieten, die alle unsere strengen Qualitätsprüfungen bestehen.',
    locale: 'de',
  },
  {
    section: 'quality',
    title: 'Qualitätsgarantie',
    content: '',
    locale: 'de',
  },
  {
    section: 'qualityDesc',
    title: null,
    content: 'Jeder Edelstein, den wir anbieten, wird sorgfältig geprüft, um seine Authentizität, Qualität und Schönheit sicherzustellen. Wir bieten detaillierte Zertifikate für jeden unserer Edelsteine und stehen vollständig hinter jedem Produkt, das wir verkaufen.',
    locale: 'de',
  },
];

async function main() {
  console.log('🚀 Starte Initialisierung der rechtsverbindlichen Musterexte...\n');

  // 1. Legal Pages einfügen/aktualisieren
  console.log('📄 Erstelle/aktualisiere rechtliche Seiten...');
  for (const page of legalPages) {
    const existing = await prisma.legalPage.findFirst({
      where: {
        slug: page.slug,
        locale: page.locale,
      },
    });

    if (existing) {
      await prisma.legalPage.update({
        where: { id: existing.id },
        data: {
          title: page.title,
          content: page.content,
          isActive: true,
        },
      });
      console.log(`  ✓ Aktualisiert: ${page.title} (${page.slug})`);
    } else {
      await prisma.legalPage.create({
        data: page,
      });
      console.log(`  ✓ Erstellt: ${page.title} (${page.slug})`);
    }
  }

  // 2. About Content einfügen/aktualisieren
  console.log('\n📝 Erstelle/aktualisiere "Wer sind wir" Inhalte...');
  for (const content of aboutContent) {
    const existing = await prisma.aboutContent.findFirst({
      where: {
        section: content.section,
        locale: content.locale,
      },
    });

    if (existing) {
      await prisma.aboutContent.update({
        where: { id: existing.id },
        data: {
          title: content.title,
          content: content.content,
          isActive: true,
        },
      });
      console.log(`  ✓ Aktualisiert: ${content.section}`);
    } else {
      await prisma.aboutContent.create({
        data: content,
      });
      console.log(`  ✓ Erstellt: ${content.section}`);
    }
  }

  // 3. Standard Services einfügen/aktualisieren (falls noch keine existieren)
  console.log('\n💎 Erstelle/aktualisiere Standard-Services...');
  const services = [
    {
      slug: 'edelsteinberatung',
      title: 'Edelsteinberatung',
      description: 'Persönliche Beratung durch unsere Experten für die perfekte Edelsteinauswahl',
      icon: 'Gem',
      features: ['Individuelle Beratung', 'Zertifizierte Experten', 'Nachhaltige Auswahl'],
      order: 0,
      locale: 'de',
      isActive: true,
    },
    {
      slug: 'zertifizierung',
      title: 'Zertifizierung',
      description: 'Alle unsere Edelsteine werden von unabhängigen Laboren zertifiziert',
      icon: 'Certificate',
      features: ['Unabhängige Prüfung', 'Detaillierte Zertifikate', 'Authentizitätsgarantie'],
      order: 1,
      locale: 'de',
      isActive: true,
    },
    {
      slug: 'versand',
      title: 'Sicherer Versand',
      description: 'Vollversicherter Versand für alle Ihre Edelsteine',
      icon: 'Package',
      features: ['Vollversichert', 'Schnelle Lieferung', 'Sichere Verpackung'],
      order: 2,
      locale: 'de',
      isActive: true,
    },
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: {
        slug: service.slug,
        locale: service.locale,
      },
    });

    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: {
          title: service.title,
          description: service.description,
          icon: service.icon,
          features: service.features,
          order: service.order,
          isActive: service.isActive,
        },
      });
      console.log(`  ✓ Aktualisiert: ${service.title}`);
    } else {
      await prisma.service.create({
        data: service,
      });
      console.log(`  ✓ Erstellt: ${service.title}`);
    }
  }

  console.log('\n✅ Initialisierung abgeschlossen!');
  console.log('\n📋 Übersicht:');
  console.log(`  - ${legalPages.length} rechtliche Seiten`);
  console.log(`  - ${aboutContent.length} About-Content Sektionen`);
  console.log(`  - ${services.length} Services`);
  console.log('\n💡 Hinweis: Bitte passen Sie die Musterexte (insbesondere Kontaktdaten, Adressen) an Ihre tatsächlichen Unternehmensdaten an!');
}

main()
  .catch((e) => {
    console.error('❌ Fehler:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

