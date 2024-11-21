const fs = require("fs");
const prompt = require("prompt-sync")();
var command_cycle;
var increment;
var code_unformatted = fs.readFileSync(process.argv[2]==null?"test.txt":process.argv[2],"utf8").split("\n").join("")
var code_commands = code_unformatted.match(/[a|s|d|f|g|h|j|k|l]{2,2}/gmi)
var code_args = code_unformatted.split(/[a|s|d|f|g|h|j|k|l]{2,2}/gmi).slice(1)
var numbers = "qwertyuiop"
var code = [];
for(let inc = 0; inc < code_args.length; inc++){
  code.push(code_commands[inc]+code_args[inc])
  for(x of numbers){
    code[inc] = code[inc].split(x.toUpperCase()).join(numbers.indexOf(x))
  }
}

//console.log(code)

//console.log(code_commands)
//console.log(code_args)
function returnError(error){
  let errors = [
    "got command character when expecting number / variable character",
    "got number / variable character when expecting command character"
  ]
  console.log("there waz an error...\n");
  console.log("error "+error+": "+errors[error])
  console.log("\nat "+command_cycle)
  process.exit()
}

//var vars = "zxcvbn"

//numbers are top row (0-9)
//commands are second row 
//asdfghjkl
var points = []
var variables = []
var commands = {
  "aa":function(num){ //print text
    console.log(String.fromCharCode(nov(num)))
  },
  "as":function(num){ //print number/variable
    console.log(nov(num))
  },
  "ad":function(){ //create variable
    variables.push(0)
  },
  "af":function(va,num){ //add to variable
    variables[va] += nov(num);
  },
  "ag":function(va,num){ //remove from variable
    variables[va] -= nov(num);
  },
  "ah":function(va,num){ //multiply to variable
    variables[va] *= nov(num);
  },
  "aj":function(va,num){ //divide to variable
    variables[va] /= nov(num);
  },
  "ak":function(){ //set point
  },
  "al":function(num){ //go to point
    return nov(num)
  },
  "sa":function(num1,num2,num){
    if(nov(num1) > nov(num2)){
    return nov(num)
    }
  },
  "ss":function(num1,num2,num){
    if(nov(num1) < nov(num2)){
    return nov(num)
    }
  },
  "sd":function(num1,num2,num){
    if(nov(num1) == nov(num2)){
    return nov(num)
    }
  },
  "sf":function(num1,num2,num){
    if(nov(num1) >= nov(num2)){
    return nov(num)
    }
  },
  "sg":function(num1,num2,num){
    if(nov(num1) <= nov(num2)){
    return nov(num)
    }
  },
  "sh":function(num1,num2,num){
    if(nov(num1) != nov(num2)){
    return nov(num)
    }
  },
  "sj":function(va,num){
    variables[va] %= nov(num)
  },
  "sk":function(va){
    variables[va] = 0
  },
  "sl":function(num){
      process.stdout.write(String.fromCharCode(nov(num)))
  },
  "da":function(va,num){
      variables[va] = Math.sqrt(nov(num));
  },
  "ds":function(va){
      variables[va] = prompt(">");
  },
  "dd":function(va,num){
      variables[va] = String.fromCharCode(nov(num))
  },
  "df":function(va,va2){
      variables[va] = variables[va2].length
  },
  "dg":function(va,va2,va3){
      variables[va] = variables[va2][nov(va3)]
  },
  "dh":function(num){
     process.stdout.write(""+nov(num))
  }
}


function nov(input){
  if(/^\d+$/.test(input)){
    return variables[parseInt(input)]
  }else{
    if(/a|s|d|f|g|h|j|k|l/gmi.test(input)){
      console.log(command_cycle)
      returnError(0)
    }
    out = ""
    for(x of input){
      out+=numbers.indexOf(x);
    }
    return parseInt(out)
  }
}
for(increment = 0; increment < code.length; increment++){
  command_cycle = code[increment];
  //console.log(command_cycle,variables)
 // console.log(increment)
  let command = command_cycle[0]+command_cycle[1]
  if(/q|w|e|r|t|y|u|i|o|p|\d/gmi.test(command)){
    returnError(1)
  }
  let args = command_cycle.slice(2).split("m")
  try{
  ret = commands[command](...args)
  }catch(e){
    console.log(command_cycle)
  }
  if(ret != undefined){
    increment = code.indexOf("ak"+numbers[ret]) 
  }
}
