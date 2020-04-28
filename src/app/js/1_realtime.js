class RealTimeMap extends IndoorMap {
  constructor(id, options) {
    super(id, options);
    this.marker = null;
  }

  addMarker(x, y) {
    const pos = this._xyOffset(x, y);
    this.marker = L.marker(pos).addTo(this.map).openPopup();
  }

  updatePosition(x, y) {
    this.marker.setLatLng(this._xyOffset(x, y));
  }
}
