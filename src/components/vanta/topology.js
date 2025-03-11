// Original effect by Kjetil Midtgarden Golid
// https://github.com/kgolid/p5ycho/blob/master/topology/sketch.js

import P5Base, {VANTA} from './_p5Base.js'
import {color2Rgb} from './helper.js'

let p5 = (typeof window == 'object') && window.p5

class Effect extends P5Base {
  static initClass() {
    this.prototype.p5 = true
    this.prototype.defaultOptions = {
      color: 0x99b64e,
      backgroundColor: 0x002222,
      speed: 0.9,
      particleCount: 4500,
      particleSize: 1.3,
      flowCellSize: 8,
      noiseSize: 0.005,
      noiseRadius: 0.15,
      offset: 50
    }
  }
  constructor(userOptions) {
    p5 = userOptions.p5 || p5
    super(userOptions)
  }
  onInit() {
    const t = this

    let sketch = function(p) {
      let width = t.width
      let height = t.height
      let offset = t.options.offset || 0;

      // Adjust the offset value to bring the animation into view
      offset = Math.max(0, offset); // Ensure offset is non-negative

      // Get customization options with defaults
      let flow_cell_size = t.options.flowCellSize || 8
      let noise_size = t.options.noiseSize || 0.005
      let noise_radius = t.options.noiseRadius || 0.15
      let number_of_particles = t.options.particleCount || 6000
      const particleSize = t.options.particleSize || 1.5
      const speed = t.options.speed || 1.0

      // Calculate flow grid dimensions once
      let flow_width = Math.ceil((width + offset * 2) / flow_cell_size)
      let flow_height = Math.ceil((height + offset * 2) / flow_cell_size)

      let flow_grid = []
      let particles = []
      let frameCount = 0
      let lastFrameTime = 0
      let frameRateFactor = 1.0
      
      // Store current color for efficient updates
      let currentColor = t.options.color
      let currentBgColor = t.options.backgroundColor
      
      p.setup = function() {
        t.initP5(p) // sets bg too
        p.smooth()
        p.noStroke()
        
        // Initialize particles and flow
        init_particles()
        init_flow()
        
        // Set a reasonable framerate for balance between performance and visual quality
        p.frameRate(60)
      }
      
      p.draw = function() {
        // Check if colors have changed
        if (currentColor !== t.options.color || currentBgColor !== t.options.backgroundColor) {
          currentColor = t.options.color
          currentBgColor = t.options.backgroundColor
          
          // Update canvas background color
          if (p.canvas) {
            p.canvas.style.backgroundColor = color2Rgb(currentBgColor, 1)
          }
        }
        
        // Calculate frame rate factor to maintain consistent animation speed
        const currentTime = p.millis()
        if (lastFrameTime > 0) {
          const idealFrameTime = 1000 / 60 // 60 FPS
          const actualFrameTime = currentTime - lastFrameTime
          frameRateFactor = Math.min(2.0, Math.max(0.5, actualFrameTime / idealFrameTime))
        }
        lastFrameTime = currentTime;
        
        // Clear the canvas and draw all particles
        p.clear() // Use clear instead of background for better performance
        p.translate(-offset, -offset)
        update_particles()
        display_particles()
        
        frameCount++
      }

      function init_particles() {
        // Pre-allocate particles array for better performance
        particles = new Array(number_of_particles)
        for (let i = 0; i < number_of_particles; i++) {
          let r = p.random(p.width + 2 * offset)
          let q = p.random(p.height + 2 * offset)
          particles[i] = {
            prev: p.createVector(r, q),
            pos: p.createVector(r, q),
            vel: p.createVector(0, 0),
            acc: p.createVector(0, 0),
            seed: i
          }
        }
      }

      function update_particles() {
        // Update all particles for visual quality
        for (let i = 0; i < number_of_particles; i++) {
          let prt = particles[i]
          let flow = get_flow(prt.pos.x, prt.pos.y)

          prt.prev.x = prt.pos.x
          prt.prev.y = prt.pos.y

          // Apply velocity with frame rate compensation
          const adjustedSpeed = speed * frameRateFactor
          prt.pos.x = mod(prt.pos.x + prt.vel.x * adjustedSpeed, p.width + 2 * offset)
          prt.pos.y = mod(prt.pos.y + prt.vel.y * adjustedSpeed, p.height + 2 * offset)

          prt.vel
            .add(prt.acc)
            .normalize()
            // Adjust velocity based on speed option
            .mult(2.2 * adjustedSpeed)

          prt.acc = p.createVector(0, 0)
          // Adjust acceleration based on speed option
          prt.acc.add(flow).mult(3 * adjustedSpeed)
        }
      }

      function init_flow() {
        // Pre-allocate flow grid for better performance
        flow_grid = new Array(flow_height)
        for (let i = 0; i < flow_height; i++) {
          flow_grid[i] = new Array(flow_width)
          for (let j = 0; j < flow_width; j++) {
            flow_grid[i][j] = calculate_flow(j * noise_size, i * noise_size, noise_radius)
          }
        }
      }

      function calculate_flow(x, y, r) {
        let high_val = 0
        let low_val = 1
        let high_pos = p.createVector(0, 0)
        let low_pos = p.createVector(0, 0)

        // Use enough sampling points for good visual quality
        const samplePoints = 60
        for (let i = 0; i < samplePoints; i++) {
          let angle = i / samplePoints * p.TAU
          let pos = p.createVector(x + p.cos(angle) * r, y + p.sin(angle) * r)
          let val = p.noise(pos.x, pos.y)

          if (val > high_val) {
            high_val = val
            high_pos.x = pos.x
            high_pos.y = pos.y
          }
          if (val < low_val) {
            low_val = val
            low_pos.x = pos.x
            low_pos.y = pos.y
          }
        }

        let flow_angle = p.createVector(low_pos.x - high_pos.x, low_pos.y - high_pos.y)
        flow_angle.normalize().mult(high_val - low_val)

        return flow_angle
      }

      function get_flow(xpos, ypos) {
        xpos = p.constrain(xpos, 0, p.width + offset * 2 - 1)
        ypos = p.constrain(ypos, 0, p.height + offset * 2 - 1)
        const x = Math.floor(xpos / flow_cell_size)
        const y = Math.floor(ypos / flow_cell_size)
        // Add bounds checking to prevent errors
        if (y >= 0 && y < flow_grid.length && x >= 0 && x < flow_grid[y].length) {
          return flow_grid[y][x]
        }
        return p.createVector(0, 0)
      }

      function display_particles() {
        // Adjust stroke weight based on particleSize option
        p.strokeWeight(particleSize)
        // Use a more opaque stroke for better visual effect
        p.stroke(color2Rgb(t.options.color, 0.15))
        
        // Draw all particles for better visual quality
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i]
          if (p5.Vector.dist(particle.prev, particle.pos) < 10 * speed) {
            p.line(particle.prev.x, particle.prev.y, particle.pos.x, particle.pos.y)
          }
        }
      }

      function mod(x, n) {
        return (x % n + n) % n
      }
    }
    new p5(sketch)
  }
  
  // Add a setOptions method to update options without reinitializing
  setOptions(options = {}) {
    // Store previous options for comparison
    const prevOptions = { ...this.options }
    
    // Update options
    Object.assign(this.options, options)
    
    // No need to do anything else - the draw loop will handle color changes
    // This prevents the animation from restarting on color changes
  }
}
Effect.initClass()
export default VANTA.register('TOPOLOGY', Effect)