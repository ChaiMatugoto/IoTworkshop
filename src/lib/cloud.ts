import { createClient } from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL;const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const eventId=import.meta.env.VITE_WORKSHOP_EVENT_ID as string|undefined;
export const configured=!!url&&/^https?:\/\/[^/]+/.test(url)&&!!key&&!!eventId&&!url.includes('YOUR_PROJECT')&&!key.startsWith('YOUR_')&&/^[\da-f-]{36}$/i.test(eventId);
export const participant=configured?createClient(url,key,{auth:{storageKey:'urban-map:participant-auth'}}):null;
export const admin=configured?createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}}):null;
export { parseTeam, serverError, type RemoteTeam } from './cloudContract';
import { parseTeam, serverError } from './cloudContract';
export async function rpcTeam(name:string,args:Record<string,unknown>){if(!participant)throw new Error('共有サーバーは未設定です。');const {data,error}=await participant.rpc(name,args);if(error)throw new Error(serverError(error.message));if(data?.error)throw new Error(serverError(data.error));return parseTeam(data);}
