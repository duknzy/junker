import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const androidDir = path.join(rootDir, 'android');
const apkOutputDir = path.join(rootDir, 'apk');

console.log('=== Flora Android APK Build Process ===');

// 1. Resolve JAVA_HOME
let javaHome = process.env.JAVA_HOME;
const possibleJavaHomes = [
  'C:\\Program Files\\Android\\Android Studio\\jbr',
  'C:\\Program Files\\Android\\Android Studio\\jre',
  'C:\\Program Files\\Java\\jdk-21',
  'C:\\Program Files\\Java\\jdk-17',
  'C:\\Program Files\\Eclipse Adoptium\\jdk-21',
  'C:\\Program Files\\Eclipse Adoptium\\jdk-17'
];

if (!javaHome || !fs.existsSync(javaHome)) {
  for (const candidate of possibleJavaHomes) {
    if (fs.existsSync(candidate)) {
      javaHome = candidate;
      break;
    }
  }
}

if (!javaHome) {
  console.error('Error: Could not locate a valid Java (JDK/JBR) installation.');
  process.exit(1);
}

console.log(`[Java] Using JAVA_HOME: ${javaHome}`);
const env = {
  ...process.env,
  JAVA_HOME: javaHome,
  PATH: `${path.join(javaHome, 'bin')}${path.delimiter}${process.env.PATH || ''}`
};

// 2. Sync web assets to www/
console.log('\n[Step 1/4] Syncing web assets to www/...');
execSync(`node "${path.join(__dirname, 'sync-www.mjs')}"`, { stdio: 'inherit', cwd: rootDir, env });

// 3. Capacitor Sync Android
console.log('\n[Step 2/4] Syncing Capacitor Android assets...');
execSync('npx cap sync android', { stdio: 'inherit', cwd: rootDir, env });

// 4. Run Gradle assembleDebug
console.log('\n[Step 3/4] Building Android APK with Gradle (assembleDebug)...');
const gradlewCmd = process.platform === 'win32' ? '.\\gradlew.bat' : './gradlew';
execSync(`${gradlewCmd} assembleDebug`, { stdio: 'inherit', cwd: androidDir, env });

// 5. Verify and copy APK
console.log('\n[Step 4/4] Locating and copying generated APK...');
const builtApkPath = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');

if (!fs.existsSync(builtApkPath)) {
  console.error(`Error: Built APK was not found at ${builtApkPath}`);
  process.exit(1);
}

if (!fs.existsSync(apkOutputDir)) {
  fs.mkdirSync(apkOutputDir, { recursive: true });
}

const finalApkPath = path.join(apkOutputDir, 'flora-debug.apk');
fs.copyFileSync(builtApkPath, finalApkPath);

const stats = fs.statSync(finalApkPath);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log('\n========================================');
console.log('🎉 APK Build Successful!');
console.log(`📦 APK File: ${finalApkPath}`);
console.log(`⚖️  Size:     ${sizeMB} MB (${stats.size.toLocaleString()} bytes)`);
console.log('========================================\n');
