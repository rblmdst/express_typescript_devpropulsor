// contains lowercase uppercase digit and special character and it is 8 characters minimum
export let passwordPattern =
  /(?=.*[`~!@\\#$%^&*()+=[{\]}'<,.>?";:|/\-])(?=.{8,})(?=.*[0-9]+)(?=.*[a-z]+)(?=.*[A-Z]+)/;
// let emailPattern = /\w+([-.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
// source : http://emailregex.com/
export let emailPattern =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
