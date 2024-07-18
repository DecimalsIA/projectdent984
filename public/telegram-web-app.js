window.Telegram = {
  WebApp: {
    initData: '',
    initDataUnsafe: {},

    // Header color
    headerColor: function (color) {
      console.log(`Set header color to ${color}`);
    },

    // Background color
    backgroundColor: function (color) {
      console.log(`Set background color to ${color}`);
    },

    // MainButton methods
    MainButton: {
      text: '',
      color: '',
      textColor: '',
      isVisible: false,
      isActive: true,
      progressVisible: false,
      setText: function (text) {
        this.text = text;
        console.log(`MainButton text set to ${text}`);
      },
      setColor: function (color) {
        this.color = color;
        console.log(`MainButton color set to ${color}`);
      },
      setTextColor: function (color) {
        this.textColor = color;
        console.log(`MainButton text color set to ${color}`);
      },
      show: function () {
        this.isVisible = true;
        console.log('MainButton shown');
      },
      hide: function () {
        this.isVisible = false;
        console.log('MainButton hidden');
      },
      enable: function () {
        this.isActive = true;
        console.log('MainButton enabled');
      },
      disable: function () {
        this.isActive = false;
        console.log('MainButton disabled');
      },
      showProgress: function () {
        this.progressVisible = true;
        console.log('MainButton progress shown');
      },
      hideProgress: function () {
        this.progressVisible = false;
        console.log('MainButton progress hidden');
      },
      onClick: function (callback) {
        console.log('MainButton clicked');
        callback();
      },
    },

    // BackButton methods
    BackButton: {
      isVisible: false,
      show: function () {
        this.isVisible = true;
        console.log('BackButton shown');
      },
      hide: function () {
        this.isVisible = false;
        console.log('BackButton hidden');
      },
      onClick: function (callback) {
        console.log('BackButton clicked');
        callback();
      },
    },

    // Haptic feedback methods
    HapticFeedback: {
      impactOccurred: function (style) {
        console.log(`Haptic feedback impact occurred with style: ${style}`);
      },
      notificationOccurred: function (type) {
        console.log(`Haptic feedback notification occurred with type: ${type}`);
      },
      selectionChanged: function () {
        console.log('Haptic feedback selection changed');
      },
    },

    // Closing the web app
    close: function () {
      console.log('WebApp closed');
    },

    // Scan QR code
    scanQrCode: function (callback) {
      console.log('QR code scanning started');
      callback('SampleQRCodeData');
    },

    // Show popup
    showPopup: function (params, callback) {
      console.log('Popup shown with params:', params);
      callback();
    },

    // Requesting contact
    requestContact: function (callback) {
      console.log('Contact request started');
      callback({ phoneNumber: '1234567890' });
    },

    // Requesting location
    requestLocation: function (callback) {
      console.log('Location request started');
      callback({ latitude: 40.7128, longitude: -74.006 });
    },

    // Opening link
    openLink: function (url) {
      console.log(`Opened link: ${url}`);
      window.open(url, '_blank');
    },

    // Opening invoice
    openInvoice: function (invoiceLink, callback) {
      console.log(`Opened invoice: ${invoiceLink}`);
      callback({ status: 'paid' });
    },

    // Toggle minimal view
    toggleMinimalView: function () {
      console.log('Minimal view toggled');
    },
  },
};

// Telegram Game Proxy
if (typeof window.TelegramGameProxy === 'undefined') {
  window.TelegramGameProxy = {
    receiveEvent: function (eventType, eventData) {
      console.log(`Received event of type: ${eventType} with data:`, eventData);
    },
    onEvent: function (callback) {
      console.log('Event listener set');
      this.receiveEvent = callback;
    },
  };
}
