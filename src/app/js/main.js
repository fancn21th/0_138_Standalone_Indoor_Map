/**
 * 浦东 
 * 宽109.7米 宽的偏移是 18.9东 
 * 高147.3米 高的偏移是 6.4
 */
var yx = L.latLng;

var xy = function (x, y) {
  if (L.Util.isArray(x)) {
    // When doing xy([x, y]);
    return yx(x[1], x[0]);
  }
  return yx(y, x); // When doing xy(x, y);
};

var actualWidth = 1097;
var actualHeight = 1473;
var actualOffsetX = 189;
var actualOffsetY = 64;

var mapWidth = 6316;
var mapHeight = 8114;
var mapReferenceY = -8114;

var mapXy = function (actualX, actualY) {
  return [
    Math.round(((actualX + actualOffsetX) * mapWidth) / actualWidth),
    Math.round(((actualY + actualOffsetY) * mapHeight) / actualHeight),
  ];
};

var bottomLeftXy = function (mapX, mapY) {
  return [mapX, mapY + mapReferenceY];
};

var xyOffset = function (actualX, actualY) {
  var xyMap = mapXy(actualX, actualY);
  var xyBottomLeft = bottomLeftXy(xyMap[0], xyMap[1]);
  return xy(xyBottomLeft[0], xyBottomLeft[1]);
};

//自动生成代码
var mapExtent = [0.0, -8114.0, 6316.0, 0.0];
var mapMinZoom = 0;
var mapMaxZoom = 2;
var mapMaxResolution = 8.0;
var mapMinResolution = Math.pow(2, mapMaxZoom) * mapMaxResolution;
var tileExtent = [0.0, -8114.0, 6316.0, 0.0];
var crs = L.CRS.Simple;
crs.transformation = new L.Transformation(1, -tileExtent[0], -1, tileExtent[3]);
crs.scale = function (zoom) {
  return Math.pow(2, zoom) / mapMinResolution;
};
crs.zoom = function (scale) {
  return Math.log(scale * mapMinResolution) / Math.LN2;
};
var layer;
var map = new L.Map("map", {
  maxZoom: mapMaxZoom,
  minZoom: mapMinZoom,
  crs: crs,
});

layer = L.tileLayer("/app/tiles/{z}/{x}/{y}.png", {
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
// L.control.mousePosition().addTo(map);

// 标记
var pos = xyOffset(0, 0);
var marker = L.marker(pos)
  .addTo(map)
  // .bindPopup(video)
  .openPopup();

// markers data
var data = [
  "F,f111,78.5,39.7,0.0,0,1586527448,a88999,I",
  "F,f111,79.3,39.2,0.0,0,1586527449,a88999,I",
  "F,f111,79.0,39.9,0.0,0,1586527450,a88999,I",
  "F,f111,77.5,41.0,0.0,0,1586527451,a88999,I",
  "F,f111,76.6,41.7,0.0,0,1586527452,a88999,I",
  "F,f111,75.6,42.9,0.0,0,1586527453,a88999,I",
  "F,f111,75.5,44.4,0.0,0,1586527454,a88999,I",
  "F,f111,76.0,46.5,0.0,0,1586527455,a88999,I",
  "F,f111,76.1,49.0,0.0,0,1586527456,a88999,I",
  "F,f111,75.8,53.2,0.0,0,1586527458,a88999,I",
  "F,f111,75.5,55.0,0.0,0,1586527459,a88999,I",
  "F,f111,75.5,56.9,0.0,0,1586527460,a88999,I",
  "F,f111,75.3,58.0,0.0,0,1586527461,a88999,I",
  "F,f111,74.8,59.2,0.0,0,1586527462,a88999,I",
  "F,f111,74.0,60.0,0.0,0,1586527463,a88999,I",
  "F,f111,72.4,60.9,0.0,0,1586527464,a88999,I",
  "F,f111,70.1,61.7,0.0,0,1586527465,a88999,I",
  "F,f111,68.9,62.7,0.0,0,1586527466,a88999,I",
  "F,f111,68.4,63.5,0.0,0,1586527467,a88999,I",
  "F,f111,68.0,64.5,0.0,0,1586527468,a88999,I",
  "F,f111,68.0,65.4,0.0,0,1586527469,a88999,I",
  "F,f111,68.0,67.5,0.0,0,1586527471,a88999,I",
  "F,f111,69.5,74.4,0.0,0,1586527475,a88999,I",
  "F,f111,69.8,75.8,0.0,0,1586527476,a88999,I",
  "F,f111,69.9,77.0,0.0,0,1586527477,a88999,I",
  "F,f111,70.0,78.1,0.0,0,1586527478,a88999,I",
];

// 轨迹

// polyline
var latlngs = data.map((item) => {
  var arr = item.split(",");
  var x = arr[2] * 10;
  var y = arr[3] * 10;
  return xyOffset(x, y);
});
var polyline = L.polyline(latlngs, { color: "red" }).addTo(map);

// markers
// data.forEach((item) => {
//   var arr = item.split(",");
//   var x = arr[2] * 10;
//   var y = arr[3] * 10;
//   L.marker(xyOffset(x, y)).addTo(map);
// });

// 调试层
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

map.addLayer(L.gridLayer.debugCoords());

// 刻度
L.control.scale().addTo(map);
