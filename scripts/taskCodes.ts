import { randomInt } from 'node:crypto';
import { issues } from '../src/data/issues';
export function generateTaskCodes():Record<string,string>{
 const used=new Set<string>();const result:Record<string,string>={};
 for(const issue of issues){let code:string;do{code=String(randomInt(10000)).padStart(4,'0');}while(used.has(code));used.add(code);result[issue.id]=code;}
 return result;
}
