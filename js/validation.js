(function(){'use strict';
 function validate(data,model){
  const {num,compute}=window.LH_CALC,res=compute(data),items=[];
  const add=(level,section,message,key='')=>items.push({level,section,message,key});
  function checkRange(a,b,section,label){const low=num(data[a]),high=num(data[b]);if(low!==null&&high!==null&&low>high)add('error',section,`${label}: Minimalwert liegt über dem Maximalwert.`,a);}
  checkRange('oilTempMin','oilTempMax','pressure','Öltemperatur');checkRange('ambientTempMin','ambientTempMax','pressure','Umgebungstemperatur');checkRange('viscosityMin','viscosityMax','service','Ölviskosität');
  for(const section of model.sections)for(const group of section.groups)for(const f of group.fields){
    if(!window.LH_UI?false:!window.LH_UI.isVisible(f,data))continue;
    const raw=data[f.key]; if(raw==null||String(raw).trim()==='')continue;
    if(['number','angle'].includes(f.type)){
       const v=num(raw);
       if(v===null)add('error',section.id,`${f.label}: Zahl nicht lesbar.`,f.key);
       else if((f.min!==null && f.min!==undefined && v<f.min)||(f.max!=null&&v>f.max)||(f.gt!==undefined&&v<=f.gt))add('error',section.id,`${f.label}: außerhalb des zulässigen Wertebereichs.`,f.key);
    }
  }
  const D=num(data.pistonDiameter),rod=num(data.rodDiameter),stroke=num(data.stroke),s=num(data.forceSafety),buck=num(data.bucklingSafety),p=num(data.pressure);
  if(D!==null&&rod!==null&&rod>=D&&data.cylinderType!=='Plungerzylinder')add('error','dimensions','Stangen-Ø muss kleiner als Kolben-Ø sein.','rodDiameter');
  if(data.cylinderType==='Gleichlaufzylinder'&&num(data.oppositeRodDiameter)!==null&&D!==null&&num(data.oppositeRodDiameter)>=D)add('error','dimensions','Zweiter Stangen-Ø muss kleiner als Kolben-Ø sein.','oppositeRodDiameter');
  if(data.cylinderType==='Gleichlaufzylinder'&&rod!==null&&num(data.oppositeRodDiameter)!==null&&rod!==num(data.oppositeRodDiameter))add('warning','cylinder','Ungleiche Stangendurchmesser: Die Wirkflächen sind nicht gleich; Gleichlauf nicht garantiert.');
  if((data.cylinderType||'').includes('Teleskop'))add('warning','cylinder','Teleskopzylinder: für Kräfte, Ölvolumina und Geschwindigkeit fehlen Stufenabmessungen.');
  if(data.cylinderType==='Plungerzylinder'&&rod!==null&&D!==null&&rod!==D)add('info','dimensions','Plunger: der eingegebene Kolben-Ø gilt als hydraulisch wirksamer Plunger-Ø; Stangen-Ø wird rechnerisch ignoriert.');
  if(num(data.sideForce)>0)add('warning','pressure','Querkraft vorhanden: Führungen, Dichtungen und Lager separat nachweisen.');
  if(data.safetyRelevant===true)add('warning','service','Sicherheitsrelevante Anwendung: gesonderte Risikobeurteilung und technische Freigabe erforderlich.');
  if(data.forcePeaks)add('warning','service','Kraftspitzen gewählt: zeitabhängiges Druck- und Lastkollektiv gesondert auslegen.');
  if(data.hasEndCushionRod||data.hasEndCushionBase) {if(num(data.movingMass)===null)add('info','equipment','Für Endlagendämpfung bewegte Masse ergänzen.');}
  if(s===null && (num(data.requiredPush)!==null||num(data.requiredPull)!==null))add('info','pressure','Ohne Kraftsicherheitsfaktor ist kein Sicherheitsabstand zur erforderlichen Kraft berechenbar.');
  if(p!==null&&p>0&&res.supported){
    for(const [requested,actual,label] of [['requiredPushFactored','availablePush','Druckkraft'],['requiredPullFactored','availablePull','Zugkraft']]){
      const need=res[requested],available=res[actual],theoretical=res[actual==='availablePush'?'theoreticalPush':'theoreticalPull'];
      if(need!==null && available!==null && need>available)add('error','pressure',`${label}: erforderliche Kraft × Sicherheitsfaktor überschreitet die angenommene verfügbare Kraft.`);
      else if(need!==null&&available===null&&theoretical!==null&&need>theoretical)add('warning','pressure',`${label}: bereits theoretische Kraft kleiner als erforderliche Auslegungskraft.`);
      else if(need!==null&&available===null)add('info','pressure',`${label}: ohne Wirkungsgradangabe kein Vergleich mit verfügbarer Kraft.`);
    }
  }
  if(stroke!==null&&num(data.installationLength)!==null&&num(data.installationLength)<=0)add('error','dimensions','Einbaumaß muss positiv sein.');
  // Explizite Unvollständigkeiten der Quelle (keine erfundenen Normwerte).
  add('info','summary','Knick-/Festigkeitsnachweis nicht durchgeführt. Dafür sind Einspannung, freie Länge, Materialkennwerte und Lastkollektiv zu klären.');
  add('info','summary','Original-Lastenheft fehlt: Vorzugsdurchmesser, Einbaulagen-Varianten und x/xx/xxx-Bewertungen müssen fachlich abgeglichen werden.');
  return {items,results:res,errors:items.filter(i=>i.level==='error'),warnings:items.filter(i=>i.level==='warning'),infos:items.filter(i=>i.level==='info')};
 }
 window.LH_VALIDATE={validate};
})();
