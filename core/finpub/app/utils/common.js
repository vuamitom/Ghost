const utils = {

    isEmbedded: function() {
      return window.self !== window.top;
    },

    getTargetOrigin: function() {
      return window.location.protocol + '//' + window.location.hostname + (window.location.port? (':' + window.location.port): '');
    }
};

export default utils;