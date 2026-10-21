/**
 * Schematic side-view line drawings of vehicle categories. Generic and
 * unbranded by design: they illustrate a category, not a specific Airzone
 * vehicle, model or dimension.
 */
export type VehicleKind = 'tractor' | 'box' | 'flatbed' | 'curtain' | 'container' | 'lowbed' | 'rigid5' | 'rigid7' | 'van';

function Wheel({ x }: { x: number }) {
  return <g className="vi-wheel"><circle cx={x} cy={104} r={11} /><circle cx={x} cy={104} r={4} className="vi-hub" /></g>;
}

function Tractor({ x = 0 }: { x?: number }) {
  return <g transform={`translate(${x} 0)`}>
    <path className="vi-body" d="M236 96V50q0-8 8-8h30q8 0 12 7l12 20q2 3 2 7v20z" />
    <path className="vi-glass" d="M247 50h25l11 18h-36z" />
    <path className="vi-line" d="M236 78h64M262 42v54" />
    <rect className="vi-accent" x="292" y="84" width="8" height="6" rx="1" />
    <Wheel x={256} /><Wheel x={286} />
  </g>;
}

function Chassis({ from = 16, to = 236 }: { from?: number; to?: number }) {
  return <rect className="vi-chassis" x={from} y={92} width={to - from} height={5} rx={1} />;
}

export function VehicleIllustration({ kind, title }: { kind: VehicleKind; title?: string }) {
  return <svg className={`vi vi-${kind}`} viewBox="0 0 320 124" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} focusable="false">
    {title && <title>{title}</title>}
    <line className="vi-ground" x1="4" y1="116" x2="316" y2="116" />
    {kind === 'tractor' && <g transform="translate(-262 -66) scale(1.58)"><Tractor /><rect className="vi-chassis" x="214" y="92" width="26" height="5" rx="1" /></g>}
    {kind === 'box' && <>
      <rect className="vi-body" x="14" y="26" width="214" height="64" rx="3" />
      <path className="vi-line" d="M14 36h214" /><Chassis /><Wheel x={58} /><Wheel x={84} /><Wheel x={110} /><Tractor />
    </>}
    {kind === 'curtain' && <>
      <rect className="vi-body" x="14" y="26" width="214" height="64" rx="3" />
      <path className="vi-line" d="M14 34h214M14 84h214" />
      {Array.from({ length: 13 }, (_, i) => <path key={i} className="vi-thin" d={`M${28 + i * 15} 36v46`} />)}
      <Chassis /><Wheel x={58} /><Wheel x={84} /><Wheel x={110} /><Tractor />
    </>}
    {kind === 'flatbed' && <>
      <rect className="vi-body" x="14" y="80" width="214" height="11" rx="2" />
      <rect className="vi-cargo" x="34" y="52" width="62" height="28" rx="2" />
      <rect className="vi-cargo" x="104" y="60" width="54" height="20" rx="2" />
      <path className="vi-thin" d="M40 52l-6 28M90 52l6 28M110 60l-6 20M152 60l6 20" />
      <Chassis /><Wheel x={58} /><Wheel x={84} /><Wheel x={110} /><Tractor />
    </>}
    {kind === 'container' && <>
      <rect className="vi-body" x="16" y="30" width="210" height="58" rx="2" />
      {Array.from({ length: 20 }, (_, i) => <path key={i} className="vi-thin" d={`M${26 + i * 10} 34v50`} />)}
      <Chassis /><Wheel x={58} /><Wheel x={84} /><Wheel x={110} /><Tractor />
    </>}
    {kind === 'lowbed' && <>
      <path className="vi-body" d="M10 98h170v-8l14-14h42v14h-30l-10 8z" />
      <path className="vi-cargo" d="M44 92V64h50l16 14v14zM56 64V50h26v14M110 78l34-26 6 6-30 24" />
      <Wheel x={30} /><Wheel x={54} /><Wheel x={78} /><Tractor />
    </>}
    {kind === 'rigid5' && <>
      <rect className="vi-body" x="96" y="34" width="140" height="56" rx="3" />
      <path className="vi-body" d="M240 96V54q0-6 6-6h22q7 0 10 6l12 18q2 3 2 6v18z" />
      <path className="vi-glass" d="M248 54h20l10 16h-30z" />
      <Chassis from={96} to={292} /><Wheel x={130} /><Wheel x={266} />
    </>}
    {kind === 'rigid7' && <>
      <rect className="vi-body" x="40" y="28" width="196" height="62" rx="3" />
      <path className="vi-body" d="M240 96V54q0-6 6-6h22q7 0 10 6l12 18q2 3 2 6v18z" />
      <path className="vi-glass" d="M248 54h20l10 16h-30z" />
      <Chassis from={40} to={292} /><Wheel x={92} /><Wheel x={118} /><Wheel x={266} />
    </>}
    {kind === 'van' && <>
      <path className="vi-body" d="M96 96V44q0-8 8-8h112q10 0 16 8l26 26q4 4 4 10v16z" />
      <path className="vi-glass" d="M214 44h4q6 0 10 5l18 19h-32z" />
      <path className="vi-line" d="M202 40v56M96 80h166" />
      <Wheel x={130} /><Wheel x={232} />
    </>}
  </svg>;
}
