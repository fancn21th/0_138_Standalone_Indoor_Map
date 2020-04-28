var yx = L.latLng;
var xy = function (x, y) {
  if (L.Util.isArray(x)) {
    // When doing xy([x, y]);
    return yx(x[1], x[0]);
  }
  return yx(y, x); // When doing xy(x, y);
};

class IndoorMap {
  /**
   * @param {*} id
   * @param {*} options
   */
  constructor(id, options) {
    this.id = id;
    this.options = options;
    this.tilePath = "/app/tiles";
    this.actualWidth = 1097; // 地图实际宽度 米
    this.actualHeight = 1473; // 地图实际高度 米
    this.actualOffsetX = 189; // 地图实际横坐标偏移 米
    this.actualOffsetY = 64; // 地图实际纵坐标偏移 米
    this.mapWidth = 6316;
    this.mapHeight = 8114;
    this.mapReferenceY = -this.mapHeight;
    this.init();
    this._enableDebugCord();
    this._enableScale();
  }

  /**
   * Private Methods
   */

  _bottomLeftXy(mapX, mapY) {
    return [mapX, mapY + this.mapReferenceY];
  }

  _mapXy(actualX, actualY) {
    return [
      Math.round(
        ((actualX + this.actualOffsetX) * this.mapWidth) / this.actualWidth
      ),
      Math.round(
        ((actualY + this.actualOffsetY) * this.mapHeight) / this.actualHeight
      ),
    ];
  }

  _xyOffset(actualX, actualY) {
    var xyMap = this._mapXy(actualX, actualY);
    var xyBottomLeft = this._bottomLeftXy(xyMap[0], xyMap[1]);
    return xy(xyBottomLeft[0], xyBottomLeft[1]);
  }

  _enableDebugCord() {
    L.GridLayer.DebugCoords = L.GridLayer.extend({
      createTile: function (coords, done) {
        var tile = document.createElement("div");
        tile.innerHTML = [coords.x, coords.y, coords.z].join(", ");
        tile.style.outline = "1px dotted blue";

        setTimeout(function () {
          done(null, tile); // Syntax is 'done(error, tile)'
        }, 500 + Math.random() * 1500);

        return tile;
      },
    });

    L.gridLayer.debugCoords = function (opts) {
      return new L.GridLayer.DebugCoords(opts);
    };

    this.map.addLayer(L.gridLayer.debugCoords());
  }

  _enableScale() {
    L.control.scale().addTo(this.map);
  }

  /**
   * Public Methods
   */

  init() {
    var width = this.mapWidth;
    var height = this.mapHeight;
    var mapExtent = [0.0, -height, width, 0.0];
    var mapMinZoom = 0;
    var mapMaxZoom = 2;
    var mapMaxResolution = 8.0;
    var mapMinResolution = Math.pow(2, mapMaxZoom) * mapMaxResolution;
    var tileExtent = [0.0, -width, width, 0.0];
    var crs = L.CRS.Simple;
    crs.transformation = new L.Transformation(
      1,
      -tileExtent[0],
      -1,
      tileExtent[3]
    );
    crs.scale = function (zoom) {
      return Math.pow(2, zoom) / mapMinResolution;
    };
    crs.zoom = function (scale) {
      return Math.log(scale * mapMinResolution) / Math.LN2;
    };
    const map = new L.Map(this.id, {
      maxZoom: mapMaxZoom,
      minZoom: mapMinZoom,
      crs: crs,
    });
    this.map = map;
    this.layer = L.tileLayer(`${this.tilePath}/{z}/{x}/{y}.png`, {
      minZoom: mapMinZoom,
      maxZoom: mapMaxZoom,
      attribution:
        'Rendered with <a href="https://www.maptiler.com/desktop/">MapTiler Desktop</a>',
      noWrap: true,
      tms: false,
    }).addTo(map);
    map.fitBounds([
      crs.unproject(L.point(mapExtent[2], mapExtent[3])),
      crs.unproject(L.point(mapExtent[0], mapExtent[1])),
    ]);
  }

  addMarker(x, y) {
    const pos = this._xyOffset(x, y);
    return L.marker(pos).addTo(this.map).openPopup();
  }
}
