import { useState, type ReactNode } from 'react';
import { admin, eventId } from '../lib/cloud';
import { setAdminPassword } from '../lib/adminAccess';
export default function AdminGate({children}:{children:ReactNode}){
 const [unlocked,setUnlocked]=useState(false);const [password,setPassword]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 if(unlocked)return children;
 return <div className="admin-page"><header><div className="brand">都市課題マップ</div><a className="back-to-map" href="#/">マップへ戻る</a></header><main className="admin-main"><section className="admin-login"><h1>管理者パスワード</h1><form onSubmit={async e=>{e.preventDefault();if(busy||!password)return;setBusy(true);setError('');try{if(!admin)throw new Error();const {error}=await admin.rpc('map_admin_teams',{p_event:eventId,p_password:password});if(error){setError(error.message.includes('INVALID_ADMIN_PASSWORD')?'パスワードが違います。':'接続できませんでした。追加SQLの実行と通信を確認してください。');return;}setAdminPassword(password);setPassword('');setUnlocked(true);}catch{setError('接続できませんでした。サーバー設定と通信を確認してください。');}finally{setBusy(false);}}}><label htmlFor="admin-entry-password">パスワード</label><input id="admin-entry-password" autoFocus type="password" autoComplete="off" maxLength={100} value={password} disabled={busy} onChange={e=>setPassword(e.target.value)} required/>{error&&<p className="warning" role="alert">{error}</p>}<button className="primary" type="submit" disabled={!password||busy}>{busy?'確認中…':'管理者画面へ進む'}</button></form></section></main></div>;
}
