// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import './loading-screen.scss';

const RAMP_MS      = 5200;
const FAKE_CEILING = 92;
const FINISH_MS    = 300;

interface LoadingScreenProps {
    ready?: boolean;
    onDone?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ ready = false, onDone }) => {
    const [progress, setProgress] = useState(0);

    const startRef   = useRef<number>(performance.now());
    const rafRef     = useRef<number>(0);
    const readyRef   = useRef(ready);
    const readyAtRef = useRef<number | null>(null);
    const doneRef    = useRef(false);
    const onDoneRef  = useRef(onDone);

    useEffect(() => { readyRef.current  = ready;  }, [ready]);
    useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

    useEffect(() => {
        startRef.current = performance.now();

        const tick = (now: number) => {
            if (readyRef.current) {
                if (readyAtRef.current === null) readyAtRef.current = now;
                const fe  = now - readyAtRef.current;
                const pct = FAKE_CEILING + Math.min(fe / FINISH_MS, 1) * (100 - FAKE_CEILING);
                setProgress(pct);
                if (pct < 100) {
                    rafRef.current = requestAnimationFrame(tick);
                } else if (!doneRef.current) {
                    doneRef.current = true;
                    onDoneRef.current?.();
                }
                return;
            }
            const elapsed = now - startRef.current;
            const pct = Math.min((elapsed / RAMP_MS) * FAKE_CEILING, FAKE_CEILING);
            setProgress(pct);
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const pct = Math.floor(progress);

    /* ── Phase 1 (brand splash) ── */
    return (
        <div className='ls1-page'>
            <div className='ls1-center'>
                <div className='ls1-logo-wrap'>
                    <div className='ls1-logo-ring' />
                    <img className='ls1-logo' src='/logo.png' alt='Digittrader' />
                    <div className='ls1-bars'>
                        <span /><span /><span /><span /><span /><span /><span />
                    </div>
                </div>
                <h1 className='ls1-title'>DIGITTRADER</h1>
                <p className='ls1-tagline'>TRADE SMART · TRADE FAST · TRADE DIGITS</p>
                <div className='ls1-bar-track'>
                    <div className='ls1-bar-fill' style={{ width: `${pct}%`, transition: 'width 40ms linear' }} />
                </div>
                <p className='ls1-status'>LOADING DIGITTRADER...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
