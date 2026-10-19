import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {parts} from './data/parts';
test('all ten workshop parts have introductory text and valid self-contained illustrations',()=>{
 assert.equal(parts.length,10);assert.equal(new Set(parts.map(p=>p.id)).size,10);assert.equal(parts.filter(p=>p.group==='input').length,7);assert.equal(parts.filter(p=>p.group==='output').length,3);
 for(const part of parts){assert.ok(part.name&&part.boardLabel&&part.description);const svg=readFileSync(new URL(`../public/parts/${part.image}`,import.meta.url),'utf8');const dom=new JSDOM(svg,{contentType:'image/svg+xml'});try{assert.equal(dom.window.document.documentElement.localName,'svg');assert.ok(dom.window.document.documentElement.getAttribute('viewBox'));assert.equal(dom.window.document.querySelectorAll('script,image').length,0);}finally{dom.window.close();}}
});

test('board markings match the supplied lettering and Slope uses the whole board',()=>{
 assert.deepEqual(parts.map(p=>p.boardLabel).sort(),['Slope','Switch','PotentioMeter','Microphone','Distance','Buzzer','LED','Temperature','Vibration','CdS'].sort());
 assert.equal(parts.some(p=>p.boardLabel==='Spare'),false);assert.match(parts.find(p=>p.id==='tilt')!.description,/基板ごと傾け/);assert.match(parts.find(p=>p.id==='temperature')!.description,/センサを指でつまんでみましょう/);
 for(const part of parts){assert.ok(part.description.split('。').filter(sentence=>sentence.trim()).length>=2);assert.equal('example' in part,false);}
});
