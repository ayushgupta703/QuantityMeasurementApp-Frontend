
  export function convert(value, from, to, map) {
    const base = value * map[from];
    return base / map[to];
  }
  
  export function add(v1, u1, v2, u2, target, map) {
    const base1 = v1 * map[u1];
    const base2 = v2 * map[u2];
    return (base1 + base2) / map[target];
  }