import { useReducedMotion, type Variants } from 'framer-motion';

export const LANDING_EASE = [0.22, 1, 0.36, 1] as const;

export const landingViewport = { once: true, margin: '-80px' as const };
export const landingViewportTight = { once: true, margin: '-50px' as const };

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: LANDING_EASE },
    },
};

export const fadeUpSubtle: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: LANDING_EASE },
    },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5, ease: LANDING_EASE },
    },
};

export const slideFromLeft: Variants = {
    hidden: { opacity: 0, x: -48 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: LANDING_EASE },
    },
};

export const slideFromRight: Variants = {
    hidden: { opacity: 0, x: 48 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: LANDING_EASE },
    },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: LANDING_EASE },
    },
};

export const staggerContainer = (stagger = 0.12, delayChildren = 0.06): Variants => ({
    hidden: {},
    visible: {
        transition: { staggerChildren: stagger, delayChildren },
    },
});

export const heroStagger: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.11, delayChildren: 0.12 },
    },
};

export const heroItem: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.75, ease: LANDING_EASE },
    },
};

export const cardLift = {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.28, ease: LANDING_EASE },
};

export function useLandingMotion() {
    const reduceMotion = useReducedMotion();

    const viewProps = reduceMotion
        ? { initial: 'visible' as const, animate: 'visible' as const }
        : {
              initial: 'hidden' as const,
              whileInView: 'visible' as const,
              viewport: landingViewport,
          };

    const loadProps = reduceMotion
        ? { initial: 'visible' as const, animate: 'visible' as const }
        : { initial: 'hidden' as const, animate: 'visible' as const };

    return { reduceMotion: !!reduceMotion, viewProps, loadProps };
}
