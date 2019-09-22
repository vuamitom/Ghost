const utils = {

    isEmbedded: function() {
      return window.self !== window.top;
    }
};

export default utils;