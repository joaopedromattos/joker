import { Semigroup } from './Semigroup';
import { Setoid } from './Setoid';
export declare type Ordering = -1 | 0 | 1;
/**
 * @since 1.0.0
 */
export declare const sign: (n: number) => Ordering;
/**
 * @since 1.0.0
 */
export declare const setoidOrdering: Setoid<Ordering>;
/**
 * @since 1.0.0
 */
export declare const semigroupOrdering: Semigroup<Ordering>;
/**
 * @since 1.0.0
 */
export declare const invert: (O: Ordering) => Ordering;
