(function(){'use strict';
 const PI=Math.PI;
 function num(v){if(v===undefined||v===null||String(v).trim()==='')return null;let s=String(v).trim().replace(/\s/g,'');if(s.includes(',')&&s.includes('.')){s=s.lastIndexOf(',')>s.lastIndexOf('.')?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'');}else s=s.replace(',','.');if(!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(s))return null;const r=Number(s);return Number.isFinite(r)?r:null;}
 const safePos=x=>x!==null&&x>0;
 function compute(d){
  const p=num(d.pressure),D=num(d.pistonDiameter),rod=num(d.rodDiameter),stroke=num(d.stroke),vOut=num(d.outSpeed),vIn=num(d.inSpeed),eta=num(d.efficiency),sf=num(d.forceSafety),second=num(d.oppositeRodDiameter),type=d.cylinderType||'';
  const res={supported:false,kind:'',formulas:[],theoreticalPush:null,theoreticalPull:null,availablePush:null,availablePull:null,pressure:p,forceFactor:sf,rodArea:null,areaPush:null,areaPull:null,oilOut:null,oilIn:null,flowOut:null,flowIn:null,areaRatio:null,speedRatio:null,speedRatioEqualFlow:null,requiredPushFactored:null,requiredPullFactored:null,hydraulicPowerOut:null,hydraulicPowerIn:null};
  const diff=type==='Doppeltwirkender Differentialzylinder',single=type==='Einfachwirkender Differentialzylinder',equal=type==='Gleichlaufzylinder',plunger=type==='Plungerzylinder';
  if(!diff&&!single&&!equal&&!plunger){res.reason=type.includes('Teleskop')?'Für Teleskopzylinder fehlen die Stufendaten; keine pauschalen Kräfte oder Volumina.':'Zylinderart wählen.';return res;}
  res.kind=equal?'doubleRod':plunger?'plunger':single?'single':'differential';
  if(!safePos(D)||(!plunger&&!safePos(rod))){res.reason='Für Flächen und Kräfte gültige Wirkdurchmesser eingeben.';return res;}
  if(rod>=D && !plunger){res.reason='Die Kolbenstange muss kleiner als der Kolbendurchmesser sein.';return res;}
  if(equal && (!safePos(second)||second>=D)){res.reason='Für den Gleichlaufzylinder zweite Kolbenstange gültig angeben.';return res;}
  const Ap=PI*D*D/4,Ar=safePos(rod)?PI*rod*rod/4:null;
  // Für Plungerzylinder: D ist wirksamer Plungerdurchmesser; es gibt keinen Ringraum.
  const Aout=plunger?Ap:(equal?Ap-Ar:Ap),Ain=equal?Ap-PI*second*second/4:diff?Ap-Ar:null;
  Object.assign(res,{supported:true,pistonArea:Ap,rodArea:Ar,areaPush:Aout,areaPull:Ain,oilOut:safePos(stroke)?Aout*stroke/1e6:null,oilIn:Ain!==null&&safePos(stroke)?Ain*stroke/1e6:null,flowOut:vOut!==null&&vOut>=0?Aout*vOut*.06:null,flowIn:Ain!==null&&vIn!==null&&vIn>=0?Ain*vIn*.06:null,areaRatio:Ain!==null?Aout/Ain:null,speedRatio:Ain!==null?(safePos(vOut)&&safePos(vIn)?vOut/vIn:Ain/Aout):null,speedRatioEqualFlow:Ain!==null?Ain/Aout:null});
  if(safePos(p)){
   // bar × 0.1 = N/mm²
   res.theoreticalPush=p*.1*Aout;
   if(Ain!==null)res.theoreticalPull=p*.1*Ain;
   if(safePos(eta)&&eta<=100){res.availablePush=res.theoreticalPush*eta/100;res.availablePull=res.theoreticalPull===null?null:res.theoreticalPull*eta/100;}
   res.hydraulicPowerOut=res.flowOut!==null?p*res.flowOut/600:null;
   res.hydraulicPowerIn=res.flowIn!==null?p*res.flowIn/600:null;
  }
  const rqPush=num(d.requiredPush),rqPull=num(d.requiredPull);
  if(rqPush!==null && sf!==null && sf>0)res.requiredPushFactored=rqPush*sf;
  if(rqPull!==null && sf!==null && sf>0)res.requiredPullFactored=rqPull*sf;
  res.formulas=[
   {name:'Kolbenfläche',formula:'Aₖ = π · D² / 4',value:Ap,unit:'mm²'},
   {name:'Wirkfläche Ausfahren',formula:equal?'Aₐ = π · (D² − d₁²) / 4':plunger?'Aₐ = π · D² / 4':'Aₐ = π · D² / 4',value:Aout,unit:'mm²'},
   ...(Ain===null?[]:[{name:'Wirkfläche Einfahren',formula:equal?'Aₑ = π · (D² − d₂²) / 4':'Aₑ = π · (D² − d₁²) / 4',value:Ain,unit:'mm²'}]),
   ...(res.oilOut===null?[]:[{name:'Ölvolumen Ausfahren',formula:'Vₐ [L] = Aₐ [mm²] · H [mm] / 10⁶',value:res.oilOut,unit:'L'}]),
   ...(res.oilIn===null?[]:[{name:'Ölvolumen Einfahren',formula:'Vₑ [L] = Aₑ [mm²] · H [mm] / 10⁶',value:res.oilIn,unit:'L'}]),
   ...(res.theoreticalPush===null?[]:[{name:'Theoretische Druckkraft',formula:'Fₐ [N] = p [bar] · 0,1 · Aₐ [mm²]',value:res.theoreticalPush,unit:'N'}]),
   ...(res.theoreticalPull===null?[]:[{name:'Theoretische Zugkraft',formula:'Fₑ [N] = p [bar] · 0,1 · Aₑ [mm²]',value:res.theoreticalPull,unit:'N'}]),
   ...(res.flowOut===null?[]:[{name:'Volumenstrom Ausfahren',formula:'Qₐ [L/min] = 0,06 · Aₐ [mm²] · vₐ [m/s]',value:res.flowOut,unit:'L/min'}]),
   ...(res.flowIn===null?[]:[{name:'Volumenstrom Einfahren',formula:'Qₑ [L/min] = 0,06 · Aₑ [mm²] · vₑ [m/s]',value:res.flowIn,unit:'L/min'}]),
   ...(res.availablePush===null?[]:[{name:'Verfügbare Druckkraft (Annahme)',formula:'Fᵥ = Fₜ · η / 100',value:res.availablePush,unit:'N'}]),
   ...(res.requiredPushFactored===null?[]:[{name:'Auslegungs-Druckkraft',formula:'Fₐᵤₛ = Fᵣ · S',value:res.requiredPushFactored,unit:'N'}])
  ];
  return res;
 }
 function format(v,digits=2){if(v===null||v===undefined||!Number.isFinite(v))return '—';return new Intl.NumberFormat('de-DE',{maximumFractionDigits:digits}).format(v);}
 window.LH_CALC={num,compute,format};
})();
