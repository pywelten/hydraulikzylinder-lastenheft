# Hydraulikzylinder-Lastenheft

**Version 1.0.0 · Stand: 27.10.2026 · Datenschema: 1**

Professionelle, deutschsprachige und rein clientseitige Webanwendung zum Erfassen,
Konfigurieren und Dokumentieren technischer Anfragen für Hydraulikzylinder.

## Projektstand und wesentlicher Quellenhinweis

Diese Version implementiert die im bereitgestellten *Projektauftrag* benannten
Felder, Optionen, Berechnungen und Bedienfunktionen. **Das im Auftrag erwähnte
achtseitige Word-Dokument „Lastenheft Hydraulikzylinder.docx“ lag bei Erstellung
nicht vor**. Deshalb konnten nicht verifiziert oder vollständig übernommen werden:

- vollständige Auswahlzeichnungen sowie Einbaulagen aus dem Original,
- originale Durchmesser-Vorzugsreihen und individuelle Kombinationstabellen,
- originale x/xx/xxx-Bewertungen von Funktion, Fertigung und Kosten,
- sämtliche Standardwerte, Toleranzhinweise und tabellarischen Sonderbedingungen.

Die verwendeten SVG-Grafiken sind eigens erstellte Schemata. Bei einem
späteren Quellenabgleich müssen die offenen Punkte ergänzt bzw. überprüft werden.
Bisherige Auswahlzuordnungen sind vor einer Beschaffung fachlich zu prüfen.

## Funktionen

- 11 Bereiche mit Suchnavigation, Abschnittsstatus und Fortschrittsanzeige
- Zylinderarten: einfach- und doppeltwirkender Differentialzylinder, Gleichlauf,
  Plunger, einfach- und doppeltwirkender Teleskopzylinder
- Geometrie, Druck, Kräfte, Geschwindigkeiten, Volumina und Volumenströme
- Getrennte Befestigungen und Anschlussparameter, Winkelkreis 0–360°
- Bedingte Eingaben für Wegmessung, Dämpfung, Signale und Sonderausstattung
- Selbst erzeugte technische SVG-Zeichnung mit eingefahrener/ausgefahrener Stellung
- Technische Vorprüfung und Vergleich von berechneten und geforderten Kräften
- Aufklappbare Formelsammlung mit Zwischenergebnissen
- Lokales automatisches Zwischenspeichern, manuelle Speicherstände, neue Anfrage,
  Duplizieren, Teil-Zurücksetzen, JSON-Import und -Export
- DIN-A4-optimiertes Anfrageprotokoll mit Browser-PDF-Ausgabe und Freigabefeldern
- Keine Cookies, Tracker, externen Fonts, Server oder API-Aufrufe

## Benutzung

Öffne `index.html` direkt in einem aktuellen Browser, oder veröffentliche den
Ordner auf GitHub Pages. Alle Dateien nutzen relative Pfade. Eingaben mit Komma
und Punkt werden akzeptiert. Navigiere links oder über Zurück/Weiter. Nutze die
Leiste am unteren Rand zum Speichern, Export, Import und Erstellen weiterer Anfragen.

**Wichtig:** Browser-Speicherstände liegen nur lokal im Browserprofil auf dem
jeweiligen Gerät. Sie werden **nicht** automatisch synchronisiert und können
beim Löschen der Browserdaten verloren gehen. Erstelle für eine sichere Übergabe
oder Archivierung regelmäßig JSON-Exporte.

## GitHub Pages kostenlos veröffentlichen

1. Auf GitHub ein **öffentliches** Repository namens `hydraulikzylinder-lastenheft` erstellen.
2. Den **Inhalt** dieses Projektordners (inkl. `index.html`, `js/`, `css/` und
   `.nojekyll`) in das **Hauptverzeichnis** des Repositories hochladen.
3. Unter **Settings → Pages → Build and deployment** die Option
   **Deploy from a branch**, Branch `main` und Verzeichnis `/ (root)` wählen.
4. Nach dem Deployment erscheint die URL nach dem Schema
   `https://BENUTZERNAME.github.io/hydraulikzylinder-lastenheft/`.
5. Webseite im Browser aufrufen; Einstellungen und Speicherung testen.

Das ist ein URL-Schema, keine Behauptung einer erfolgten Veröffentlichung.
Die GitHub-Veröffentlichung ist standardmäßig öffentlich. Deshalb bitte keine
vertraulichen Anfragedaten in die Quelldateien oder Repository-Commits schreiben.

## Berechnungsgrundlagen

Für vollständig eingegebene Zylindergeometrien:

- Kolbenfläche A = π · D² / 4 (mm²)
- Ringfläche A = π · (D² − d²) / 4 (mm²)
- Theoretische Kraft F = p (bar) · A (mm²) · 0,1 (N)
- Verfügbare Kraft Fᵥ = Fₜ · η/100, **nur falls η angegeben wurde**
- Auslegungskraft Fₐᵤₛ = erforderliche Kraft · eingegebener Sicherheitsfaktor
- Ölvolumen V = A (mm²) · H (mm) / 10⁶ (L)
- Volumenstrom Q = 0,06 · A (mm²) · v (m/s) (L/min)
- Hydraulische Leistung P = p (bar) · Q (L/min) / 600 (kW)

Bei Gleichlaufzylindern können zwei unterschiedliche Stangendurchmesser
berücksichtigt werden; bei einer Abweichung erfolgt ein Hinweis.
Für einfachwirkende Zylinder wird **keine** hydraulische Zugkraft berechnet.
Für Plungerzylinder ist „Kolbendurchmesser“ als hydraulisch wirksamer
Plungerdurchmesser zu verstehen. Teleskopzylinder erfordern Stufendaten und
werden ohne sie bewusst nicht mit pauschalen Flächen/Kräften bewertet.

Die Aussage „verfügbar“ beruht auf einem **angenommenen mechanischen
Wirkungsgrad**; Druckverluste, Reibungsänderungen, Dynamik, Stabilität,
thermische und hydraulische Verluste sind damit nicht vollständig erfasst.
Aus einem eingegebenen Sicherheitsfaktor folgt **keine** geprüfte Sicherheit.
Keine automatische Knickkraftberechnung: für einen belastbaren Knick- und
Festigkeitsnachweis werden Werkstoff-, Lagerungs-, Geometrie- und Lastdaten
sowie eine normgerechte Methodik benötigt.

## Grenzen

Diese Software erstellt **keine freigegebene technische Konstruktion** und
ersetzt weder Lastenheft-Abstimmung noch Herstellerfreigabe, Risikoanalyse,
Normprüfung oder Sicherheitsnachweise. Winkel null = oben, positive Winkel im
Uhrzeigersinn sind eine **zu bestätigende Zeichenkonvention**, nicht eine aus
dem Original nachgewiesene Referenz.

Browserspezifische Druckoptionen: In modernen Chrome-/Edge-Versionen wird A4
mit automatischem Seitenumbruch und CSS-Seitenzählern verwendet. Falls der
Druckdialog die Seitenzahlen nicht anzeigt, im Druckdialog Kopf-/Fußzeilen aktivieren.

## Technik und Dateistruktur

```
index.html
css/style.css
css/print.css
js/data.js
js/calculations.js
js/validation.js
js/storage.js
js/app.js
assets/illustrations/favicon.svg
.nojekyll
README.md
LICENSE
```

Keine Package-Installation, kein Bundler, keine Datenbank, keine API-Schlüssel.
Die Anwendung funktioniert auch direkt per `file://` im Browser.

## Qualitätsprüfung / Tests

Mit `node tests/calculations.test.js` werden die Berechnungen und Validierungen
ohne zusätzliche Abhängigkeiten geprüft. Die UI kann mit einem modernen Browser
manuell oder über einen Headless-Browser überprüft werden.

## Versionshistorie

- **1.0.0 / 27.10.2026:** Erste ausführbare statische Version; Formular,
  Formeln, grafische Auswahl, SVG-Zeichnung, Browser-Speicherung und PDF-Protokoll.

## Mögliche Erweiterungen

- Originalgetreuer Quellenabgleich nach Bereitstellung des Word-Lastenhefts
- Durchmesser-Vorzugsreihen mit Quellbezug und individuell definierbaren Tabellen
- Geführte Auswahl korrekter Lagerungsfälle und Knick-/Lebensdauernachweise
- Geometrievarianten und detaillierte 2D-Maßzeichnungen
- Revisionsvergleich und Freigabeworkflow
