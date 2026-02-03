import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Users, TrendingUp, Calendar, CheckCircle, Clock, Building, AlertTriangle, Upload } from 'lucide-react';
import profitDistributionService, { DistributionCycle } from '../../services/profitDistributionService';

const ProfitDistribution: React.FC = () => {
  const [cycles, setCycles] = useState<DistributionCycle[]>([]);
  const [registryInfo, setRegistryInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMerkleModal, setShowMerkleModal] = useState(false);
  const [selectedCycleId, setSelectedCycleId] = useState<number | null>(null);

  // Create cycle form
  const [newCycle, setNewCycle] = useState({
    quarter: 1,
    year: 2024,
    description: '',
    totalProfitGross: '',
    distributionPercentage: 80,
    tokenType: 'USDC',
    propertyAddress: '',
    propertyValue: '',
    rentalYield: '',
    requiresDAOApproval: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [registry, allCycles] = await Promise.all([
        profitDistributionService.getRegistryInfo(),
        profitDistributionService.getAllCycles()
      ]);
      setRegistryInfo(registry);
      setCycles(allCycles);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'finalized': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleInitializeRegistry = async () => {
    // This would call the initialize_distribution_registry instruction
    alert('Initialize Registry - Connect wallet to sign transaction');
  };

  const handleCreateCycle = async () => {
    // This would call create_distribution_cycle instruction
    console.log('Creating cycle:', newCycle);
    alert('Create Cycle - Connect wallet to sign transaction');
    setShowCreateModal(false);
  };

  const handleSetMerkleRoot = async (cycleId: number) => {
    setSelectedCycleId(cycleId);
    setShowMerkleModal(true);
  };

  const handleFinalizeCycle = async (cycleId: number) => {
    if (confirm('Are you sure you want to finalize this distribution? Unclaimed funds will be returned to treasury.')) {
      alert('Finalize Cycle - Connect wallet to sign transaction');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Profit Distribution</h2>
          <p className="text-gray-400 mt-1">Manage quarterly profit distributions to token holders</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadData}
            className="px-4 py-2 rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition-all"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            New Distribution
          </button>
        </div>
      </div>

      {/* Registry Status */}
      <div className="bg-slate-800/50 rounded-2xl border border-green-500/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Building size={20} />
          Distribution Registry
        </h3>
        
        {registryInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
              <p className="text-sm text-gray-400">Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${registryInfo.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <p className="font-bold text-white">{registryInfo.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
              <p className="text-sm text-gray-400">Total Cycles</p>
              <p className="text-xl font-bold text-green-400">{registryInfo.totalCycles}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
              <p className="text-sm text-gray-400">Total Distributed</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(registryInfo.totalDistributed)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
              <p className="text-sm text-gray-400">Authority</p>
              <p className="text-xs font-mono text-gray-300 truncate">{registryInfo.authority}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto mb-4 text-yellow-400" size={48} />
            <p className="text-gray-400 mb-4">Distribution Registry not initialized</p>
            <button
              onClick={handleInitializeRegistry}
              className="px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all"
            >
              Initialize Registry
            </button>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-2xl border border-green-500/10 p-6">
          <DollarSign className="text-green-400 mb-2" size={24} />
          <p className="text-sm text-gray-400">Total Cycles</p>
          <p className="text-2xl font-bold text-white">{cycles.length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-2xl border border-green-500/10 p-6">
          <TrendingUp className="text-green-400 mb-2" size={24} />
          <p className="text-sm text-gray-400">Active Distributions</p>
          <p className="text-2xl font-bold text-white">{cycles.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-2xl border border-green-500/10 p-6">
          <Users className="text-green-400 mb-2" size={24} />
          <p className="text-sm text-gray-400">Total Claimants</p>
          <p className="text-2xl font-bold text-white">{cycles.reduce((sum, c) => sum + c.totalClaimants, 0).toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/50 rounded-2xl border border-green-500/10 p-6">
          <CheckCircle className="text-green-400 mb-2" size={24} />
          <p className="text-sm text-gray-400">Total Claimed</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(cycles.reduce((sum, c) => sum + c.totalClaimed, 0))}</p>
        </div>
      </div>

      {/* Distribution Cycles Table */}
      <div className="bg-slate-800/50 rounded-2xl border border-green-500/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Distribution Cycles</h3>
        
        {cycles.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto mb-4 text-gray-500" size={48} />
            <p className="text-gray-400">No distribution cycles yet</p>
            <p className="text-sm text-gray-500 mt-2">Create your first distribution to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                  <th className="pb-3 px-4">Cycle</th>
                  <th className="pb-3 px-4">Quarter</th>
                  <th className="pb-3 px-4">Total Amount</th>
                  <th className="pb-3 px-4">Claimed</th>
                  <th className="pb-3 px-4">Claimants</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cycles.map((cycle) => (
                  <tr key={cycle.id} className="border-b border-gray-800 hover:bg-slate-700/30">
                    <td className="py-4 px-4">
                      <span className="font-bold text-white">#{cycle.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white">Q{cycle.quarter} {cycle.year}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-green-400 font-bold">{formatCurrency(cycle.totalDistributableAmount)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <span className="text-white">{formatCurrency(cycle.totalClaimed)}</span>
                        <span className="text-gray-500 text-sm ml-2">
                          ({((cycle.totalClaimed / cycle.totalDistributableAmount) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white">{cycle.totalClaimants.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(cycle.status)}`}>
                        {cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {cycle.status === 'pending' && !cycle.merkleRoot && (
                          <button
                            onClick={() => handleSetMerkleRoot(cycle.id)}
                            className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm"
                          >
                            Set Merkle
                          </button>
                        )}
                        {cycle.status === 'active' && (
                          <button
                            onClick={() => handleFinalizeCycle(cycle.id)}
                            className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 text-sm"
                          >
                            Finalize
                          </button>
                        )}
                        <button
                          className="px-3 py-1 rounded-lg bg-slate-700 text-white hover:bg-slate-600 text-sm"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Distribution Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="max-w-2xl w-full rounded-2xl p-8 shadow-2xl" style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '2px solid rgba(34, 197, 94, 0.3)'
          }}>
            <h3 className="text-2xl font-bold text-green-400 mb-6">Create Distribution Cycle</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Quarter</label>
                <select
                  value={newCycle.quarter}
                  onChange={(e) => setNewCycle({ ...newCycle, quarter: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-gray-600"
                >
                  <option value={1}>Q1</option>
                  <option value={2}>Q2</option>
                  <option value={3}>Q3</option>
                  <option value={4}>Q4</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Year</label>
                <input
                  type="number"
                  value={newCycle.year}
                  onChange={(e) => setNewCycle({ ...newCycle, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-gray-600"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-300">Description</label>
              <input
                type="text"
                value={newCycle.description}
                onChange={(e) => setNewCycle({ ...newCycle, description: e.target.value })}
                placeholder="Q1 2024 Property Rental Income"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Gross Profit (USD)</label>
                <input
                  type="number"
                  value={newCycle.totalProfitGross}
                  onChange={(e) => setNewCycle({ ...newCycle, totalProfitGross: e.target.value })}
                  placeholder="100000"
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Distribution % (80%)</label>
                <input
                  type="number"
                  value={newCycle.distributionPercentage}
                  onChange={(e) => setNewCycle({ ...newCycle, distributionPercentage: parseInt(e.target.value) })}
                  min={1}
                  max={100}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-gray-600"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-300">Token Type</label>
              <select
                value={newCycle.tokenType}
                onChange={(e) => setNewCycle({ ...newCycle, tokenType: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-gray-600"
              >
                <option value="USDC">USDC</option>
                <option value="USDT">USDT</option>
                <option value="SOL">SOL</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-300">Property Address (Optional)</label>
              <input
                type="text"
                value={newCycle.propertyAddress}
                onChange={(e) => setNewCycle({ ...newCycle, propertyAddress: e.target.value })}
                placeholder="123 Main St, Dubai Marina"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-gray-600"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={newCycle.requiresDAOApproval}
                  onChange={(e) => setNewCycle({ ...newCycle, requiresDAOApproval: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                Requires DAO Approval
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-lg font-bold bg-slate-700 text-white hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCycle}
                className="flex-1 py-3 rounded-lg font-bold bg-green-500 text-white hover:bg-green-600"
              >
                Create Distribution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Merkle Root Modal */}
      {showMerkleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="max-w-lg w-full rounded-2xl p-8 shadow-2xl" style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '2px solid rgba(59, 130, 246, 0.3)'
          }}>
            <h3 className="text-2xl font-bold text-blue-400 mb-6">Set Merkle Root</h3>
            <p className="text-gray-400 mb-4">
              Upload the merkle root for Cycle #{selectedCycleId}. This enables users to claim their distributions.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-300">Merkle Root (64 hex chars)</label>
              <input
                type="text"
                placeholder="0x..."
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-gray-600 font-mono text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-300">Total Eligible LLTY</label>
              <input
                type="number"
                placeholder="10000000000"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-gray-600"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowMerkleModal(false)}
                className="flex-1 py-3 rounded-lg font-bold bg-slate-700 text-white hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-lg font-bold bg-blue-500 text-white hover:bg-blue-600"
              >
                Set Merkle Root
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitDistribution;
