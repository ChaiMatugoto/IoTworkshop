import { admin } from './cloud';
let password='';
export function setAdminPassword(value:string){password=value;}
export async function adminRpc(name:'map_admin_teams'|'map_admin_reset',args:{p_event:string|undefined}){
 if(!admin)throw new Error('共有サーバーが未設定です。');
 return admin.rpc(name,{...args,p_password:password});
}
