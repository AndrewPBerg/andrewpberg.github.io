import P5Base, { VANTA } from './_p5Base.js';
import { color2Hex } from './helper.js';

// Re-usable p5 instance if the global already exists
let p5 = (typeof window === 'object') && window.p5;

/*
 *  EPHEMERAL ― a mysterious, organic stroke animation inspired by the popular 280-byte
 *  "ephemeral animal" p5 sketch (author unknown). The formula is preserved as-is but
 *  wrapped in the Vanta/P5Base boiler-plate so it can be used just like the other Vanta
 *  effects (see topology.js for reference).
 */
class Effect extends P5Base {
  static initClass () {
    // Identical option names to other Vanta p5 effects so existing React component
    // props continue to work.
    this.prototype.defaultOptions = {
      color: 0xffffff,          // stroke colour
      backgroundColor: 0x000000, // canvas background
      speed: 1,                 // time-step multiplier (negative reverses direction)
      zoom: 1,                  // overall zoom factor (>1 zooms in)
      orbitScale: 1             // scales radius of motion ( <1 shrinks )
    };
  }

  constructor (userOptions) {
    // ensure we pick up the p5 reference given by the consumer (lazy-loaded in React)
    p5 = userOptions.p5 || p5;
    super(userOptions);
  }

  onInit () {
    const t = this; // keep original naming convention used across Vanta effects

    let sketch = function (p) {
      let time = 0; // animation time variable

      // 400×400 is the reference resolution of the original sketch. We scale the
      // formula so that it nicely fills any canvas size.
      const base = 400;
      let scaleFactorX, scaleFactorY, offsetX, offsetY;
      let orbitScale;
      let layerOffsets = [];
      const LAYERS = 3;
      const particlesPerLayer = 3300; // ~1/3 of original 10k per frame

      // helper that encapsulates the original one-liner formula
      function drawPoint (x, y) {
        //  Port of the original golfed formula with variable names kept intact for
        //  readability of the port. Uses p5 trigonometric helpers.
        const k = 11 * p.cos(x / 8);
        const e = y / 8 - 12.5;
        const d = p.mag(k, e) ** 3 / 1499 + p.cos(e / 4 + time * 2) / 5 + 1;
        const q = 99 - e * p.sin(e) / d + k * (3 + p.sin(d * d - time * 2));
        const c = d / 2 + e / 99 - time / 8;

        // Raw coordinates in original 400×400 space
        const rawX = q * p.sin(c) * orbitScale + 170;
        const rawY = (q + 19 * d) * orbitScale * p.cos(c) + 200;

        const px = rawX * scaleFactorX + offsetX;
        const py = rawY * scaleFactorY + offsetY;

        p.point(px, py);
      }

      p.setup = function () {
        // Use helper from P5Base to create & attach canvas under effect root element
        t.initP5(p);
        p.noFill();
        p.strokeWeight(1);

        // compute scaling based on current canvas size (square for simplicity)
        const zoom = typeof t.options.zoom === 'number' ? t.options.zoom : 1;
        orbitScale = (typeof t.options.orbitScale === 'number') ? t.options.orbitScale : 1;

        scaleFactorX = (t.width / base) * zoom * 4;
        scaleFactorY = (t.height / base) * zoom * 4;
        offsetX = (t.width - base * scaleFactorX) / 2;
        offsetY = (t.height - base * scaleFactorY) / 2;

        // Precompute per-layer extra offsets (in pixels) after scaling
        const dx = t.width * 0.2;  // 12% of viewport width
        const dy = t.height * 0.2; // 12% of viewport height
        layerOffsets = [
          { x: 0, y: 0 },
          { x: dx, y: dy },
          { x: -dx, y: dy },
        ];
      };

      p.draw = function () {
        // clear frame using background colour option
        p.background(color2Hex(t.options.backgroundColor));
        p.stroke(color2Hex(t.options.color));

        // Advance the time variable. A negative speed value reverses the motion.
        const speed = typeof t.options.speed === 'number' ? t.options.speed : 1;
        time += (p.PI / 90) * speed * 0.12;

        // render each layer with its own offset
        for (let l = 0; l < LAYERS; l++) {
          const extra = layerOffsets[l];
          for (let i = particlesPerLayer; i--;) {
            // temporarily adjust global offsets for this layer
            const prevOX = offsetX;
            const prevOY = offsetY;
            offsetX += extra.x;
            offsetY += extra.y;
            drawPoint(i % 200, i / 59);
            offsetX = prevOX;
            offsetY = prevOY;
          }
        }
      };
    };

    // eslint-disable-next-line no-new
    new p5(sketch);
  }
}

Effect.initClass();
export default VANTA.register('EPHEMERAL', Effect); 