// Current names: Dongchang Road was renamed Pudong Road (South) in 2024.
export function metroPlatformDirection(station,direction){
 const east=direction>0,atNanjing=station.id==='nanjing';
 const [next,english,playable]=east?(atNanjing?['陆家嘴','Lujiazui',true]:['浦东南路','Pudong Road (South)',false]):(atNanjing?['人民广场',"People's Square",false]:['南京东路','East Nanjing Road',true]);
 return {next,english,playable,zh:next+'方向',en:'To '+english};
}
