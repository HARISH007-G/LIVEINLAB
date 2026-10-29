/**
 * VANNAM Autonomous Rover Spray Path Simulator
 * Simulates real-time vertical crawler path planning:
 * - LiDAR Scan Grid overlay
 * - Serpentine Raster Trajectory across wall mask
 * - Nozzle Mist Particle System in paint color
 * - Real-time Simulated Telemetry HUD (pressure, pass count, micron deposition, remaining time)
 */

export class RoverSimulator {
  constructor() {
    this.isActive = false;
    this.path = [];
    this.currentWaypointIndex = 0;
    this.progressAlongSegment = 0;
    this.speed = 0.015; // Speed per frame
    this.particles = [];
    this.telemetry = {
      xMeters: 2.4,
      yMeters: 4.8,
      depositionMicrons: 250,
      pressureBar: 182,
      currentPass: 1,
      totalPasses: 12,
      estMinutesRemaining: 14,
      estSecondsRemaining: 30
    };
  }

  /**
   * Plan raster path from wall mask bounds
   */
  planPathFromMask(mask, width, height) {
    let minX = width, maxX = 0, minY = height, maxY = 0;
    let foundPixels = 0;

    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        if (mask[y * width + x] > 50) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          foundPixels++;
        }
      }
    }

    if (foundPixels === 0) {
      minX = width * 0.15;
      maxX = width * 0.85;
      minY = height * 0.15;
      maxY = height * 0.80;
    }

    const path = [];
    const rowSpacing = Math.max(30, Math.floor((maxY - minY) / 12));
    let leftToRight = true;

    for (let y = minY + 15; y <= maxY - 15; y += rowSpacing) {
      if (leftToRight) {
        path.push({ x: minX + 20, y });
        path.push({ x: maxX - 20, y });
      } else {
        path.push({ x: maxX - 20, y });
        path.push({ x: minX + 20, y });
      }
      leftToRight = !leftToRight;
    }

    this.path = path;
    this.currentWaypointIndex = 0;
    this.progressAlongSegment = 0;
    this.telemetry.totalPasses = Math.max(4, Math.floor(path.length / 2));
    this.isActive = true;
  }

  stop() {
    this.isActive = false;
    this.particles = [];
  }

  /**
   * Update Rover position and particle physics
   */
  update(paintColorHex) {
    if (!this.isActive || this.path.length < 2) return;

    this.progressAlongSegment += this.speed;
    if (this.progressAlongSegment >= 1.0) {
      this.progressAlongSegment = 0;
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % (this.path.length - 1);
    }

    const p1 = this.path[this.currentWaypointIndex];
    const p2 = this.path[this.currentWaypointIndex + 1];

    const currentX = p1.x + (p2.x - p1.x) * this.progressAlongSegment;
    const currentY = p1.y + (p2.y - p1.y) * this.progressAlongSegment;

    // Spawn spray mist particles
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: currentX + (Math.random() - 0.5) * 16,
        y: currentY + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 3.5 + 1.5,
        alpha: 0.8,
        color: paintColorHex
      });
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.035;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update simulated telemetry
    this.telemetry.currentPass = Math.floor(this.currentWaypointIndex / 2) + 1;
    this.telemetry.xMeters = (currentX * 0.015).toFixed(2);
    this.telemetry.yMeters = ((p1.y) * 0.012).toFixed(2);
    this.telemetry.pressureBar = Math.floor(180 + Math.sin(Date.now() / 300) * 6);
  }

  /**
   * Render Rover HUD, planned path lines, particles, and chassis
   */
  draw(ctx, width, height) {
    if (!this.isActive || this.path.length < 2) return;

    ctx.save();

    // 1. Draw Planned Path Wireframe
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let i = 0; i < this.path.length; i++) {
      if (i === 0) ctx.moveTo(this.path[i].x, this.path[i].y);
      else ctx.lineTo(this.path[i].x, this.path[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Draw Spray Mist Particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color || '#22D3EE';
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 3. Draw Rover Chassis
    const p1 = this.path[this.currentWaypointIndex];
    const p2 = this.path[this.currentWaypointIndex + 1];
    const curX = p1.x + (p2.x - p1.x) * this.progressAlongSegment;
    const curY = p1.y + (p2.y - p1.y) * this.progressAlongSegment;

    // Chassis Glow
    const glow = ctx.createRadialGradient(curX, curY, 5, curX, curY, 35);
    glow.addColorStop(0, 'rgba(138, 235, 255, 0.4)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(curX, curY, 35, 0, Math.PI * 2);
    ctx.fill();

    // Chassis Box
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#22D3EE';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(curX - 18, curY - 14, 36, 28, 4);
    ctx.fill();
    ctx.stroke();

    // Crawler Tracks
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(curX - 22, curY - 16, 6, 32);
    ctx.fillRect(curX + 16, curY - 16, 6, 32);

    // Rover Status Beacon
    ctx.fillStyle = '#22D3EE';
    ctx.beginPath();
    ctx.arc(curX, curY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Nozzle Spray Target Crosshair
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(curX, curY, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}
