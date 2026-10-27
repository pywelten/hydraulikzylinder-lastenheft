(function(){'use strict';
const DRAFT='lhz.draft.v1',SAVED='lhz.saved.v1';
const clone=x=>JSON.parse(JSON.stringify(x));
const create=()=>({schemaVersion:1,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),values:{},name:''});
function normalize(obj){if(!obj||typeof obj!=='object'||obj.schemaVersion!==1||typeof obj.values!=='object'||obj.values===null||Array.isArray(obj.values))throw Error('Datei enthält kein unterstütztes Lastenheft (Schema 1).');let safe=create();safe.createdAt=typeof obj.createdAt==='string'?obj.createdAt:safe.createdAt;safe.name=typeof obj.name==='string'?obj.name.slice(0,100):'';for(const [k,v] of Object.entries(obj.values)){if(!/^[a-zA-Z][\w]{0,70}$/.test(k))continue;if(typeof v==='string')safe.values[k]=v.slice(0,4000);else if(typeof v==='boolean')safe.values[k]=v;else if(typeof v==='number'&&Number.isFinite(v))safe.values[k]=v;}return safe;}
function loadDraft(){try{const x=localStorage.getItem(DRAFT);return x?normalize(JSON.parse(x)):null;}catch(e){return null;}}
function autosave(doc){try{doc.updatedAt=new Date().toISOString();localStorage.setItem(DRAFT,JSON.stringify(doc));return true;}catch(e){return false;}}
function savedList(){try{const a=JSON.parse(localStorage.getItem(SAVED)||'[]');return Array.isArray(a)?a.map(x=>({id:x.id,name:x.name,updatedAt:x.updatedAt})):[];}catch(e){return [];}}
function saveNamed(doc,name){let a;try{a=JSON.parse(localStorage.getItem(SAVED)||'[]');if(!Array.isArray(a))a=[];}catch(e){a=[];}const id=(globalThis.crypto&&crypto.randomUUID)?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(36).slice(2);const copy=clone(normalize(doc));copy.name=String(name).slice(0,100);copy.updatedAt=new Date().toISOString();a.unshift({id,...copy});try{localStorage.setItem(SAVED,JSON.stringify(a));return id;}catch(e){throw Error('Speicher voll oder im Browser nicht verfügbar. Bitte JSON exportieren.');}}
function loadNamed(id){try{const a=JSON.parse(localStorage.getItem(SAVED)||'[]');const x=a.find(x=>x.id===id);return x?normalize(x):null;}catch(e){return null;}}
function removeNamed(id){const a=JSON.parse(localStorage.getItem(SAVED)||'[]');localStorage.setItem(SAVED,JSON.stringify(a.filter(x=>x.id!==id)));}
function clearDraft(){try{localStorage.removeItem(DRAFT);}catch(e){}}
window.LH_STORAGE={create,normalize,loadDraft,autosave,savedList,saveNamed,loadNamed,removeNamed,clearDraft};
})();
