var options = {
  strings: ["Hello I'm^500 <span style='color:#03dac5; font-weight: 300;'>Jubeen</span>","Hello I'm <span style='color:#03dac5; font-weight: 300;'>J.</span>"],
  typeSpeed: 60,
  backSpeed: 120,
  backDelay: 1000,
  showCursor: true,
  loop: true,
  cursorChar: '|',
  smartBackspace: true,
  contentType: 'html'
};




var typed = new Typed('.typeanimation-text', options);




/*<span style='color:#03dac5; font-weight: 300;'>
var typed = new Typed('.typeanimation-text', {
  // Waits 1000ms after typing "First"
  strings: ['First ^1000 sentence.', 'Second sentence.',"First ^1000 sentence."]
});*/ 
//var typed = new Typed('.typeanimation-text', typeHelloAnimationOptions);
//var typed = new Typed('.typeanimation-text.main-text', typeAnimationOptions);
