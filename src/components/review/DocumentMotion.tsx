"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

function DocumentSheet({ variant }: { variant: number }) {
  return <svg viewBox="0 0 320 410" aria-hidden="true">
    <path className="motion-paper" d="M35 14H232L302 84V376Q302 396 282 396H35Q16 396 16 376V34Q16 14 35 14Z"/>
    <path className="motion-fold" d="M232 14V65Q232 84 251 84H302Z"/>
    <rect className="motion-heading-block" x="54" y="92" width="32" height="32" rx="6"/>
    <path className="motion-heading-line" d="M111 108H242"/>
    <rect className="motion-mark motion-mark-red" x="50" y="179" width="169" height="24" rx="6"/>
    <rect className="motion-mark motion-mark-blue" x="50" y="253" width="133" height="24" rx="6"/>
    <g className="motion-text-lines">
      <path d="M54 154H264M54 191H252M54 228H269M54 265H240M54 302H264"/>
      <path d={variant === 1 ? "M54 339H191" : variant === 2 ? "M54 339H233" : "M54 339H211"}/>
    </g>
  </svg>;
}

export default function DocumentMotion({ english }: { english: boolean }) {
  const [paused, setPaused] = useState(false);
  return <figure className={`document-motion${paused ? " is-paused" : ""}`}>
    <div className="document-motion-art" role="img" aria-label={english ? "Illustration: a magnifying glass checks a stack of pages, highlights appear, then the back page moves to the front." : "Ilustrasi: kaca pembesar memeriksa tumpukan halaman, penanda muncul, lalu halaman belakang bergerak ke depan."}>
      <div className="motion-stack" aria-hidden="true">
        {[0, 1, 2].map(variant => <div className={`motion-page motion-page-${variant}`} key={variant}><DocumentSheet variant={variant}/></div>)}
      </div>
      <svg className="motion-loupe" viewBox="0 0 120 120" aria-hidden="true">
        <path className="loupe-handle" d="M76 76L107 107"/>
        <circle className="loupe-glass" cx="48" cy="48" r="34"/>
        <path className="loupe-shine" d="M30 29Q45 16 61 26"/>
      </svg>
    </div>
    <button className="motion-toggle" onClick={() => setPaused(value => !value)} aria-label={english ? (paused ? "Play document animation" : "Pause document animation") : (paused ? "Putar animasi dokumen" : "Jeda animasi dokumen")} title={english ? (paused ? "Play" : "Pause") : (paused ? "Putar" : "Jeda")}>
      {paused ? <Play aria-hidden="true"/> : <Pause aria-hidden="true"/>}
    </button>
  </figure>;
}
