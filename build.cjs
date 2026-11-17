// Erzeugt die Windows-Einzeldatei aus index.html (einzige Quelldatei) und prüft die Versionsangaben.
const fs=require('fs'),path=require('path');
const dir=__dirname, html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const v=(html.match(/const APP_VERSION = '([\d.]+)'/)||[])[1];
if(!v)throw Error('APP_VERSION nicht gefunden');
const target=`AbleitCheck_V${v.replace('.','_')}.html`;
for(const f of fs.readdirSync(dir))if(/^AbleitCheck_V[\d_]+\.html$/.test(f)&&f!==target)fs.unlinkSync(path.join(dir,f));
fs.writeFileSync(path.join(dir,target),html);
const check={'manifest.webmanifest':`V${v}`,'sw.js':target,'Arbeitshilfen.html':`ABLEITCHECK ${v}`};
for(const [f,needle] of Object.entries(check))if(!fs.readFileSync(path.join(dir,f),'utf8').includes(needle))throw Error(`${f}: Version ${v} fehlt`);
// Keine abweichende Versionsnummer im sichtbaren Text (z. B. Kopfzeile)
const stale=[...html.matchAll(/AbleitCheck (\d+\.\d+)/g)].map(m=>m[1]).filter(x=>x!==v);
if(stale.length)throw Error('index.html enthält alte Versionsnummer(n): '+[...new Set(stale)].join(', '));
console.log('Erzeugt:',target);
