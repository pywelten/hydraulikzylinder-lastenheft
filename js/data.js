/* Hydraulikzylinder-Lastenheft · Schema 1.0
   Felder und Optionen nach vorliegendem Projektauftrag. Das achtseitige Original-
   Word-Dokument lag bei Erstellung nicht vor: keine erfundenen Standardwerte. */
(function () {
'use strict';
const o = (value,label) => ({value,label});
const opt = (...labels) => labels.map(v => o(v,v));
const f = (key,label,type='text',more={}) => ({key,label,type,...more});
const n = (key,label,unit,more={}) => f(key,label,'number',{unit,min:0,...more});
const sel = (key,label,options,more={}) => f(key,label,'select',{options,...more});
const tog = (key,label,more={}) => f(key,label,'toggle',more);
const noteSource = 'Quelle: beigefügter Projektauftrag; fachliche Details und Standardwerte des achtseitigen Originals noch abzugleichen.';
window.LH_DATA = {
 schemaVersion:1, appVersion:'1.0.0', title:'Lastenheft für Zylinderanfragen',
 sourceNote:noteSource,
 cylinderTypes:[
  {value:'Einfachwirkender Differentialzylinder',short:'Einfachwirkend',desc:'Hydraulisch nur in einer Richtung wirksam. Rückhub durch äußere Kraft.',symbol:'assets/illustrations/cyl-ew-diff.png'},
  {value:'Doppeltwirkender Differentialzylinder',short:'Differential',desc:'Druck- und Ringraum hydraulisch beaufschlagbar.',symbol:'assets/illustrations/cyl-dw-diff.png'},
  {value:'Gleichlaufzylinder',short:'Gleichlauf',desc:'Beidseitige Kolbenstange; gleiche Wirkflächen nur bei gleichen Stangendurchmessern.',symbol:'assets/illustrations/cyl-gleichlauf.png'},
  {value:'Plungerzylinder',short:'Plunger',desc:'Eine hydraulisch wirksame Fläche; Rücklauf durch äußere Last.',symbol:'assets/illustrations/cyl-plunger.png'},
  {value:'Einfachwirkender Teleskopzylinder',short:'Teleskop, EW',desc:'Mehrstufig; vollständige Stufenabmessungen für Berechnungen erforderlich.',symbol:'assets/illustrations/cyl-teleskop-ew.png'},
  {value:'Doppeltwirkender Teleskopzylinder',short:'Teleskop, DW',desc:'Mehrstufig; vollständige Stufenabmessungen für Berechnungen erforderlich.',symbol:'assets/illustrations/cyl-teleskop-dw.png'}
 ],
 mountsRod:['Nicht festgelegt','Gewinde','Schwenkauge','Gelenklager – verstemmt','Gelenklager – Sicherungsring','Gabelkopf','Sonstige Ausführung'],
 mountsBase:['Nicht festgelegt','Schwenkauge','Gelenklager – verstemmt','Gelenklager – Sicherungsring','Schwenklasche','Schwenkgabel','Schwenkzapfen','Sonstige Ausführung'],
 sections:[
  {id:'pressure',label:'Kräfte & Drücke',icon:'◫',desc:'Betriebsparameter und erforderliche Kräfte',groups:[
   {title:'Hydraulische Betriebswerte',fields:[n('pressure','Systemdruck','bar',{required:true,gt:0,tip:'Eingegebener Arbeitsdruck; nicht mit einem nachgewiesenen zulässigen Maximaldruck gleichzusetzen.'}),n('outSpeed','Hubgeschwindigkeit Ausfahren','m/s'),n('inSpeed','Hubgeschwindigkeit Einfahren','m/s'),sel('fluid','Druckflüssigkeit',opt('Mineralöl','Wasser-Glykol','Biologisch abbaubare Flüssigkeit','Sonstige'),{allowOther:true}),f('fluidOther','Andere Druckflüssigkeit','text',{showIf:{key:'fluid',equals:'Sonstige'}}),f('cleanliness','Ölreinheitsklasse'),n('oilTempMin','Öltemperatur min.','°C',{min:null}),n('oilTempMax','Öltemperatur max.','°C',{min:null}),n('ambientTempMin','Umgebungstemperatur min.','°C',{min:null}),n('ambientTempMax','Umgebungstemperatur max.','°C',{min:null})]},
   {title:'Kräfte und Auslegung',fields:[n('requiredPush','Erforderliche Druckkraft','N'),n('requiredPull','Erforderliche Zugkraft','N'),n('sideForce','Querkraft','N'),n('forceSafety','Kraftsicherheitsfaktor','–',{gt:0,tip:'Erforderliche Kraft × Sicherheitsfaktor. Keine automatische Normannahme.'}),n('bucklingSafety','Knicksicherheitsfaktor','–',{gt:0}),n('efficiency','Angenommener mechanischer Wirkungsgrad','%',{max:100,gt:0,tip:'Nur bei expliziter Eingabe wird eine verfügbare Kraft berechnet. Die Annahme ist zu verifizieren.'})]}
  ]},
  {id:'cylinder',label:'Zylinderart & Lage',icon:'⬡',desc:'Ausführung und Einbauposition',groups:[
   {title:'Hydraulikzylinder-Typ',fields:[sel('cylinderType','Zylinderart',[],{type:'cards',required:true,cardKind:'cylinder'})]},
   {title:'Einbaulage',fields:[sel('orientation','Einbaulage',opt('Horizontal','Vertikal – Kolbenstange nach oben','Vertikal – Kolbenstange nach unten','Geneigt','Andere Einbaulage'),{required:true,type:'cards',cardKind:'orientation'}),n('inclination','Neigungswinkel zur Horizontalen','°',{max:360,showIf:{key:'orientation',equals:'Geneigt'}}),f('orientationNotes','Hinweise zur Einbaulage','textarea')]}
  ]},
  {id:'dimensions',label:'Abmessungen',icon:'⊞',desc:'Zylindergeometrie und dynamische Zeichnung',groups:[
   {title:'Hauptabmessungen',fields:[n('stroke','Hub','mm',{required:true,gt:0}),n('pistonDiameter','Kolbendurchmesser','mm',{required:true,gt:0}),n('rodDiameter','Kolbenstangendurchmesser','mm',{required:true,gt:0}),n('oppositeRodDiameter','Zweite Kolbenstange Ø','mm',{gt:0,showIf:{key:'cylinderType',equals:'Gleichlaufzylinder'}}),n('installationLength','Einbaumaß (eingefahren)','mm'),n('barrelLength','Zylinderkörperlänge','mm'),n('rodProjection','Stangenüberstand eingefahren','mm'),f('dimensionNotes','Zusätzliche Maße / Hinweise','textarea')]}
  ]},
  {id:'ports',label:'Hydraulikanschlüsse',icon:'⏣',desc:'Gewinde, Positionen und Winkelansicht',groups:[
   {title:'Anschlüsse',fields:[sel('portRod','Anschlussgewinde Stangenseite',opt('M18×1,5 (15L)','M16×1,5 (12L)','M14×1,5 (10L)','M12×1,5 (8L)','Anderes Gewinde')),f('portRodCustom','Andere Gewindebezeichnung', 'text',{showIf:{key:'portRod',equals:'Anderes Gewinde'}}),sel('portBase','Anschlussgewinde Bodenseite',opt('M18×1,5 (15L)','M16×1,5 (12L)','M14×1,5 (10L)','M12×1,5 (8L)','Anderes Gewinde')),f('portBaseCustom','Andere Gewindebezeichnung','text',{showIf:{key:'portBase',equals:'Anderes Gewinde'}}),f('portsNotes','Anschlussdetails / Verschraubungen','textarea')]},
   {title:'Winkel zur Bodenaufnahme',fields:[n('portRodAngle','Anschlussposition Stangenseite','°',{type:'angle',min:0,max:360}),n('portBaseAngle','Anschlussposition Bodenseite','°',{type:'angle',min:0,max:360}),n('baseBoreAngle','Lage der Anschlussbohrungen zur Bodenaufnahme','°',{type:'angle',min:0,max:360})]}
  ]},
  {id:'rodmount',label:'Befestigung Stange',icon:'⌁',desc:'Stangenseitige Befestigungsart',groups:[
   {title:'Befestigung stangenseitig',fields:[sel('rodMount','Ausführung',[],{type:'cards',cardKind:'mountRod',required:true}),f('rodMountDimension','Gewinde-/Bolzen-/Anschlussmaß'),f('rodMountTolerance','Passung / Toleranz'),f('rodMountNotes','Hinweise zur Herstellung / Ausführung','textarea')]}
  ]},
  {id:'basemount',label:'Befestigung Boden',icon:'⌬',desc:'Bodenseitige Befestigungsart',groups:[
   {title:'Befestigung bodenseitig',fields:[sel('baseMount','Ausführung',[],{type:'cards',cardKind:'mountBase',required:true}),f('baseMountDimension','Bohrungs-/Bolzen-/Anschlussmaß'),f('baseMountTolerance','Passung / Toleranz'),f('baseMountNotes','Hinweise zur Herstellung / Ausführung','textarea')]}
  ]},
  {id:'equipment',label:'Technische Ausstattung',icon:'⚙',desc:'Messung, Dämpfung und hydraulische Zusatzfunktionen',groups:[
   {title:'Erfassung und Steuerung',fields:[tog('hasLockBlock','Sperrblock'),tog('hasTravelSensor','Wegmesssystem'),sel('travelSignal','Signal des Wegmesssystems',opt('0,25–4,75 V','4–20 mA','Anderes Signal'),{showIf:{key:'hasTravelSensor',truthy:true}}),f('travelSignalOther','Signalbeschreibung','text',{showIf:{key:'travelSignal',equals:'Anderes Signal',also:{key:'hasTravelSensor',truthy:true}}}),tog('hasEndCushionRod','Endlagendämpfung stangenseitig'),tog('hasEndCushionBase','Endlagendämpfung bodenseitig'),n('movingMass','Bewegte Masse','kg',{showIf:{any:[{key:'hasEndCushionRod',truthy:true},{key:'hasEndCushionBase',truthy:true}]}}),f('equipmentNotes','Ausstattungsdetails','textarea')]}
  ]},
  {id:'extras',label:'Sonderausstattung',icon:'✦',desc:'Ventile, Sicherheitseinrichtungen und optionale Komponenten',groups:[
   {title:'Ventile und Zusatzfunktionen',fields:[tog('hasFlushRod','Spülventil stangenseitig'),tog('hasFlushBase','Spülventil bodenseitig'),tog('hasLoadHoldingRod','Lasthalteventil stangenseitig'),tog('hasLoadHoldingBase','Lasthalteventil bodenseitig'),tog('hasHoseProtection','Rohrbruchsicherung'),tog('hasOvercenterRod','Senkbremsventil stangenseitig'),tog('hasOvercenterBase','Senkbremsventil bodenseitig'),tog('hasNozzleRod','Düse stangenseitig'),tog('hasNozzleBase','Düse bodenseitig'),f('extrasNotes','Weitere Sonderausstattung','textarea')]}
  ]},
  {id:'service',label:'Einsatz & Lebensdauer',icon:'◷',desc:'Projektstammdaten, Lastkollektiv und Einsatzbedingungen',groups:[
   {title:'Anfragedaten',fields:[f('requestNumber','Anfragenummer','text',{required:true}),f('contact','Ansprechpartner'),f('machine','Maschine','text',{required:true}),f('assembly','Baugruppe'),f('articleNumber','Artikelnummer'),f('cylinderLabel','Zylinderbezeichnung'),f('taskDescription','Beschreibung der Aufgabe','textarea')]},
   {title:'Betrieb und Lasten',fields:[sel('operatingMode','Betriebsart',opt('Kontinuierlich','Intermittierend','Selten betätigt','Andere')),tog('alternatingLoads','Wechselnde Lasten'),tog('forcePeaks','Kraftspitzen'),tog('floatPosition','Schwimmstellung'),tog('simplePositioner','Einfacher Stellzylinder'),tog('lightweight','Leichtbauzylinder'),tog('safetyRelevant','Sicherheitsrelevanter Zylinder'),sel('parkingPosition','Parkposition',opt('Eingefahren','Ausgefahren','Variabel')),n('strokesPerHour','Hübe pro Stunde','1/h'),n('hoursPerDay','Arbeitsstunden pro Tag','h',{max:24}),n('daysPerYear','Einsatztage pro Jahr','d',{max:366}),n('expectedLife','Erwartete Lebensdauer','Jahre'),n('leakageAllowed','Zulässige interne Leckage','cm³/min'),n('viscosityMin','Ölviskosität min.','mm²/s'),n('viscosityMax','Ölviskosität max.','mm²/s'),f('serviceNotes','Einsatz- und Wartungshinweise','textarea')]}
  ]},
  {id:'surface',label:'Oberflächenschutz',icon:'◈',desc:'Beschichtung und äußere Beanspruchung',groups:[
   {title:'Ausführung',fields:[f('cylinderColor','Zylinderfarbe / RAL'),f('surfaceTreatment','Oberflächenbehandlung'),sel('rodType','Kolbenstangentyp',opt('Verchromt','Induktiv gehärtet und verchromt','Edelstahl','Anderer Typ')),f('rodTypeCustom','Kolbenstangenausführung','text',{showIf:{key:'rodType',equals:'Anderer Typ'}})]},
   {title:'Umwelteinflüsse',fields:[tog('corrosion','Erhöhte Korrosionsanforderungen'),tog('chemicals','Chemische Belastung'),tog('stoneImpact','Steinschlag'),tog('specialEnvironment','Weitere besondere Umwelteinflüsse'),f('environmentNotes','Beschreibung der Umwelteinflüsse','textarea'),f('specialRequirements','Zusätzliche Anforderungen','textarea')]}
  ]},
  {id:'summary',label:'Ergebnisse & Prüfung',icon:'✓',desc:'Technische Kennwerte, Prüfhinweise und Anfrageprotokoll',groups:[]}
 ]
};
// Korrektur typisierter Stammdatenfelder: bei diesen Feldern ist das dritte Argument stets der Typ.
for (const s of window.LH_DATA.sections) for (const g of s.groups) for (const field of g.fields) {
 if (typeof field.type !== 'string') field.type='text';
}
})();
