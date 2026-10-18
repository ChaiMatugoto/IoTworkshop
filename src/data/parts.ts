export type WorkshopPart={id:string;name:string;boardLabel:string;group:'input'|'output';description:string;image:string};
export const parts:WorkshopPart[]=[
 {id:'cds',name:'CdS（光）',boardLabel:'CdS',group:'input',description:'周りの明るさを調べるセンサです。センサの上に指を置いて光を遮り、暗くしてみてください。指を離して光を当てたときと、読み取る値がどう変わるか確認できます。',image:'cds.svg'},
 {id:'potentiometer',name:'可変抵抗',boardLabel:'PotentioMeter',group:'input',description:'つまみを回して、プログラムに伝える数値を変える部品です。つまみを左右にゆっくり回してみてください。回す位置によって値が変わり、数値の大きさを手で調整できます。',image:'potentiometer.svg'},
 {id:'microphone',name:'マイク',boardLabel:'Microphone',group:'input',description:'周りの音の大きさを調べるセンサです。マイクの近くで声を出したり、手をたたいたりしてみてください。静かなときと音を出したときで、読み取る値の変化を確認できます。',image:'microphone.svg'},
 {id:'ultrasonic',name:'超音波センサ',boardLabel:'Distance',group:'input',description:'センサの前にある物までの距離を測る部品です。丸い二つの部分を手で塞がず、その前で手や物を近づけたり離したりしてみてください。物までの距離が数値で変わることを確認できます。',image:'ultrasonic.svg'},
 {id:'temperature',name:'温度センサ',boardLabel:'Temperature',group:'input',description:'周りの温度を測るセンサです。センサの近くに手を添えて、体温でゆっくり温めてみてください。温度はすぐには変わらないので、少し待ちながら数値の変化を確認しましょう。',image:'temperature.svg'},
 {id:'tilt',name:'傾きスイッチ',boardLabel:'Slope',group:'input',description:'基板ごと傾けて、傾いたかどうかを調べるスイッチです。基板をゆっくり傾けたり、元の向きに戻したりしてみてください。向きによってスイッチの状態が切り替わることを確認できます。',image:'tilt.svg'},
 {id:'button',name:'ボタンスイッチ',boardLabel:'Switch',group:'input',description:'ボタンが押されたかどうかを調べる部品です。基板のボタンを押してから、指を離してみてください。押している間と離している間で、スイッチの状態が切り替わることを確認できます。',image:'button.svg'},
 {id:'led',name:'LED',boardLabel:'LED',group:'output',description:'光をつけたり、消したりできる部品です。プログラムから点灯・消灯の指示を送り、光が切り替わるか確認してください。点滅させたり、明るさを調整したりすることもできます。',image:'led.svg'},
 {id:'buzzer',name:'ブザー',boardLabel:'Buzzer',group:'output',description:'音を鳴らして知らせる部品です。プログラムから音を鳴らす指示と止める指示を送り、音の変化を確認してください。鳴らす時間を決めて、必要なときに知らせることができます。',image:'buzzer.svg'},
 {id:'vibration',name:'振動モーター',boardLabel:'Vibration',group:'output',description:'ぶるぶると振動して知らせる部品です。プログラムから動かす指示を送り、モーターの振動を確かめてください。止める指示や動かす時間を決めることで、振動の長さも変えられます。',image:'vibration.svg'},
];
