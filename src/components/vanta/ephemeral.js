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
      backgroundColor: 0x000000 // canvas background
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
      let base = 400;
      let scaleFactor;

      // helper that encapsulates the original one-liner formula
      function drawPoint (x, y) {
        //  Port of the original golfed formula with variable names kept intact for
        //  readability of the port. Uses p5 trigonometric helpers.
        const k = 11 * p.cos(x / 8);
        const e = y / 8 - 13;
        const d = p.mag(k, e) ** 3 / 1499 + p.cos(e / 4 + time * 2) / 5 + 1;
        const q = 99 - e * p.sin(e) / d + k * (3 + p.sin(d * d - time * 2));
        const c = d / 2 + e / 50 - time / 8;

        // original sketch draws into a 400×400 coordinate system centred at 200,200.
        // We rescale to the current canvas size.
        const px = (q * p.sin(c) + 300) * scaleFactor-.9;
        const py = (q + 19 * d) * p.cos(c) + 200;

        p.point(px, py * scaleFactor);
      }

      p.setup = function () {
        // Use helper from P5Base to create & attach canvas under effect root element
        t.initP5(p);
        p.noFill();
        p.strokeWeight(1);

        // compute scaling based on current canvas size (square for simplicity)
        const s = Math.min(t.width, t.height);
        scaleFactor = s / base;
      };

      p.draw = function () {
        // clear frame using background colour option
        p.background(color2Hex(t.options.backgroundColor));
        p.stroke(color2Hex(t.options.color));

        time += p.PI / 90;

        // draw 10k points per frame (same as original sketch)
        for (let i = 10000; i--;) {
          drawPoint(i % 200, i / 50);
        }
      };
    };

    // eslint-disable-next-line no-new
    new p5(sketch);
  }
}

Effect.initClass();
export default VANTA.register('EPHEMERAL', Effect); 