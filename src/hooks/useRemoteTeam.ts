import { useCallback, useEffect, useRef, useState } from 'react';
import { configured, eventId, participant, parseTeam, rpcTeam, serverError, type RemoteTeam } from '../lib/cloud';
let sessionPromise:Promise<void>|null=null;
async function ensureSession(){if(!participant)return;if(!sessionPromise)sessionPromise=(async()=>{const {data,error}=await participant.auth.getSession();if(error)throw error;if(!data.session){const result=await participant.auth.signInAnonymously();if(result.error)throw result.error;}})().finally(()=>{sessionPromise=null;});await sessionPromise;}
export function useRemoteTeam(){
 const [team,setTeam]=useState<RemoteTeam|null>(null);const [loading,setLoading]=useState(configured);const [error,setError]=useState('');const alive=useRef(true);const request=useRef(0);const registering=useRef(false);const inFlight=useRef<number|null>(null);
 const refresh=useCallback(async()=>{if(!participant||registering.current||inFlight.current!==null)return;const token=++request.current;inFlight.current=token;try{await ensureSession();const {data,error}=await participant.rpc('map_my_team',{p_event:eventId});if(error)throw new Error(serverError(error.message));if(alive.current&&token===request.current){setTeam(data?parseTeam(data):null);setError('');}}catch{if(alive.current&&token===request.current)setError('共有サーバーに接続できません。通信・開催設定を確認し、再試行してください。');}finally{if(inFlight.current===token)inFlight.current=null;if(alive.current&&token===request.current)setLoading(false);}},[]);
 useEffect(()=>{alive.current=true;void refresh();return()=>{alive.current=false;request.current++;inFlight.current=null;};},[refresh]);
 useEffect(()=>{const onOnline=()=>void refresh();window.addEventListener('online',onOnline);return()=>window.removeEventListener('online',onOnline);},[refresh]);
 // Deleted rows may not deliver Realtime DELETE events under RLS; poll the owner's RPC.
 useEffect(()=>{if(!participant)return;const timer=setInterval(()=>void refresh(),5000);const onVisible=()=>{if(document.visibilityState==='visible')void refresh();};document.addEventListener('visibilitychange',onVisible);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',onVisible);};},[refresh]);
 const register=async(name:string)=>{if(registering.current)throw new Error('登録中です。しばらくお待ちください。');registering.current=true;request.current++;try{await ensureSession();const next=await rpcTeam('map_register',{p_event:eventId,p_name:name});setTeam(next);setError('');}finally{registering.current=false;if(alive.current)setLoading(false);}};
 const redeem=async(id:string,password:string)=>{if(!team)throw new Error('チーム登録が必要です。');const next=await rpcTeam('map_redeem',{p_team:team.id,p_task:id,p_password:password});request.current++;setTeam(next);setLoading(false);return true;};
 const reset=async()=>{if(!participant||!team)return;const {error}=await participant.rpc('map_reset',{p_team:team.id});if(error)throw new Error(serverError(error.message));setTeam({...team,completed:[],total_points:0});await refresh();};
 return {team,loading,error,refresh,register,redeem,reset};
}
