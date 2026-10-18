export type WorkshopPart={id:string;name:string;group:'input'|'output';description:string;example:string;image:string};
export const parts:WorkshopPart[]=[
 {id:'cds',name:'CdS（光）',group:'input',description:'周りが明るいか、暗いかを調べられます。',example:'暗くなったら、街灯をつける。',image:'cds.svg'},
 {id:'potentiometer',name:'可変抵抗',group:'input',description:'つまみを回して、プログラムに伝える数値を変えられます。',example:'つまみでLEDの明るさを変える。',image:'potentiometer.svg'},
 {id:'microphone',name:'マイク',group:'input',description:'周りの音の大きさを調べられます。',example:'大きな音がしたら、LEDで知らせる。',image:'microphone.svg'},
 {id:'ultrasonic',name:'超音波センサ',group:'input',description:'センサの前にある物までの距離を測れます。',example:'車が近づいたら、駐車場への入庫を記録する。',image:'ultrasonic.svg'},
 {id:'temperature',name:'温度センサ',group:'input',description:'周りの温度を測れます。',example:'倉庫が暑くなったら、ブザーを鳴らす。',image:'temperature.svg'},
 {id:'tilt',name:'傾きスイッチ',group:'input',description:'部品が傾いたかどうかを調べられます。',example:'建物の模型が傾いたら、音で知らせる。',image:'tilt.svg'},
 {id:'button',name:'ボタンスイッチ',group:'input',description:'ボタンが押されたかどうかを調べられます。',example:'ボタンを押して、横断したいと伝える。',image:'button.svg'},
 {id:'led',name:'LED',group:'output',description:'光をつけたり、消したりできます。',example:'横断してよいことを、光で知らせる。',image:'led.svg'},
 {id:'buzzer',name:'ブザー',group:'output',description:'音を鳴らして、知らせることができます。',example:'料理ができたら、音で呼び出す。',image:'buzzer.svg'},
 {id:'vibration',name:'振動モーター',group:'output',description:'ぶるぶると振動させて、知らせることができます。',example:'お店に人が来たら、振動で知らせる。',image:'vibration.svg'},
];
