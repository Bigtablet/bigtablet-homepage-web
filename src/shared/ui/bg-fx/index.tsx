"use client";

import { useEffect, useRef } from "react";
import styles from "./style.module.scss";

/**
 * @component BgFx
 *
 * @description
 * 섹션 배경 캔버스 모션그래픽. variant 로 렌더러를 선택한다.
 * - vision    : 히어로 — 떠다니는 노드/연결선 + 탐지 박스
 * - people    : 문제 섹션 — 걷는 사람 + 다수 CCTV 카메라(시야 콘·REC)
 * - processor : 작동 원리 — CPU/GPU 다이(핀·코어 연산 웨이브)
 * - frames    : 모트 — 무거운 영상 프레임이 한 프로세서로 적체 → 적색 과부하
 * - signals   : 검증&모멘텀 — 떠오르는 입자 + 검증 핑 링
 * - capture   : CTA — 뷰파인더 + 셔터 플래시 + YOLO 랜덤 디텍션
 *
 * 성능: devicePixelRatio 스케일 · IntersectionObserver 로 화면 안일 때만 rAF 구동 ·
 *       prefers-reduced-motion 이면 정적 1프레임 · 탭 숨김 시 정지.
 *
 * 부모 섹션엔 position:relative; overflow:hidden 을 주고, 컨텐츠 래퍼엔 z-index:1 을 준다.
 */

const ACC = "79,209,197";

type Ctx = CanvasRenderingContext2D;
// biome-ignore lint/suspicious/noExplicitAny: 캔버스 애니메이션 상태는 변종별로 동적이다
type FxState = any;

export type BgFxVariant = "vision" | "people" | "processor" | "frames" | "signals" | "capture";

interface Renderer {
	init?: (s: FxState, W: number, H: number) => void;
	draw: (c: Ctx, s: FxState, W: number, H: number, t: number) => void;
}

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const RENDERERS: Record<BgFxVariant, Renderer> = {
	vision: {
		init(s, W) {
			const n = Math.round(Math.min(56, Math.max(24, W / 28)));
			s.pts = [];
			for (let i = 0; i < n; i++)
				s.pts.push({
					x: Math.random() * W,
					y: Math.random() * 600,
					vx: (Math.random() - 0.5) * 0.22,
					vy: (Math.random() - 0.5) * 0.22,
				});
			s.boxes = [];
		},
		draw(c, s, W, H, t) {
			for (const p of s.pts) {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0) p.x += W;
				else if (p.x > W) p.x -= W;
				if (p.y < 0) p.y += H;
				else if (p.y > H) p.y -= H;
			}
			for (let a = 0; a < s.pts.length; a++)
				for (let b = a + 1; b < s.pts.length; b++) {
					const dx = s.pts[a].x - s.pts[b].x;
					const dy = s.pts[a].y - s.pts[b].y;
					const d2 = dx * dx + dy * dy;
					if (d2 < 13500) {
						c.strokeStyle = `rgba(255,255,255,${(1 - d2 / 13500) * 0.16})`;
						c.lineWidth = 1;
						c.beginPath();
						c.moveTo(s.pts[a].x, s.pts[a].y);
						c.lineTo(s.pts[b].x, s.pts[b].y);
						c.stroke();
					}
				}
			c.fillStyle = "rgba(255,255,255,.3)";
			for (const p of s.pts) {
				c.beginPath();
				c.arc(p.x, p.y, 1.4, 0, 6.283);
				c.fill();
			}
			for (let i = s.boxes.length - 1; i >= 0; i--) {
				const bx = s.boxes[i];
				const prog = (t - bx.born) / bx.life;
				if (prog >= 1) {
					s.boxes.splice(i, 1);
					continue;
				}
				const fade = prog < 0.12 ? prog / 0.12 : prog > 0.85 ? (1 - prog) / 0.15 : 1;
				const p = s.pts[bx.i];
				const sz = 20;
				const x = p.x - sz;
				const y = p.y - sz;
				const L = 8;
				c.strokeStyle = `rgba(${ACC},${0.8 * fade})`;
				c.lineWidth = 1.5;
				const cs = [
					[x, y, 1, 1],
					[x + 2 * sz, y, -1, 1],
					[x, y + 2 * sz, 1, -1],
					[x + 2 * sz, y + 2 * sz, -1, -1],
				];
				for (const k of cs) {
					c.beginPath();
					c.moveTo(k[0], k[1] + k[3] * L);
					c.lineTo(k[0], k[1]);
					c.lineTo(k[0] + k[2] * L, k[1]);
					c.stroke();
				}
				c.fillStyle = `rgba(${ACC},${fade})`;
				c.beginPath();
				c.arc(p.x, p.y, 2.2, 0, 6.283);
				c.fill();
				c.font = "10px ui-monospace,Menlo,monospace";
				c.fillText(bx.label, x, y - 6);
			}
			if (s.boxes.length < 3 && Math.random() < 0.025 && s.pts.length)
				s.boxes.push({
					i: (Math.random() * s.pts.length) | 0,
					born: t,
					life: 2400 + Math.random() * 1900,
					label: `ID·${10 + ((Math.random() * 89) | 0)}`,
				});
		},
	},

	people: {
		init(s, W, H) {
			const n = Math.max(5, Math.min(9, (W / 170) | 0));
			s.w = [];
			for (let i = 0; i < n; i++)
				s.w.push({
					x: Math.random() * W,
					y: H * (0.5 + Math.random() * 0.3),
					sp: 0.22 + Math.random() * 0.5,
					dir: Math.random() < 0.5 ? 1 : -1,
					ph: Math.random() * 6.28,
					h: 46 + Math.random() * 30,
				});
			const cn = Math.max(4, Math.min(8, (W / 210) | 0));
			s.cams = [];
			for (let i = 0; i < cn; i++)
				s.cams.push({
					x: ((i + 0.5) / cn) * W,
					y: H * 0.14,
					ph: Math.random() * 6.28,
					sp: 0.0006 + Math.random() * 0.0006,
				});
		},
		draw(c, s, _W, H, t) {
			for (const cam of s.cams) {
				const ang = Math.PI / 2 + Math.sin(t * cam.sp + cam.ph) * 0.34;
				const len = H * 0.7;
				const sp = 0.3;
				const a1 = ang - sp;
				const a2 = ang + sp;
				c.fillStyle = "rgba(255,255,255,.022)";
				c.beginPath();
				c.moveTo(cam.x, cam.y);
				c.lineTo(cam.x + Math.cos(a1) * len, cam.y + Math.sin(a1) * len);
				c.lineTo(cam.x + Math.cos(a2) * len, cam.y + Math.sin(a2) * len);
				c.closePath();
				c.fill();
				c.strokeStyle = `rgba(${ACC},.1)`;
				c.lineWidth = 1;
				c.beginPath();
				c.moveTo(cam.x, cam.y);
				c.lineTo(cam.x + Math.cos(a1) * len, cam.y + Math.sin(a1) * len);
				c.moveTo(cam.x, cam.y);
				c.lineTo(cam.x + Math.cos(a2) * len, cam.y + Math.sin(a2) * len);
				c.stroke();
			}
			for (const p of s.w) {
				p.x += p.sp * p.dir;
				if (p.x < -40) p.x = _W + 40;
				else if (p.x > _W + 40) p.x = -40;
				const h = p.h;
				const x = p.x;
				const gait = t * 0.006 + p.ph;
				const y = p.y - Math.abs(Math.sin(gait)) * h * 0.03;
				const col = "rgba(255,255,255,.26)";
				c.strokeStyle = col;
				c.fillStyle = col;
				c.lineCap = "round";
				const headR = h * 0.12;
				const headCY = y - h * 0.46;
				const shoulderY = headCY + headR * 1.5;
				const hipY = y + h * 0.1;
				const legLen = h * 0.36;
				const legSw = Math.sin(gait) * h * 0.18;
				const armSw = Math.sin(gait + Math.PI) * h * 0.12;
				c.beginPath();
				c.arc(x, headCY, headR, 0, 6.283);
				c.fill();
				c.lineWidth = h * 0.15;
				c.beginPath();
				c.moveTo(x, shoulderY);
				c.lineTo(x, hipY);
				c.stroke();
				c.lineWidth = h * 0.055;
				c.beginPath();
				c.moveTo(x, shoulderY + h * 0.03);
				c.lineTo(x - armSw, shoulderY + h * 0.2);
				c.stroke();
				c.beginPath();
				c.moveTo(x, shoulderY + h * 0.03);
				c.lineTo(x + armSw, shoulderY + h * 0.2);
				c.stroke();
				c.lineWidth = h * 0.07;
				c.beginPath();
				c.moveTo(x, hipY);
				c.lineTo(x - legSw, hipY + legLen);
				c.stroke();
				c.beginPath();
				c.moveTo(x, hipY);
				c.lineTo(x + legSw, hipY + legLen);
				c.stroke();
				c.lineCap = "butt";
			}
			const rec = Math.floor(t / 640) % 2 === 0;
			for (const cam of s.cams) {
				const ang = Math.PI / 2 + Math.sin(t * cam.sp + cam.ph) * 0.34;
				c.strokeStyle = "rgba(255,255,255,.32)";
				c.lineWidth = 3;
				c.beginPath();
				c.moveTo(cam.x, cam.y);
				c.lineTo(cam.x, Math.max(0, cam.y - 26));
				c.stroke();
				c.save();
				c.translate(cam.x, cam.y);
				c.rotate(ang);
				c.fillStyle = "rgba(255,255,255,.52)";
				c.fillRect(-13, -9, 34, 18);
				c.fillStyle = "rgba(255,255,255,.32)";
				c.fillRect(-13, -13, 12, 5);
				c.fillStyle = "rgba(12,16,22,.95)";
				c.beginPath();
				c.arc(23, 0, 6, 0, 6.283);
				c.fill();
				c.strokeStyle = `rgba(${ACC},.7)`;
				c.lineWidth = 1.6;
				c.beginPath();
				c.arc(23, 0, 6, 0, 6.283);
				c.stroke();
				c.fillStyle = `rgba(${ACC},.6)`;
				c.beginPath();
				c.arc(23, 0, 2, 0, 6.283);
				c.fill();
				c.restore();
				if (rec) {
					c.fillStyle = "rgba(255,90,90,.85)";
					c.beginPath();
					c.arc(cam.x + 10, cam.y - 22, 2.5, 0, 6.283);
					c.fill();
				}
			}
		},
	},

	processor: {
		init(s, W, H) {
			const cx = W / 2;
			const cy = H / 2;
			const cs = Math.max(72, Math.min(150, Math.min(W, H) * 0.2));
			s.chip = { x: cx - cs, y: cy - cs, s: cs * 2 };
			s.g = 6;
			s.lines = [];
			const n = 6;
			for (let k = 0; k < n; k++) {
				const fy = cy - cs + (cs * 2 * (k + 0.5)) / n;
				s.lines.push({ y: fy, x0: 0, x1: cx - cs });
				s.lines.push({ y: fy, x0: W, x1: cx + cs });
			}
		},
		draw(c, s, _W, _H, t) {
			const ch = s.chip;
			const cx = ch.x + ch.s / 2;
			const g = s.g;
			for (let i = 0; i < s.lines.length; i++) {
				const L = s.lines[i];
				c.strokeStyle = "rgba(255,255,255,.08)";
				c.lineWidth = 1;
				c.beginPath();
				c.moveTo(L.x0, L.y);
				c.lineTo(L.x1, L.y);
				c.stroke();
				const pr = (t * 0.00022 + i * 0.11) % 1;
				const px = L.x0 + (L.x1 - L.x0) * pr;
				c.fillStyle = `rgba(${ACC},.85)`;
				c.beginPath();
				c.arc(px, L.y, 2.2, 0, 6.283);
				c.fill();
			}
			c.strokeStyle = `rgba(${ACC},.5)`;
			c.lineWidth = 2;
			c.strokeRect(ch.x, ch.y, ch.s, ch.s);
			c.strokeStyle = "rgba(255,255,255,.2)";
			c.lineWidth = 1.5;
			const pn = 10;
			const pl = 6;
			for (let k = 0; k < pn; k++) {
				const f = ((k + 0.5) / pn) * ch.s;
				c.beginPath();
				c.moveTo(ch.x + f, ch.y);
				c.lineTo(ch.x + f, ch.y - pl);
				c.stroke();
				c.beginPath();
				c.moveTo(ch.x + f, ch.y + ch.s);
				c.lineTo(ch.x + f, ch.y + ch.s + pl);
				c.stroke();
				c.beginPath();
				c.moveTo(ch.x, ch.y + f);
				c.lineTo(ch.x - pl, ch.y + f);
				c.stroke();
				c.beginPath();
				c.moveTo(ch.x + ch.s, ch.y + f);
				c.lineTo(ch.x + ch.s + pl, ch.y + f);
				c.stroke();
			}
			const pad = ch.s * 0.15;
			const die = ch.s - pad * 2;
			const cw = die / g;
			c.strokeStyle = "rgba(255,255,255,.14)";
			c.lineWidth = 1;
			c.strokeRect(ch.x + pad, ch.y + pad, die, die);
			for (let gy = 0; gy < g; gy++)
				for (let gx = 0; gx < g; gx++) {
					const wv = Math.sin(t * 0.004 - (gx + gy) * 0.5) * 0.5 + 0.5;
					c.fillStyle = `rgba(${ACC},${0.06 + wv * 0.4})`;
					c.fillRect(ch.x + pad + gx * cw + 1.5, ch.y + pad + gy * cw + 1.5, cw - 3, cw - 3);
				}
			c.fillStyle = "rgba(255,255,255,.4)";
			c.font = "bold 11px ui-monospace,Menlo,monospace";
			c.textAlign = "center";
			c.fillText("VCM · GPU", cx, ch.y + ch.s + pl + 15);
			c.textAlign = "start";
		},
	},

	frames: {
		init(s, W, H) {
			const cs = Math.max(58, Math.min(120, Math.min(W, H) * 0.17));
			s.proc = { x: W * 0.72, y: H * 0.5, s: cs };
			s.in = [];
			s.spawnT = 0;
			s.consumeT = 0;
			s.q = 0;
		},
		draw(c, s, _W, H, t) {
			const P = s.proc;
			const cx = P.x;
			const cy = P.y;
			const cs = P.s;
			const qx = cx - cs * 0.6;
			const FW = 46;
			const FH = 28;
			if (t - s.spawnT > 540) {
				s.spawnT = t;
				s.in.push({ x: -FW, y: cy + (Math.random() - 0.5) * H * 0.5 });
			}
			if (t - s.consumeT > 1600) {
				s.consumeT = t;
				if (s.q > 0) s.q--;
			}
			for (let i = s.in.length - 1; i >= 0; i--) {
				const it = s.in[i];
				it.x += 1.5;
				it.y += (cy - it.y) * 0.028;
				if (it.x >= qx - FW - 2) {
					s.in.splice(i, 1);
					if (s.q < 12) s.q++;
				}
			}
			const hf = (x: number, y: number, a: number, col: string) => {
				c.fillStyle = `rgba(${col},${0.09 * a})`;
				c.fillRect(x, y, FW, FH);
				c.strokeStyle = `rgba(${col},${0.6 * a})`;
				c.lineWidth = 1.2;
				c.strokeRect(x, y, FW, FH);
				const hz = y + FH * 0.56;
				c.strokeStyle = `rgba(255,255,255,${0.1 * a})`;
				c.beginPath();
				c.moveTo(x, hz);
				c.lineTo(x + FW, hz);
				c.stroke();
				c.fillStyle = `rgba(${col},${0.5 * a})`;
				c.font = "7px ui-monospace,Menlo,monospace";
				c.fillText("8.0MB", x + 3, y + FH - 4);
			};
			for (const it of s.in) hf(it.x, it.y - FH / 2, 0.85, "255,255,255");
			const qn = Math.min(s.q, 9);
			const load = Math.min(1, s.q / 9);
			const mix = (l: number) =>
				`${Math.round(79 + 156 * l)},${Math.round(209 - 129 * l)},${Math.round(197 - 127 * l)}`;
			for (let k = qn - 1; k >= 0; k--) {
				const jx = Math.sin(t * 0.003 + k) * 1.2;
				const fx = qx - k * 5 + jx;
				const fy = cy - FH / 2 - k * 12;
				const fl = Math.min(1, load * (0.5 + 0.7 * (k / Math.max(1, qn - 1))));
				hf(fx, fy, 0.65 + (k === 0 ? 0.3 : 0.1), mix(fl));
			}
			const pcol = mix(load);
			const pls = load > 0.85 ? Math.sin(t * 0.012) * 0.5 + 0.5 : 0;
			c.strokeStyle = `rgba(${pcol},${0.5 + 0.35 * load})`;
			c.lineWidth = 2 + load * 1.6;
			c.strokeRect(cx - cs / 2, cy - cs / 2, cs, cs);
			if (pls > 0) {
				c.strokeStyle = `rgba(${mix(1)},${0.5 * pls})`;
				c.lineWidth = 4;
				c.strokeRect(cx - cs / 2 - 3, cy - cs / 2 - 3, cs + 6, cs + 6);
			}
			const g = 4;
			const pad = cs * 0.16;
			const inn = cs - pad * 2;
			const cw = inn / g;
			for (let gy = 0; gy < g; gy++)
				for (let gx = 0; gx < g; gx++) {
					const a = (Math.sin(t * 0.0015 - (gx + gy) * 0.5) * 0.5 + 0.5) * 0.3;
					c.fillStyle = `rgba(${pcol},${0.05 + a})`;
					c.fillRect(
						cx - cs / 2 + pad + gx * cw + 1,
						cy - cs / 2 + pad + gy * cw + 1,
						cw - 2,
						cw - 2,
					);
				}
			const ang = (t * 0.0013) % (Math.PI * 2);
			c.strokeStyle = `rgba(${pcol},.75)`;
			c.lineWidth = 2;
			c.beginPath();
			c.arc(cx, cy, cs * 0.32, ang, ang + Math.PI * 0.55);
			c.stroke();
			c.textAlign = "center";
			c.font = "bold 10px ui-monospace,Menlo,monospace";
			c.fillStyle = load > 0.8 ? `rgba(${mix(1)},.92)` : "rgba(255,255,255,.42)";
			c.fillText(load > 0.8 ? "⚠ OVERLOAD" : "◷ slow", cx, cy + cs / 2 + 15);
			c.textAlign = "start";
			c.fillStyle = `rgba(${mix(load)},${0.6 + 0.3 * load})`;
			c.fillText(`QUEUE +${s.q}`, qx - 74, cy - cs / 2 - 8);
		},
	},

	signals: {
		init(s, W, H) {
			const n = Math.max(18, Math.min(56, ((W * H) / 15000) | 0));
			s.dots = [];
			for (let i = 0; i < n; i++)
				s.dots.push({
					x: Math.random() * W,
					y: Math.random() * H,
					vy: -(0.08 + Math.random() * 0.24),
					r: 0.5 + Math.random() * 1.3,
				});
			s.pings = [];
			s.pt = 0;
		},
		draw(c, s, W, H, t) {
			for (const d of s.dots) {
				d.y += d.vy;
				if (d.y < -4) {
					d.y = H + 4;
					d.x = Math.random() * W;
				}
				c.fillStyle = "rgba(255,255,255,.16)";
				c.beginPath();
				c.arc(d.x, d.y, d.r, 0, 6.283);
				c.fill();
			}
			if (t - s.pt > 1300) {
				s.pt = t;
				s.pings.push({
					x: W * (0.12 + Math.random() * 0.76),
					y: H * (0.18 + Math.random() * 0.64),
					t0: t,
				});
			}
			for (let i = s.pings.length - 1; i >= 0; i--) {
				const p = s.pings[i];
				const age = (t - p.t0) / 1700;
				if (age >= 1) {
					s.pings.splice(i, 1);
					continue;
				}
				const rr = age * Math.min(W, H) * 0.17;
				const al = (1 - age) * 0.5;
				c.strokeStyle = `rgba(${ACC},${al})`;
				c.lineWidth = 1.2;
				c.beginPath();
				c.arc(p.x, p.y, rr, 0, 6.283);
				c.stroke();
				c.fillStyle = `rgba(${ACC},${al * 0.9})`;
				c.beginPath();
				c.arc(p.x, p.y, 2, 0, 6.283);
				c.fill();
			}
		},
	},

	capture: {
		init(s) {
			s.period = 4600;
			s.cyc = -1;
			s.pool = [
				"person",
				"worker",
				"forklift",
				"helmet",
				"pallet",
				"cart",
				"vehicle",
				"box",
				"defect",
				"bag",
				"ladder",
				"spill",
				"tray",
				"crate",
			];
			s.dets = [];
		},
		draw(c, s, W, H, t) {
			const per = s.period;
			const cyc = Math.floor(t / per);
			if (cyc !== s.cyc) {
				s.cyc = cyc;
				const n = 3 + ((Math.random() * 4) | 0);
				s.dets = [];
				for (let i = 0; i < n; i++) {
					const w = 0.07 + Math.random() * 0.12;
					const hh = 0.1 + Math.random() * 0.28;
					const x = 0.1 + Math.random() * (0.8 - w);
					const y = 0.16 + Math.random() * (0.66 - hh);
					s.dets.push({
						x,
						y,
						w,
						h: hh,
						l: `${s.pool[(Math.random() * s.pool.length) | 0]} ${(0.71 + Math.random() * 0.27).toFixed(2)}`,
					});
				}
			}
			const m = Math.min(W, H) * 0.06;
			const L = Math.min(W, H) * 0.11;
			const bx = m;
			const by = m;
			const bw = W - m * 2;
			const bh = H - m * 2;
			const cx = W / 2;
			const cy = H / 2;
			const ph = (t % per) / per;
			c.strokeStyle = "rgba(255,255,255,.2)";
			c.lineWidth = 2;
			const vc = [
				[bx, by, 1, 1],
				[bx + bw, by, -1, 1],
				[bx, by + bh, 1, -1],
				[bx + bw, by + bh, -1, -1],
			];
			for (const q of vc) {
				c.beginPath();
				c.moveTo(q[0], q[1] + q[3] * L);
				c.lineTo(q[0], q[1]);
				c.lineTo(q[0] + q[2] * L, q[1]);
				c.stroke();
			}
			const aim = ph > 0.87 ? (ph - 0.87) / 0.13 : 0;
			if (aim > 0) {
				const rs = Math.min(W, H) * (0.14 - 0.05 * aim);
				const rl = rs * 0.4;
				c.strokeStyle = `rgba(${ACC},${0.35 + 0.5 * aim})`;
				c.lineWidth = 1.5;
				const rc = [
					[cx - rs, cy - rs, 1, 1],
					[cx + rs, cy - rs, -1, 1],
					[cx - rs, cy + rs, 1, -1],
					[cx + rs, cy + rs, -1, -1],
				];
				for (const q of rc) {
					c.beginPath();
					c.moveTo(q[0], q[1] + q[3] * rl);
					c.lineTo(q[0], q[1]);
					c.lineTo(q[0] + q[2] * rl, q[1]);
					c.stroke();
				}
				c.beginPath();
				c.moveTo(cx - 6, cy);
				c.lineTo(cx + 6, cy);
				c.moveTo(cx, cy - 6);
				c.lineTo(cx, cy + 6);
				c.stroke();
				c.fillStyle = `rgba(${ACC},${0.55 * aim})`;
				c.font = "bold 10px ui-monospace,Menlo,monospace";
				c.fillText("AF ●", cx + rs + 8, cy - rs + 4);
			}
			const bs = 0.05;
			const be = 0.84;
			if (ph > bs && ph < be + 0.02) {
				const loc = (ph - bs) / (be - bs);
				c.font = "bold 10px ui-monospace,Menlo,monospace";
				c.textAlign = "start";
				for (let i = 0; i < s.dets.length; i++) {
					const d = s.dets[i];
					const ap = clamp((loc - i * 0.06) / 0.12);
					const fd = loc > 0.84 ? clamp(1 - (loc - 0.84) / 0.16) : 1;
					const a = ap * fd;
					if (a <= 0) continue;
					const X = d.x * W;
					const Y = d.y * H;
					const Wd = d.w * W;
					const Hd = d.h * H;
					const sc = 1 + (1 - ap) * 0.07;
					const ox = X - (Wd * (sc - 1)) / 2;
					const oy = Y - (Hd * (sc - 1)) / 2;
					const ow = Wd * sc;
					const oh = Hd * sc;
					c.strokeStyle = `rgba(${ACC},${0.92 * a})`;
					c.lineWidth = 1.8;
					c.strokeRect(ox, oy, ow, oh);
					const tw = c.measureText(d.l).width + 10;
					c.fillStyle = `rgba(${ACC},${0.9 * a})`;
					c.fillRect(ox, oy - 13, tw, 13);
					c.fillStyle = `rgba(7,9,13,${a})`;
					c.fillText(d.l, ox + 5, oy - 3);
				}
				c.fillStyle = `rgba(${ACC},.55)`;
				c.fillText(`● DETECT · ${s.dets.length} objects`, bx + 4, by + bh + 1);
			}
			const fl = ph < 0.05 ? 1 - ph / 0.05 : 0;
			if (fl > 0) {
				c.fillStyle = `rgba(255,255,255,${fl * 0.62})`;
				c.fillRect(0, 0, W, H);
			}
		},
	},
};

interface BgFxProps {
	variant: BgFxVariant;
	/** 캔버스 불투명도 (기본 0.6) */
	opacity?: number;
	className?: string;
}

const BgFx = ({ variant, opacity = 0.6, className }: BgFxProps) => {
	const ref = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const cv = ref.current;
		if (!cv) return;
		const ctx = cv.getContext("2d");
		if (!ctx) return;

		const R = RENDERERS[variant];
		const reduce =
			typeof window !== "undefined" &&
			window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		let W = 0;
		let H = 0;
		let raf = 0;
		let visible = false;
		const state: FxState = {};

		const size = () => {
			const r = cv.getBoundingClientRect();
			W = r.width;
			H = r.height;
			cv.width = Math.max(1, W * dpr);
			cv.height = Math.max(1, H * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			R.init?.(state, W, H);
		};
		const frame = (t: number) => {
			ctx.clearRect(0, 0, W, H);
			R.draw(ctx, state, W, H, t);
		};
		const loop = (t: number) => {
			frame(t || 0);
			raf = requestAnimationFrame(loop);
		};
		const start = () => {
			cancelAnimationFrame(raf);
			if (reduce) {
				frame(0);
				return;
			}
			raf = requestAnimationFrame(loop);
		};
		const stop = () => {
			cancelAnimationFrame(raf);
			raf = 0;
		};

		size();

		const io = new IntersectionObserver(
			(entries) => {
				visible = entries[0].isIntersecting;
				if (visible) start();
				else stop();
			},
			{ threshold: 0.01 },
		);
		io.observe(cv);

		const ro = new ResizeObserver(() => size());
		ro.observe(cv);

		const onVis = () => {
			if (document.hidden) stop();
			else if (visible && !reduce) start();
		};
		document.addEventListener("visibilitychange", onVis);

		return () => {
			stop();
			io.disconnect();
			ro.disconnect();
			document.removeEventListener("visibilitychange", onVis);
		};
	}, [variant]);

	return (
		<canvas ref={ref} className={`${styles.fx} ${className ?? ""}`} style={{ opacity }} />
	);
};

export default BgFx;
