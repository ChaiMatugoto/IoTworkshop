import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { issues } from './data/issues';
import { residentStories } from './data/residents';

test('all issues have resident stories; dialogue leads to an inline password control without replay controls',async()=>{
 for(const issue of issues){const story=residentStories[issue.id];assert.ok(story?.name&&story.request&&story.goal);assert.equal(story.lines.length,3);}
 const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost/'});
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
 Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
 const {createElement,act}=await import('react');const {createRoot}=await import('react-dom/client');const {IssuePanel}=await import('./components/IssuePanel');
 const root=createRoot(document.getElementById('root')!);let redeems=0;
 try{
  await act(async()=>root.render(createElement(IssuePanel,{issue:issues[1],completed:false,onClose:()=>{},onRedeem:async()=>{redeems++;return true;}})));
  assert.match(document.body.textContent!,/帰りが遅くなると/);assert.equal(document.querySelector('form'),null);
  for(let i=0;i<3;i++)await act(async()=>document.querySelector<HTMLButtonElement>('.resident-dialogue-footer button')!.click());
  assert.equal(document.querySelector('.resident-goal'),null);assert.match(document.querySelector('.resident-request')!.textContent!,/帰りが遅くなると/);
  assert.equal(document.querySelector('form'),null);assert.equal(redeems,0);assert.equal(document.querySelector('.issue-parts'),null);
  await act(async()=>document.querySelector<HTMLButtonElement>('.completion-start')!.click());
  const input=document.querySelector<HTMLInputElement>('#issue-password')!;assert.equal(document.activeElement,input);assert.ok(input.closest('.completion-input-slot'));
  await act(async()=>document.querySelector<HTMLButtonElement>('.password-cancel')!.click());assert.equal(document.querySelector('form'),null);assert.ok(document.querySelector('.completion-start'));
  assert.equal(document.querySelector('.resident-replay'),null);assert.match(document.querySelector('.resident-wish')!.textContent!,/暗くなったら街灯をつけ、明るくなったら消すシステム/);
  const references=document.querySelectorAll<HTMLButtonElement>('.task-reference-links button');
  await act(async()=>references[0].click());assert.match(document.querySelector('.task-reference-panel')!.textContent!,/まずはセンサの値/);assert.equal(document.querySelector('.resident-wish'),null);assert.equal(document.querySelectorAll('.hint-card').length,3);
  await act(async()=>document.querySelector<HTMLButtonElement>('.task-reference-back')!.click());assert.ok(document.querySelector('.resident-wish'));
  await act(async()=>references[1].click());assert.equal(document.querySelectorAll('.task-part-item').length,10);assert.match(document.querySelector('.task-parts-list')!.textContent!,/PotentioMeter/);
  assert.equal(redeems,0);

 }finally{await act(async()=>root.unmount());dom.window.close();}
});
