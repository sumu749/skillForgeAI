const { createServer } = require("net");
const { spawn } = require("child_process");
const path = require("path");

function findOpenPort(startPort, maxAttempts = 20) {
    return new Promise((resolve, reject) => {
        let port = startPort;

        const tryPort = () => {
            if (port >= startPort + maxAttempts) {
                return reject(
                    new Error(
                        `No available ports found starting from ${startPort}`,
                    ),
                );
            }

            const server = createServer();
            server.once("error", (err) => {
                if (err.code === "EADDRINUSE") {
                    port += 1;
                    tryPort();
                } else {
                    reject(err);
                }
            });
            server.once("listening", () => {
                server.close(() => resolve(port));
            });
            server.listen(port);
        };

        tryPort();
    });
}

function spawnProcess(command, args, env) {
    const child = spawn(command, args, {
        env,
        stdio: "inherit",
        cwd: path.resolve(__dirname, ".."),
        shell: true,
    });

    child.on("exit", (code) => {
        if (code !== 0) {
            process.exit(code);
        }
    });

    child.on("error", (err) => {
        console.error(`Failed to start ${command}:`, err);
        process.exit(1);
    });

    return child;
}

(async () => {
    try {
        const apiPort = await findOpenPort(Number(process.env.PORT || 4000));
        const webPort = await findOpenPort(
            Number(process.env.WEB_PORT || 3000),
        );

        console.log(`Starting SkillForge API on port ${apiPort}`);
        console.log(`Starting SkillForge Web on port ${webPort}`);

        spawnProcess("npm", ["run", "dev", "-w", "@skillforge/api"], {
            ...process.env,
            PORT: String(apiPort),
        });

        spawnProcess("npm", ["run", "dev", "-w", "@skillforge/web"], {
            ...process.env,
            NEXT_PUBLIC_API_URL: `http://localhost:${apiPort}`,
            PORT: String(webPort),
        });
    } catch (err) {
        console.error("Unable to start dev environment:", err);
        process.exit(1);
    }
})();
