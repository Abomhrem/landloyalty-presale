import { useState, useEffect, useCallback, useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import governanceService from '../services/governanceService';

interface Proposal {
  id: number;
  pda: string;
  proposer: string;
  title: string;
  description: string;
  action: string;
  status: string;
  votingStart: number;
  votingEnd: number;
  quorumRequired: number;
  approvalThreshold: number;
  createdAt: number;
  votesYes: number;
  votesNo: number;
  votesAbstain: number;
  totalVoters: number;
  executedAt: number;
  quorumReached: boolean;
  canExecute: boolean;
  isExecuted: boolean;
}

interface VotingPower {
  tokenBalance: number;
  stakedAmount: number;
  totalPower: number;
  hasDAOEligibility: boolean;
}

interface ProposalProgress {
  yesPercentage: number;
  noPercentage: number;
  abstainPercentage: number;
  quorumProgress: number;
}

export const useGovernance = (walletAddress?: string, connection?: Connection) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [votingPower, setVotingPower] = useState<VotingPower | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch governance data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const conn = connection || governanceService.connection;
        
        // Fetch proposals
        const data = await governanceService.getAllProposals(conn);
        setProposals(data.proposals || []);
        console.log('Proposals fetched:', data.proposals?.length || 0);

        // Fetch voting power if wallet connected
        if (walletAddress) {
          const power = await governanceService.getVotingPower(walletAddress, conn);
          setVotingPower(power);
          console.log('Voting power:', power.totalPower);
        }
      } catch (err: any) {
        console.error('Governance fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [walletAddress, connection]);

  // Active proposals
  const activeProposals = useMemo(() => {
    return proposals.filter(p => p.status === 'Active');
  }, [proposals]);

  // Can create proposal (need 100+ LLTY)
  const canCreateProposal = useMemo(() => {
    return (votingPower?.totalPower || 0) >= 100;
  }, [votingPower]);

  // Can vote
  const canVote = useMemo(() => {
    return (votingPower?.totalPower || 0) > 0;
  }, [votingPower]);

  // Get proposal by ID
  const getProposalById = useCallback((id: number) => {
    return proposals.find(p => p.id === id);
  }, [proposals]);

  // Check if user has voted
  const hasVoted = useCallback(async (proposalId: number) => {
    if (!walletAddress) return false;
    return governanceService.hasVoted(walletAddress, proposalId, connection);
  }, [walletAddress, connection]);

  // Calculate proposal progress
  const calculateProposalProgress = useCallback((proposal: Proposal): ProposalProgress => {
    const totalVotes = proposal.votesYes + proposal.votesNo + proposal.votesAbstain;
    
    if (totalVotes === 0) {
      return {
        yesPercentage: 0,
        noPercentage: 0,
        abstainPercentage: 0,
        quorumProgress: 0
      };
    }

    // Assuming 10B total supply, quorum is percentage of that
    const totalSupply = 10_000_000_000;
    const quorumRequired = (proposal.quorumRequired / 10000) * totalSupply;
    
    return {
      yesPercentage: (proposal.votesYes / totalVotes) * 100,
      noPercentage: (proposal.votesNo / totalVotes) * 100,
      abstainPercentage: (proposal.votesAbstain / totalVotes) * 100,
      quorumProgress: (totalVotes / quorumRequired) * 100
    };
  }, []);

  // Check if proposal has passed
  const hasProposalPassed = useCallback((proposal: Proposal) => {
    const progress = calculateProposalProgress(proposal);
    return progress.quorumProgress >= 100 && progress.yesPercentage > 50;
  }, [calculateProposalProgress]);

  return {
    proposals,
    votingPower,
    loading,
    error,
    activeProposals,
    canCreateProposal,
    canVote,
    getProposalById,
    hasVoted,
    calculateProposalProgress,
    hasProposalPassed,
    governanceService
  };
};
