export const ADMIN_CONFIG = {
  supabase: {
    url: 'https://iaxuocfucudlcoglwygb.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheHVvY2Z1Y3VkbGNvZ2x3eWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNDc0NDIsImV4cCI6MjA4MzYyMzQ0Mn0.yo_YJhFUcgnBrflq0IDKht_9cmYh0ocfMxq3PofRwUM'
  },
  blockchain: {
    programId: '2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo',
    authority: 'GS8uMnEqbBckN5K3YidKtmjMFfg1pDgBFTrWrQGY6rZj',
    lltyMint: '6UYrC72Xseu8bSrjZz5VUZ3aGo68MEqpNNyMgqqcfajf',
    usdcMint: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
    usdtMint: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
    // PDAs for NEW authority (GS8uMn...)
    presalePda: 'GzPZVVDfuwmV1uXEovCesN9Mp21HkAaAgMR7SSdc2idT',
    presaleAuthPda: '9HLHqaujvP8ra6X7zKtgtVGy7hCH5iWdCb5vWDZi3x3S',
    lltyVault: '6kZbTEeF4iqx7iSsqF38xG1HaBoAs2oynrhBYLCi5GG3',
    usdcVault: 'EoV8MTk7zoyAVJeWAVih8eKMkNjAEMDrZ6yPt9yZRq2w',
    usdtVault: 'JBjhVxYUrmHceP3wm1kG1wwo2xbn79XsJ5ZpiM1dgoYx',
    solVault: '7Yp67GLSHvRVxYCZdg5Jr9JRmvPYRzEUmqvdaonqVk46'
  },
  presale: {
    startDate: '2026-01-01T00:00:00Z',
    vipDuration: 48,
    endDate: '2026-02-11T23:59:59Z',
    phaseDuration: 14,
    prices: {
      vip: 0.001,
      phase1: 0.004,
      phase2: 0.005,
      phase3: 0.006
    }
  },
  wallets: {
    vaults: {
      llty: '6kZbTEeF4iqx7iSsqF38xG1HaBoAs2oynrhBYLCi5GG3',
      usdc: 'EoV8MTk7zoyAVJeWAVih8eKMkNjAEMDrZ6yPt9yZRq2w',
      usdt: 'JBjhVxYUrmHceP3wm1kG1wwo2xbn79XsJ5ZpiM1dgoYx',
      sol: '7Yp67GLSHvRVxYCZdg5Jr9JRmvPYRzEUmqvdaonqVk46'
    },
    presale: 'GzPZVVDfuwmV1uXEovCesN9Mp21HkAaAgMR7SSdc2idT',
    authority: 'GS8uMnEqbBckN5K3YidKtmjMFfg1pDgBFTrWrQGY6rZj'
  },
  // Tokenomics distribution wallets
  tokenomics: {
    presaleVault: '6kZbTEeF4iqx7iSsqF38xG1HaBoAs2oynrhBYLCi5GG3',
    teamWallet: 'BFFWSNkrDDsXKMkZQt4WfwQjoLQjV3xAV1Eg8DX7ErkG',
    liquidityPool: 'BFpQxvPX9oY7C3G6ypByc8JSG413YTfAMSWftWVHgP5S',
    marketing: 'Gj44rnSZEayVZsVickBmrLzFk98R2Gg1z3yDxisK7fo3'
  },
  rpc: {
    devnet: 'https://devnet.helius-rpc.com/?api-key=8fd20322-0155-4b78-874f-837235298a26',
    mainnet: 'https://api.mainnet-beta.solana.com'
  },
  // Admin authentication
  auth: {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  }
};
