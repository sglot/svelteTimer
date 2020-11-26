const conf = {
  maxInnerLap     : 3,
  recoveryTime    : 180,  //seconds
  circleWidth     : 300,  //px
  circleHeight    : 300,  //px
  frontLineWidth  : 4,    //px
  bgLineWidth     : 18,   //px
  timerStep       : 50,
  preWorkTime     : 3,

  resolutions: {
    very_small    : 290,
    small         : 479,
    middle        : 640,
    min_desktop   : 980,
  },

  colors: {
    work      : `rgba(255, 124, 32, `,
    relax     : `rgba(59, 153, 255, `,
    recovery  : `rgba(146, 204, 255, `,
    stop      : `rgba(0, 182, 10, `,
  }
};
export {conf};