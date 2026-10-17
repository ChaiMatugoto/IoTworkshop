import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

test('team name remains focused and editable while connection status refreshes; IME never submits',async()=>{
 const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:'http://localhost/'});
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
 Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
 const {createElement,act}=await import('react');const {createRoot}=await import('react-dom/client');const {TeamSetup}=await import('./components/TeamSetup');
 const root=createRoot(document.getElementById('root')!);let calls=0;let submitted='';let finish:()=>void=()=>{};
 const onStart=async(name:string)=>{calls++;submitted=name;await new Promise<void>(resolve=>{finish=resolve;});};
 const render=async(loading:boolean)=>act(async()=>root.render(createElement(TeamSetup,{onStart,cloud:true,loading})));
 try{
  await render(false);
  const input=document.querySelector<HTMLInputElement>('#team-name')!;const form=document.querySelector('form')!;
  const type=async(value:string)=>act(async()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value')!.set!.call(input,value);input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
  await type('こもれび');assert.equal(document.activeElement,input);
  for(let n=0;n<3;n++){await render(true);assert.equal(input.disabled,false);assert.equal(document.activeElement,input);assert.equal(input.value,'こもれび');await render(false);assert.equal(document.activeElement,input);}
  await act(async()=>{input.dispatchEvent(new dom.window.CompositionEvent('compositionstart',{bubbles:true}));});
  const composingEnter=new dom.window.KeyboardEvent('keydown',{key:'Enter',isComposing:true,keyCode:229,bubbles:true,cancelable:true});
  await act(async()=>{input.dispatchEvent(composingEnter);form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));});
  assert.equal(composingEnter.defaultPrevented,true);assert.equal(calls,0);
  await act(async()=>{input.dispatchEvent(new dom.window.CompositionEvent('compositionend',{bubbles:true,data:'こもれび'}));});
  await act(async()=>{form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));});
  assert.equal(calls,1);assert.equal(submitted,'こもれび');assert.equal(input.disabled,true);
  await act(async()=>finish());assert.equal(input.disabled,false);
 }finally{await act(async()=>root.unmount());dom.window.close();}
});
