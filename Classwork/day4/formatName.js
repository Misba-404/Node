module.exports=function(name){
    // return name.charAt(0).toUpperCase();
      return name.replace(/\b\w/g, char => char.toUpperCase());
}