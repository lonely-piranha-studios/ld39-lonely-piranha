import Map from './Map';

export default class MapGenerator {

  constructor() {
    this.mapRadius = 300;
    this.mapCollide = [];
    this.rooms = [];
    this.spawn = {
      id: 'spawn',
      name: 'spawn',
      width: 11,
      height: 11,
      entryTop: true,
      entryBottom: true,
      entryLeft: true,
      entryRight: true,
    };
    this.availableEntries = [];
    this.tileset = null;
  }

  createMap(config) {
    this.mapRadius = config.mapRadius || this.mapRadius;
    this.mapCollide = [];
    this.rooms = config.rooms || this.rooms;
    this.spawn = config.spawn || this.spawn;
    this.tileset = config.tileset || this.tileset;
    this.availableEntries = [];

    if (!!config.debug) {
      for (let i = 0; i < 200; i++) {
        this.rooms.push({
          width: Math.floor(Math.random()*20 + 5),
          height: Math.floor(Math.random()*20 + 5),
          entryTop: !!(Math.random() > 0.2),
          entryBottom: !!(Math.random() > 0.2),
          entryLeft: !!(Math.random() > 0.2),
          entryRight: !!(Math.random() > 0.2),
        });
      }
    }

    this.mapGenerate();
  
    const mapWidth = this.mapRadius * 2;
    const mapHeight = this.mapRadius * 2;
    const collision = Array(mapWidth * mapHeight).fill(1);
    const tiles = Array(mapWidth * mapHeight).fill(0);

    {this.mapCollide.map((v, x) => v.map((type, y) => {
      collision[mapWidth * y + x] = type === 0 ? 1 : 0
      tiles[mapWidth * y + x] = type
    }))}

    const map = new Map({
      width: mapWidth,
      height: mapHeight,
      collision,
      objects: {},
      tiles
    }, this.tileset);

    return map;
  }

  mapGenerate() {
    this.generationRotation = 0;
    this.generationDistance = 10;
    this.mapWrite(this.spawn, 0, 0);
    for (let ind = 0; ind < this.rooms.length; ind++) {
      let success = false;
      while(!success) {
        const newX = Math.floor(this.generationDistance * Math.cos(this.generationRotation));
        const newY = Math.floor(this.generationDistance * Math.sin(this.generationRotation));
        if (!this.mapCollision(this.rooms[ind], newX, newY)) {
          this.mapWrite(this.rooms[ind], newX, newY);
          success = true;
        } else {
          this.generationRotation += 450 / (10 + this.generationDistance / 2);
          if (this.generationRotation >= 360) {
            this.generationRotation -= 360;
            this.generationDistance += 5;
          }
        }
      }
    }
  }

  mapCollision(map, x, y) {
    const mapXOrigo = Math.floor(map.width/2);
    const mapYOrigo = Math.floor(map.height/2);
    const mapWidth = map.width + 6;
    const mapHeight = map.height + 6;
    const tot = mapWidth * mapHeight;
    for (let ind = 0; ind < tot; ind++) {
      const xPos = this.mapRadius + x - 3 - mapXOrigo + (ind - Math.floor(ind/mapWidth) * mapWidth);
      const yPos = this.mapRadius + y - 3 - mapYOrigo + Math.floor(ind/mapWidth);
      if (this.mapCollide[xPos] && this.mapCollide[xPos][yPos]) {
        return true;
      }
    }
    return false;
  }

  entryDirectionValidate(type, x, y) {
    if (type === 'top' && y >= 0) { return false; }
    if (type === 'bottom' && y <= 0) { return false; }
    if (type === 'left' && x >= 0) { return false; }
    if (type === 'right' && x <= 0) { return false; }
    return true;
  }

  entryFind(type, x, y) {
    let maxDistance = 20; // max search distance
    let res = -1;
    for (let ind = 0; ind < this.availableEntries.length; ind++) {
      const distance = Math.hypot(this.availableEntries[ind].x-x, this.availableEntries[ind].y-y);
      if (distance < maxDistance) {
        if (this.entryDirectionValidate(type, this.availableEntries[ind].x-x, this.availableEntries[ind].y-y) && this.entryDirectionValidate(this.availableEntries[ind].type, x-this.availableEntries[ind].x, y-this.availableEntries[ind].y)) {
          maxDistance = distance;
          res = ind;
        }
      }
    }
    return res;
  }

  coridorDraw(x1, y1, x2, y2, type1, type2) {
    const distanceW = Math.abs(x1 - x2);
    const distanceH = Math.abs(y1 - y2);
    const xMin = Math.min(x1, x2);
    const yMin = Math.min(y1, y2);
    let type = distanceW > distanceH ? 'horizontal' : 'vertical';
    if (type1 === 'top' && type2 === 'bottom' || type2 === 'top' && type1 === 'bottom') { type = 'vertical'; }
    if (type1 === 'left' && type2 === 'right' || type2 === 'left' && type1 === 'right') { type = 'horizontal'; }
    if ((type1 === 'left' || type1 === 'right') && (type2 === 'top' || type2 === 'bottom')) { type = 'horizontal-bend'; }
    if ((type1 === 'top' || type1 === 'bottom') && (type2 === 'left' || type2 === 'right')) { type = 'vertical-bend'; }
    let drawX = x1;
    let drawY = y1;
    for (let step = 0; step < distanceW + distanceH; step++) {
      if (type === 'horizontal') {
        if (step >= distanceW/2 && drawY !== y2) {
          drawY += y1 > y2 ? -1 : 1;
        } else {
          drawX += x1 > x2 ? -1 : 1;
        }
      } else if (type === 'vertical') {
        if (step >= distanceH/2 && drawX !== x2) {
          drawX += x1 > x2 ? -1 : 1;
        } else {
          drawY += y1 > y2 ? -1 : 1;
        }
      } else if (type === 'horizontal-bend') {
        if (step >= distanceW) {
          drawY += y1 > y2 ? -1 : 1;
        } else {
          drawX += x1 > x2 ? -1 : 1;
        }
      } else if (type === 'vertical-bend') {
        if (step >= distanceH) {
          drawX += x1 > x2 ? -1 : 1;
        } else {
          drawY += y1 > y2 ? -1 : 1;
        }
      }
      const innerArr = this.mapCollide[drawX];
      if (!Array.isArray(innerArr)) {
        this.mapCollide[drawX] = [];
      }
      this.mapCollide[drawX][drawY]
        = 1; // normal ground
    }
    this.mapCollide[x1][y1] = 1;
    this.mapCollide[x2][y2] = 1;
  }

  mapWrite(map, x, y) {
    const mapXOrigo = Math.floor(map.width/2);
    const mapYOrigo = Math.floor(map.height/2);
    for (let ind = 0; ind < map.width*map.height; ind++) {
      const xPos = this.mapRadius + x - mapXOrigo + (ind - Math.floor(ind/map.width) * map.width);
      const yPos = this.mapRadius + y - mapYOrigo + Math.floor(ind/map.width);
      const innerArr = this.mapCollide[xPos];
      if (!Array.isArray(innerArr)) {
        this.mapCollide[xPos] = [];
      }
      this.mapCollide[xPos][yPos]
        = 1; // read from map
    }
    let entries = [];
    if (map.entryTop) {
      const search = this.entryFind('top', this.mapRadius + x, this.mapRadius + y - mapYOrigo);
      if (search >= 0) {
        this.coridorDraw(this.mapRadius + x, this.mapRadius + y - mapYOrigo, this.availableEntries[search].x, this.availableEntries[search].y, 'top', this.availableEntries[search].type)
        //this.availableEntries.splice(search, 1)
      }
      entries.push({ type: 'top', x: this.mapRadius + x, y: this.mapRadius + y - mapYOrigo });
    }
    if (map.entryBottom) {
      const search = this.entryFind('bottom', this.mapRadius + x, this.mapRadius + y - mapYOrigo + map.height - 1);
      if (search >= 0) {
        this.coridorDraw(this.mapRadius + x, this.mapRadius + y - mapYOrigo + map.height - 1, this.availableEntries[search].x, this.availableEntries[search].y, 'bottom', this.availableEntries[search].type)
        //this.availableEntries.splice(search, 1)
      }
      entries.push({ type: 'bottom', x: this.mapRadius + x, y: this.mapRadius + y - mapYOrigo + map.height - 1 });
    }
    if (map.entryLeft) {
      const search = this.entryFind('left', this.mapRadius + x - mapXOrigo, this.mapRadius + y);
      if (search >= 0) {
        this.coridorDraw(this.mapRadius + x - mapXOrigo, this.mapRadius + y, this.availableEntries[search].x, this.availableEntries[search].y, 'left', this.availableEntries[search].type)
        //this.availableEntries.splice(search, 1)
      }
      entries.push({ type: 'left', x: this.mapRadius + x - mapXOrigo, y: this.mapRadius + y });
    }
    if (map.entryRight) {
      const search = this.entryFind('right', this.mapRadius + x - mapXOrigo + map.width - 1, this.mapRadius + y);
      if (search >= 0) {
        this.coridorDraw(this.mapRadius + x - mapXOrigo + map.width - 1, this.mapRadius + y, this.availableEntries[search].x, this.availableEntries[search].y, 'right', this.availableEntries[search].type)
        //this.availableEntries.splice(search, 1)
      }
      entries.push({ type: 'right', x: this.mapRadius + x - mapXOrigo + map.width - 1, y: this.mapRadius + y });
    }
    this.availableEntries.push(...entries);
  }
}