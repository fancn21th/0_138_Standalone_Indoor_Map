class IndoorMapApp {
  constructor() {
    this.eventHandlerMap = {
      "rt-devices-by-type": this._realtimeDevicesByTypeHandler.bind(this),
      "rt-device": this._realtimeDeviceHandler.bind(this),
      "his-device": this._historyDeviceHandler.bind(this),
    };
    this.dataMgr = new WarehouseData("http://localhost:3000");
  }
  _subscribe(eventHandlerMap) {
    window.addEventListener("message", function (event) {
      if (event && event.data) {
        const dataInJson = JSON.parse(event.data);
        dataInJson.type && eventHandlerMap[dataInJson.type](dataInJson.payload);
      }
    });
  }
  // realtime
  _realtimeDevicesByTypeHandler(data) {
    this.dataMgr
      .getLastPos(data)
      .then((res) => res.json())
      .then((data) => console.log(data));
  }
  // realtime
  _realtimeDeviceHandler(data) {
    console.log(data);
  }
  // historical
  _historyDeviceHandler(data) {
    console.log(data);
  }
  init() {
    this._subscribe(this.eventHandlerMap);
    // 根据 querystring 确定地图类型
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
