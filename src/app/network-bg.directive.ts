import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy
} from '@angular/core';

interface NetNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;     // laki ng tuldok
  depth: number; // 0.4 - 1: mas malapit = mas maliwanag
}

/**
 * Animated na "network / plexus" background na iginuguhit sa canvas.
 * Malinaw sa kahit anong laki ng screen (hindi ito larawan o video).
 *
 * Gamit:  <canvas appNetworkBg></canvas>
 */
@Directive({
  selector: 'canvas[appNetworkBg]',
  standalone: true
})
export class NetworkBgDirective implements AfterViewInit, OnDestroy {
  private ctx!: CanvasRenderingContext2D;
  private nodes: NetNode[] = [];
  private width = 0;
  private height = 0;
  private linkDistance = 150;

  // Liwanag ng buong background: 0 = wala, 1 = pinakamaliwanag. Palitan ito para lumakas o humina.
  private readonly intensity = 0.55;
  private frameId = 0;
  private lastTime = 0;
  private running = false;
  private reduceMotion = false;
  private resizeObserver?: ResizeObserver;
  private visibilityObserver?: IntersectionObserver;

  constructor(
    private readonly el: ElementRef<HTMLCanvasElement>,
    private readonly zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    const canvas = this.el.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.ctx = ctx;
    this.reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Tumatakbo sa labas ng Angular para hindi mag-trigger ng change detection bawat frame
    this.zone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(canvas.parentElement ?? canvas);

      // Humihinto kapag wala sa screen para makatipid sa baterya at CPU
      this.visibilityObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) this.start();
        else this.stop();
      });
      this.visibilityObserver.observe(canvas);
    });

    this.resize();
  }

  ngOnDestroy(): void {
    this.stop();
    this.resizeObserver?.disconnect();
    this.visibilityObserver?.disconnect();
  }

  private resize(): void {
    const canvas = this.el.nativeElement;
    const parent = canvas.parentElement ?? canvas;
    const rect = parent.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;

    canvas.width = Math.round(this.width * dpr);
    canvas.height = Math.round(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.linkDistance = Math.min(190, Math.max(110, this.width / 8));

    const count = Math.max(
      35,
      Math.min(110, Math.round((this.width * this.height) / 15000))
    );
    this.nodes = Array.from({ length: count }, () => this.createNode());

    if (!this.running) this.draw(0);
  }

  private createNode(): NetNode {
    const depth = 0.4 + Math.random() * 0.6;
    const speed = (6 + Math.random() * 16) * depth; // px kada segundo
    const angle = Math.random() * Math.PI * 2;

    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 0.8 + Math.random() * 1.6 * depth,
      depth
    };
  }

  private start(): void {
    if (this.running || this.reduceMotion) return;
    this.running = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(t => this.loop(t));
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.frameId);
  }

  private loop(time: number): void {
    if (!this.running) return;

    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    this.update(dt);
    this.draw(time);
    this.frameId = requestAnimationFrame(t => this.loop(t));
  }

  private update(dt: number): void {
    const margin = 40;

    for (const n of this.nodes) {
      n.x += n.vx * dt;
      n.y += n.vy * dt;

      // paikot: paglabas sa isang gilid, papasok sa kabila
      if (n.x < -margin) n.x = this.width + margin;
      else if (n.x > this.width + margin) n.x = -margin;
      if (n.y < -margin) n.y = this.height + margin;
      else if (n.y > this.height + margin) n.y = -margin;
    }
  }

  private draw(time: number): void {
    const ctx = this.ctx;
    const nodes = this.nodes;
    const maxDist = this.linkDistance;
    const maxSq = maxDist * maxDist;

    ctx.clearRect(0, 0, this.width, this.height);

    // 1) Hanapin ang magkakalapit na tuldok
    const links: number[][] = nodes.map(() => []);
    const strength = new Map<number, number>();

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const sq = dx * dx + dy * dy;

        if (sq < maxSq) {
          links[i].push(j);
          strength.set(i * 1000 + j, 1 - Math.sqrt(sq) / maxDist);
        }
      }
    }

    const edge = (a: number, b: number): number | undefined =>
      strength.get(Math.min(a, b) * 1000 + Math.max(a, b));

    // 2) Mga tatsulok (mahinang kulay, parang salamin)
    ctx.lineWidth = 0;
    for (let i = 0; i < nodes.length; i++) {
      const near = links[i];

      for (let a = 0; a < near.length; a++) {
        for (let b = a + 1; b < near.length; b++) {
          const j = near[a];
          const k = near[b];
          const third = edge(j, k);
          if (third === undefined) continue;

          const s = Math.min(edge(i, j)!, edge(i, k)!, third);
          const pulse = 0.65 + 0.35 * Math.sin(time * 0.0008 + i + j + k);
          const alpha = s * 0.38 * pulse * this.intensity;

          ctx.fillStyle = `rgba(56, 130, 246, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.lineTo(nodes[k].x, nodes[k].y);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    // 3) Mga linya
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (const j of links[i]) {
        const s = edge(i, j)!;
        const depth = (nodes[i].depth + nodes[j].depth) / 2;

        ctx.strokeStyle = `rgba(96, 165, 250, ${Math.min(1, s * 1.0 * depth * this.intensity).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    // 4) Mga tuldok na may glow
    for (const n of nodes) {
      ctx.fillStyle = `rgba(96, 165, 250, ${(0.2 * n.depth * this.intensity).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(191, 219, 254, ${(0.95 * n.depth * this.intensity).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}