import { Connection, PublicKey } from '@solana/web3.js';
const conn = new Connection('https://devnet.helius-rpc.com/?api-key=8fd20322-0155-4b78-874f-837235298a26');
const presalePda = new PublicKey('GzPZVVDfuwmV1uXEovCesN9Mp21HkAaAgMR7SSdc2idT');
const data = await conn.getAccountInfo(presalePda);
if (data) {
  const vipStart = data.data.readBigInt64LE(296);
  const vipEnd = data.data.readBigInt64LE(304);
  const vipBuyersCount = data.data.readBigUInt64LE(320);
  const vipMaxBuyers = data.data.readBigUInt64LE(328);
  console.log('VIP Start:', new Date(Number(vipStart) * 1000));
  console.log('VIP End:', new Date(Number(vipEnd) * 1000));
  console.log('VIP Buyers:', Number(vipBuyersCount), '/', Number(vipMaxBuyers));
  console.log('Current:', new Date());
} else console.log('Account not found');
