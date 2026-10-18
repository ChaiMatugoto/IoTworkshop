export type WorkshopPart={id:string;name:string;boardLabel:string;group:'input'|'output';description:string;image:string};
export const parts:WorkshopPart[]=[
 {id:'cds',name:'CdS（光）',boardLabel:'CdS',group:'input',description:'周りの明るさを調べるセンサです。光の当たり方が変わると、読み取る値も変わります。明るい・暗いをプログラムで判断するために使えます。',image:'cds.svg'},
 {id:'potentiometer',name:'可変抵抗',boardLabel:'PotentioMeter',group:'input',description:'つまみを回して、プログラムに伝える数値を変える部品です。回す位置によって値が変わります。数値の大きさを、手で調整したいときに使えます。',image:'potentiometer.svg'},
 {id:'microphone',name:'マイク',boardLabel:'Microphone',group:'input',description:'周りの音の大きさを調べるセンサです。音に反応して、読み取る値が変わります。決めた基準を超えたかどうかを、プログラムで判断できます。',image:'microphone.svg'},
 {id:'ultrasonic',name:'超音波センサ',boardLabel:'Distance',group:'input',description:'センサの前にある物までの距離を測る部品です。超音波を出し、物に当たって戻るまでの時間から距離を調べます。物が近づいたり離れたりしたことを判断できます。',image:'ultrasonic.svg'},
 {id:'temperature',name:'温度センサ',boardLabel:'Temperature',group:'input',description:'周りの温度を測るセンサです。測った温度を数値としてプログラムで読み取れます。設定した温度より暑いか寒いかや、温度の変化を調べられます。',image:'temperature.svg'},
 {id:'tilt',name:'傾きスイッチ',boardLabel:'Slope',group:'input',description:'基板ごと傾けて、傾いたかどうかを調べるスイッチです。基板の向きが変わると、スイッチの状態が切り替わります。その状態をプログラムで読み取れます。',image:'tilt.svg'},
 {id:'button',name:'ボタンスイッチ',boardLabel:'Switch',group:'input',description:'ボタンが押されたかどうかを調べる部品です。押す・離すによって、スイッチの状態が切り替わります。押されたことをプログラムの動作のきっかけにできます。',image:'button.svg'},
 {id:'led',name:'LED',boardLabel:'LED',group:'output',description:'光をつけたり、消したりできる部品です。プログラムから点灯・消灯を切り替えられます。点滅させたり、明るさを調整したりして、光で状態を伝えられます。',image:'led.svg'},
 {id:'buzzer',name:'ブザー',boardLabel:'Buzzer',group:'output',description:'音を鳴らして知らせる部品です。プログラムから音を鳴らす・止めるを切り替えられます。鳴らす時間を決めて、必要なときに音で知らせることができます。',image:'buzzer.svg'},
 {id:'vibration',name:'振動モーター',boardLabel:'Vibration',group:'output',description:'ぶるぶると振動して知らせる部品です。プログラムから振動させる・止めるを切り替えられます。動かす時間を決めて、音や光以外の方法で状態を伝えられます。',image:'vibration.svg'},
];
