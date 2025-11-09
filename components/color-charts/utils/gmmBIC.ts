/**
 * Gaussian Mixture Model (GMM) with diagonal covariance + BIC for Auto-K
 * 
 * Automatically determines the optimal number of clusters (K) using
 * Bayesian Information Criterion (BIC) to balance model complexity and fit.
 * 
 * Based on the Borderline v4 implementation with enhancements:
 * - Diagonal covariance matrix (faster than full covariance)
 * - K-Means++ initialization for better starting points
 * - BIC-based model selection
 * - Performance optimization for large datasets
 */

import { kmeansPlusPlusInit } from './kmeansPlusPlus';

export interface GMMResult {
  k: number;                    // Optimal number of clusters
  means: number[][];            // Cluster means [k][3] (RGB)
  vars: number[][];             // Cluster variances [k][3] (diagonal covariance)
  weights: number[];             // Cluster weights (sum to 1)
  bic: number;                  // Bayesian Information Criterion (lower is better)
  ll: number;                    // Log-likelihood
}

/**
 * Gaussian Mixture Model with diagonal covariance matrix and BIC-based model selection
 * 
 * Tests different values of K (Kmin to Kmax) and selects the one with lowest BIC.
 * Uses Expectation-Maximization (EM) algorithm for parameter estimation.
 * 
 * @param points Array of RGB points [r, g, b] where each value is 0-255
 * @param Kmin Minimum number of clusters (default: 3)
 * @param Kmax Maximum number of clusters (default: 8)
 * @param iters Number of EM iterations per K (default: 30)
 * @param maxPoints Maximum number of points to process (for performance, default: 50000)
 * @returns GMM result with optimal K and parameters
 */
export function gmmDiagBIC(
  points: number[][],
  Kmin: number = 3,
  Kmax: number = 8,
  iters: number = 30,
  maxPoints: number = 50000
): GMMResult {
  if (points.length === 0) {
    throw new Error('Points array is empty');
  }
  
  // Decimation for performance: if too many points, sample them
  let X: number[][];
  if (points.length > maxPoints) {
    const step = Math.ceil(points.length / maxPoints);
    X = [];
    for (let i = 0; i < points.length; i += step) {
      X.push([...points[i]]);
    }
  } else {
    X = points.map(p => [...p]);
  }
  
  const n = X.length;
  const d = 3; // RGB = 3 dimensions
  
  if (n < Kmin) {
    // Not enough points, return single cluster
    const mean = [0, 0, 0];
    for (let i = 0; i < n; i++) {
      mean[0] += X[i][0];
      mean[1] += X[i][1];
      mean[2] += X[i][2];
    }
    mean[0] /= n;
    mean[1] /= n;
    mean[2] /= n;
    
    return {
      k: 1,
      means: [mean],
      vars: [[100, 100, 100]],
      weights: [1.0],
      bic: 0,
      ll: 0,
    };
  }
  
  // Clamp Kmin and Kmax
  Kmin = Math.max(1, Math.min(Kmin, n));
  Kmax = Math.max(Kmin, Math.min(Kmax, n));
  
  /**
   * Expectation-Maximization for a specific K
   */
  function em(k: number): GMMResult {
    // Initialize means using K-Means++
    const means = kmeansPlusPlusInit(X, k).map(c => c.slice());
    
    // Initialize weights (uniform)
    const weights = Array(k).fill(1 / k);
    
    // Initialize variances (large start values for stability)
    const vars = Array.from({ length: k }, () => Array(d).fill(4000));
    
    // Responsibility matrix: resp[i][j] = probability that point i belongs to cluster j
    const resp = Array.from({ length: n }, () => Array(k).fill(0));
    
    // EM iterations
    for (let it = 0; it < iters; it++) {
      // E-step: Compute responsibilities
      for (let i = 0; i < n; i++) {
        let sumr = 0;
        
        for (let j = 0; j < k; j++) {
          // Compute probability density for diagonal Gaussian
          let p = 1;
          for (let t = 0; t < d; t++) {
            const diff = X[i][t] - means[j][t];
            const v = vars[j][t];
            // Gaussian PDF: exp(-0.5 * (x-μ)²/σ²) / sqrt(2πσ²)
            p *= Math.exp(-0.5 * diff * diff / v) / Math.sqrt(2 * Math.PI * v);
          }
          resp[i][j] = weights[j] * p;
          sumr += resp[i][j];
        }
        
        // Normalize responsibilities
        if (sumr === 0) {
          // Fallback: uniform distribution
          for (let j = 0; j < k; j++) {
            resp[i][j] = 1 / k;
          }
        } else {
          for (let j = 0; j < k; j++) {
            resp[i][j] /= sumr;
          }
        }
      }
      
      // M-step: Update parameters
      for (let j = 0; j < k; j++) {
        // Compute effective number of points in cluster j
        let Nj = 0;
        const mu = [0, 0, 0];
        
        for (let i = 0; i < n; i++) {
          Nj += resp[i][j];
          mu[0] += resp[i][j] * X[i][0];
          mu[1] += resp[i][j] * X[i][1];
          mu[2] += resp[i][j] * X[i][2];
        }
        
        // Update mean
        if (Nj > 0) {
          mu[0] /= Nj;
          mu[1] /= Nj;
          mu[2] /= Nj;
          means[j] = mu.slice();
          
          // Update variance (diagonal)
          const v = [0, 0, 0];
          for (let i = 0; i < n; i++) {
            v[0] += resp[i][j] * (X[i][0] - mu[0]) ** 2;
            v[1] += resp[i][j] * (X[i][1] - mu[1]) ** 2;
            v[2] += resp[i][j] * (X[i][2] - mu[2]) ** 2;
          }
          v[0] /= Nj;
          v[1] /= Nj;
          v[2] /= Nj;
          
          // Floor variance to prevent numerical issues
          vars[j] = v.map(x => Math.max(50, x));
          
          // Update weight
          weights[j] = Nj / n;
        }
      }
    }
    
    // Compute log-likelihood
    let ll = 0;
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (let j = 0; j < k; j++) {
        let p = 1;
        for (let t = 0; t < d; t++) {
          const diff = X[i][t] - means[j][t];
          const v = vars[j][t];
          p *= Math.exp(-0.5 * diff * diff / v) / Math.sqrt(2 * Math.PI * v);
        }
        s += weights[j] * p;
      }
      ll += Math.log(Math.max(1e-12, s));
    }
    
    // Compute BIC: -2 * log-likelihood + params * log(n)
    // Parameters: k * (d means + d vars) + (k-1) weights
    const params = k * (d + d) + (k - 1);
    const bic = -2 * ll + params * Math.log(n);
    
    return {
      k,
      means,
      vars,
      weights,
      bic,
      ll,
    };
  }
  
  // Test all K values and select the one with lowest BIC
  let best: GMMResult | null = null;
  
  for (let k = Kmin; k <= Kmax; k++) {
    const run = em(k);
    if (!best || run.bic < best.bic) {
      best = run;
    }
  }
  
  if (!best) {
    throw new Error('Failed to find optimal K');
  }
  
  return best;
}

/**
 * Helper function to convert GMM result to cluster format compatible with kmeansRGB
 * 
 * @param gmmResult GMM result from gmmDiagBIC
 * @returns Array of RGB centroids suitable for K-Means initialization
 */
export function gmmResultToCentroids(gmmResult: GMMResult): number[][] {
  return gmmResult.means.map(mean => [
    Math.round(mean[0]),
    Math.round(mean[1]),
    Math.round(mean[2]),
  ]);
}

/**
 * Get optimal K value from GMM result
 * 
 * @param gmmResult GMM result from gmmDiagBIC
 * @returns Optimal number of clusters
 */
export function getOptimalK(gmmResult: GMMResult): number {
  return gmmResult.k;
}
