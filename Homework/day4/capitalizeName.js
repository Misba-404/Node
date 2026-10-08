module.exports=function(name){
          return name.replace(/\b\w/g, char => char.toUpperCase());
}