/**
 * PM2 生产环境配置
 * 
 * 使用方法:
 *   pm2 start deployment/pm2/ecosystem.config.js
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'carbon-erp',
      cwd: './apps/erp',
      script: 'npm',
      args: 'start',
      instances: 2,                    // 2个实例（集群模式）
      exec_mode: 'cluster',            // 集群模式
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: './logs/erp-error.log',
      out_file: './logs/erp-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '1G',        // 内存超过 1GB 自动重启
      autorestart: true,               // 自动重启
      watch: false,                    // 生产环境不监听文件变化
      max_restarts: 10,                // 最多重启 10 次
      min_uptime: '10s',               // 最小运行时间
      listen_timeout: 10000,           // 监听超时
      kill_timeout: 5000,              // 关闭超时
      wait_ready: true,                // 等待应用就绪
      shutdown_with_message: true      // 优雅关闭
    },
    {
      name: 'carbon-mes',
      cwd: './apps/mes',
      script: 'npm',
      args: 'start',
      instances: 2,                    // 2个实例（集群模式）
      exec_mode: 'cluster',            // 集群模式
      env: {
        NODE_ENV: 'production',
        PORT: 4001
      },
      error_file: './logs/mes-error.log',
      out_file: './logs/mes-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '1G',        // 内存超过 1GB 自动重启
      autorestart: true,               // 自动重启
      watch: false,                    // 生产环境不监听文件变化
      max_restarts: 10,                // 最多重启 10 次
      min_uptime: '10s',               // 最小运行时间
      listen_timeout: 10000,           // 监听超时
      kill_timeout: 5000,              // 关闭超时
      wait_ready: true,                // 等待应用就绪
      shutdown_with_message: true      // 优雅关闭
    }
  ]
};
