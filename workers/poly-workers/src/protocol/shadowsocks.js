class ShadowsocksConverter {
    static parse(link) {
        const ssLink = link.replace('ss://', '');
        let config = {};

        if (ssLink.includes('@')) {
            // SIP002 格式
            const name = ssLink.split('#')[1];
            const [userInfo, serverInfo] = ssLink.split('@');
            const [hostname, ...portAndParams] = serverInfo.split(':');
            const [port, ...params] = portAndParams.join(':').split('#')[0].split('?');
            const decoded = atob(userInfo);
            const [cipher, password] = decoded.split(':');
            
            config = {
                name: name,
                cipher,
                password,
                server: hostname,
                port: parseInt(port)
            };

            // 处理参数
            if (params.length > 0) {
                const urlParams = new URLSearchParams(params.join('?'));
                config.plugin = urlParams.get('plugin');
                if (config.plugin) {
                    const pluginOpts = {};
                    config.plugin.split(';').forEach(opt => {
                        const [key, value] = opt.split('=');
                        pluginOpts[key] = value;
                    });
                    config['plugin-opts'] = pluginOpts;
                }
            }
        } else {
            // 旧格式
            const name = ssLink.split('#')[1];
            const decoded = atob(ssLink.split('#')[0]);
            const [cipher, rest] = decoded.split(':');
            const [password, server, port] = rest.split('@');
            
            config = {
                name: name,
                cipher,
                password,
                server,
                port: parseInt(port)
            };
        }

        return {
            type: 'ss',
            ...config,
            udp: true
        };
    }
}

export default ShadowsocksConverter;