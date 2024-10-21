import { exec } from 'child_process';
import http from 'http';
import https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';

export function setMacProxySettings() {
	exec('networksetup -getwebproxy Wi-Fi', (err, stdout) => {
		if (err) {
			return;
		}

		const lines = stdout.split('\n');
		const enabledLine = lines.find(line => /Enabled/i.test(line))
		const proxyEnabled = enabledLine && /Yes/i.test(enabledLine);

		if (proxyEnabled) {
			const hostLine = lines.find(line => /Server:/i.test(line));
			const portLine = lines.find(line => /Port:/i.test(line));
			const proxyHost = hostLine ? hostLine.split(': ')[1].trim() : "";
			const proxyPort = portLine ? portLine.split(': ')[1].trim() : "";

			const proxyUrl = `http://${proxyHost}:${proxyPort}`;

			const httpAgent = new HttpProxyAgent(proxyUrl);
			const httpsAgent = new HttpsProxyAgent(proxyUrl);

			const originalHttpRequest = http.request;
			const originalHttpsRequest = https.request;

			http.request = function (options, callback) {
				options.agent = httpAgent; // 设置代理
				return originalHttpRequest.call(http, options, callback);
			};

			https.request = function (options, callback) {
				options.agent = httpsAgent; // 设置代理
				return originalHttpsRequest.call(https, options, callback);
			};
		}
	});
}