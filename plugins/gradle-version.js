/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { exec } from 'child_process';
import { withDangerousMod } from 'expo/config-plugins.js';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

export default function withGradleVersion(config) {
    return withDangerousMod(config, [
        'android',
        async config => {
            try {
                const configPath = path.join(
                    config.modRequest.platformProjectRoot,
                    'gradle/wrapper/gradle-wrapper.properties'
                );

                /**
                 * By default, React Native 0.86 uses Gradle version 9.3.1
                 * However, if we use JDK 24 or higher version, it will raise an error.
                 * If we upgrade the version of Gradle, it will come to another error.
                 * The React Native Guide itself recommends us to use JDK 17. But on Windows,
                 * the Gradle version must be downgraded (it's not stated in the guide).
                 */
                const jdkVersion = await getJdkMajorVersion();
                if (jdkVersion >= 24) {
                    logUnsupportedJdk();
                }
                else if (jdkVersion >= 17) {
                    if (os.platform() == 'win32') {
                        await changeVersion(configPath, '9.1.0');
                    }
                }
                else {
                    logUnsupportedJdk();
                }
            } catch (error) {
                console.warn('Error updating gradle version:', error);
            }

            return config;
        },
    ]);
}

async function getJdkMajorVersion() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return await new Promise((resolve, reject) => {
        exec(`java -cp "${__dirname}" JDKMajorVersion` , (error, stdout, stderr) => {
            if (error || stderr) {
                reject(error || stderr);
            }
            else {
                resolve(parseInt(stdout));
            }
        });
    });
}

function logUnsupportedJdk() {
    console.error("====================================");
    console.log(  "|     Unsupported JDK Vesrion!     |");
    console.log(  "|   Please use JDK Vesrion 17-23   |");
    console.error("====================================");
}

async function changeVersion(configPath, version) {
    let contents = await fs.readFile(configPath, 'utf8');
    contents = contents.replace('gradle-9.3.1-bin.zip', `gradle-${version}-bin.zip`);
    await fs.writeFile(configPath, contents);
}