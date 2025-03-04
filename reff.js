require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { Wallet, ethers } = require("ethers");
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

const ACCOUNTS_FILE = path.join(__dirname, "accounts.txt");
const PROXY_FILE = path.join(__dirname, "proxy.txt");

const args = process.argv.slice(2);
const REFERRAL_CODE = args[0];
const ACCOUNT_COUNT = parseInt(args[1], 10) || 1;

if (!REFERRAL_CODE) {
  console.error("❌ Harap masukkan kode referral!");
  process.exit(1);
}

console.log(`🔗 Menggunakan Referral Code: ${REFERRAL_CODE}`);
console.log(`👥 Jumlah Akun yang Dibuat: ${ACCOUNT_COUNT}`);

function generateWallet() {
  const wallet = Wallet.createRandom();
  const address = wallet.address;
  const privateKey = wallet.privateKey;

  fs.appendFileSync(ACCOUNTS_FILE, `${address} | ${privateKey}\n`);
  console.log(`✅ Wallet Baru: ${address}`);
  return wallet;
}

function createSiweMessage(address) {
  const nonce = ethers.hexlify(ethers.randomBytes(32)).slice(2);
  const timestamp = new Date().toISOString();
  return `klokapp.ai wants you to sign in with your Ethereum account:\n${address}\n\n\n` +
         `URI: https://klokapp.ai/\n` +
         `Version: 1\n` +
         `Chain ID: 1\n` +
         `Nonce: ${nonce}\n` +
         `Issued At: ${timestamp}`;
}

async function signMessageAndRegister(wallet, agent) {
  const address = wallet.address;
  const message = createSiweMessage(address);
  console.log(`📝 Signing Message for ${address}`);
  const signedMessage = await wallet.signMessage(message);
  const payload = { signedMessage, message, referral_code: REFERRAL_CODE };

  try {
    const response = await axios.post("https://api1-pp.klokapp.ai/v1/verify", payload, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Origin": "https://klokapp.ai",
        "Referer": "https://klokapp.ai/",
      },
      httpAgent: agent // Use the agent for the request
    });
    console.log(`✅ Akun ${address} berhasil didaftarkan!`);
  } catch (error) {
    console.error(`❌ Gagal mendaftar ${address}:`, error.response ? error.response.data : error.message);
  }
}

function getProxyAgent() {
  const proxies = fs.readFileSync(PROXY_FILE, 'utf-8').split('\n').filter(Boolean);
  
  // Check if there are any proxies available
  if (proxies.length === 0) {
    console.error("❌ Tidak ada proxy yang ditemukan dalam proxy.txt!");
    process.exit(1);
  }

  const randomProxy = proxies[Math.floor(Math.random() * proxies.length)].trim();
  console.log(`📡 Menggunakan Proxy: ${randomProxy}`);

  // Determine if it's an HTTP/S or SOCKS proxy and create the appropriate agent
  if (randomProxy.startsWith('socks://')) {
    return new SocksProxyAgent(randomProxy);
  } else {
    return new HttpsProxyAgent(randomProxy);
  }
}

async function main() {
  const agent = getProxyAgent(); // Get a random proxy agent first

  for (let i = 0; i < ACCOUNT_COUNT; i++) {
    const wallet = generateWallet();
    await signMessageAndRegister(wallet, agent); // Use the agent for each request
  }
}

main();
