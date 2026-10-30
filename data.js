/* ===== DATA — edit this file to add maps, pins and lineups =====
 Put images in images/<map>/ and radar minimaps in images/radar/.
 image: "images/abyss/ab1.webp"   radar: "images/radar/abyss.webp" (optional; a drawn grid is used if empty)
 pins: [x%, y%, [imageIds]]   images: {id, categories, title, note, image (url; placeholder drawn if empty)}   videos: {id (YouTube), label, meta, note} */
const A="A Site (Attack)",AD="A Site (Defense)",B="B Site (Attack)",BD="B Site (Defense)";
const MAPS=[
{name:"Abyss",accent:"#b06bd9",radar:"",sites:[[39.5,3.9,"A"],[36.9,89.3,"B"]],
 pins:[[73.4,39.6,["ab1"]],[86.9,17.9,["ab2"]],[69.4,73.8,["ab3","ab9"]],[50.4,97.9,["ab4"]],[41.3,93.9,["ab5"]],[27.9,10.3,["ab6"]],[46.5,94.3,["ab7"]],[74.5,82.1,["ab8"]],[40,20,["ab10"]]],
 images:[
 {id:"ab1",image:"images/abyss/ab1.svg",categories:["Mid"],title:"Lurk Smoke Mid",note:"Simple left click"},
 {id:"ab2",image:"images/abyss/ab2.svg",categories:[A],title:"Sky Smoke A Site",note:"Jump & left click"},
 {id:"ab3",image:"images/abyss/ab3.svg",categories:[B],title:"Sky Smoke B Top",note:"Jump & left click"},
 {id:"ab4",image:"images/abyss/ab4.svg",categories:[B],title:"Incendiary Post-Plant B",note:"Simple left click. Test it in a custom game first, it is tricky to land."},
 {id:"ab5",image:"images/abyss/ab5.svg",categories:[BD],title:"Incendiary Retake B",note:"Simple left click"},
 {id:"ab6",image:"images/abyss/ab6.svg",categories:[AD],title:"Default Smoke A Main",note:"Simple left click"},
 {id:"ab7",image:"images/abyss/ab7.svg",categories:[BD],title:"Hold/Retake Smoke B",note:"Simple left click"},
 {id:"ab8",image:"images/abyss/ab8.svg",categories:[B,"Setups"],title:"Default Stim Setup B Site",note:"Simple left click"},
 {id:"ab9",image:"images/abyss/ab9.svg",categories:[B],title:"Anti-Play Molly B Top Box",note:"Simple left click"},
 {id:"ab10",image:"images/abyss/ab10.svg",categories:["Ultimate"],title:"Orbital Strike A Site",note:"Simple left click"}],
 videos:[{id:"",label:"Full guide",meta:"Add views · date",note:"Add a note about this video."},{id:"",label:"Guide (2)",meta:"Add views · date"}]},
...["Ascent","Bind","Breeze","Corrode","Fracture","Haven","Icebox","Lotus","Pearl","Split","Summit","Sunset"].map(n=>({name:n,accent:"#5ac491",sites:[[30,14,"A"],[26,78,"B"]],pins:[],images:[],videos:[]}))];
