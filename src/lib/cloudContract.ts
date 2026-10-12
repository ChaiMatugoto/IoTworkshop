export type RemoteTeam={id:string;team_name:string;completed:string[];total_points:number;updated_at:string};
export function parseTeam(v:unknown):RemoteTeam{
 const t=v as RemoteTeam;if(!t||typeof t.id!=='string'||typeof t.team_name!=='string'||!Array.isArray(t.completed)||!t.completed.every(x=>typeof x==='string')||(!Number.isSafeInteger(t.total_points)||t.total_points<0)||typeof t.updated_at!=='string')throw new Error('サーバーの応答を確認できませんでした。');return t;
}
export function serverError(code:string){return ({INVALID_PASSWORD:'パスワードが違います。',INVALID_NAME:'チーム名を1〜30文字で入力してください。',RATE_LIMIT:'入力回数が多いため、1分待ってから再試行してください。',EVENT_CLOSED:'この開催回は終了しています。',FORBIDDEN:'この操作を行う権限がありません。'} as Record<string,string>)[code]||'サーバーに接続できません。通信とサーバーの稼働状態を確認してください。';}
