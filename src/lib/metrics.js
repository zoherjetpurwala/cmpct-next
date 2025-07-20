// /lib/metrics.js
class MetricsCollector {
    constructor() {
      this.counters = new Map();
      this.timers = new Map();
      this.gauges = new Map();
    }
  
    increment(metric, value = 1, tags = {}) {
      const key = this.createKey(metric, tags);
      this.counters.set(key, (this.counters.get(key) || 0) + value);
      
      // In production, send to your metrics service (DataDog, New Relic, etc.)
      if (process.env.NODE_ENV === 'production') {
        this.sendToMetricsService('counter', metric, value, tags);
      }
    }
  
    record(metric, value, tags = {}) {
      const key = this.createKey(metric, tags);
      if (!this.timers.has(key)) {
        this.timers.set(key, []);
      }
      this.timers.get(key).push(value);
      
      if (process.env.NODE_ENV === 'production') {
        this.sendToMetricsService('timer', metric, value, tags);
      }
    }
  
    gauge(metric, value, tags = {}) {
      const key = this.createKey(metric, tags);
      this.gauges.set(key, value);
      
      if (process.env.NODE_ENV === 'production') {
        this.sendToMetricsService('gauge', metric, value, tags);
      }
    }
  
    createKey(metric, tags) {
      const tagString = Object.entries(tags)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${v}`)
        .join(',');
      return tagString ? `${metric}|${tagString}` : metric;
    }
  
    sendToMetricsService(type, metric, value, tags) {
      // Implement your metrics service integration here
      // Examples: DataDog StatsD, New Relic, CloudWatch, etc.
      console.log(`[METRICS] ${type}: ${metric} = ${value}`, tags);
    }
  
    getStats() {
      return {
        counters: Object.fromEntries(this.counters),
        timers: Object.fromEntries(
          Array.from(this.timers.entries()).map(([key, values]) => [
            key,
            {
              count: values.length,
              avg: values.reduce((a, b) => a + b, 0) / values.length,
              min: Math.min(...values),
              max: Math.max(...values)
            }
          ])
        ),
        gauges: Object.fromEntries(this.gauges)
      };
    }
  
    reset() {
      this.counters.clear();
      this.timers.clear();
      this.gauges.clear();
    }
  }
  
  export const metrics = new MetricsCollector();