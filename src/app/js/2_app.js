class IndoorMapApp {
  constructor() {
    this.eventHandlerMap = {
      "rt-devices-by-type": this._realtimeDevicesByTypeHandler,
      "rt-device": this._realtimeDeviceHandler,
      "his-device": this._historyDeviceHandler,
    };
  }
  _subscribe(eventHandlerMap) {
    window.addEventListener("message", function (event) {
      if (event && event.data) {
        const dataInJson = JSON.parse(event.data);
        dataInJson.type && eventHandlerMap[dataInJson.type](dataInJson.payload);
      }
    });
  }
  _realtimeDevicesByTypeHandler(data) {
    console.log(data);
  }
  _realtimeDeviceHandler(data) {
    console.log(data);
  }
  _historyDeviceHandler(data) {
    console.log(data);
  }
  init() {
    this._subscribe(this.eventHandlerMap);
    this.realtime = new RealTimeMap("map", {
      mapWidth: 6316,
      mapHeight: 8114,
      actualWidth: 1097,
      actualHeight: 1473,
      actualOffsetX: 189,
      actualOffsetY: 64,
    });
    this.realtime.addMarker(0, 0);
  }
}
