// ============================================================================
// ADMIN TIMING PANEL - Update Presale Dates
// ============================================================================
// Enterprise admin component for managing presale timing
// Includes validation, preview, and confirmation
// ============================================================================

import React, { useState, useEffect } from 'react';
import { 
  PRESALE_TIMING, 
  PRESALE_PHASES,
  validatePresaleConfig,
  getPresaleDebugInfo,
  type PresalePhase 
} from '../../config/presale-timing-config';
import usePresaleTiming from '../../hooks/usePresaleTiming';

// ============================================================================
// INTERFACES
// ============================================================================

interface TimingUpdate {
  vipStartDate: string;
  vipDurationDays: number;
  phase1DurationDays: number;
  phase2DurationDays: number;
  phase3DurationDays: number;
}

interface PreviewPhases {
  vip: { start: Date; end: Date };
  phase1: { start: Date; end: Date };
  phase2: { start: Date; end: Date };
  phase3: { start: Date; end: Date };
  presaleEnd: Date;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminTimingPanel() {
  const timing = usePresaleTiming();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<TimingUpdate>({
    vipStartDate: new Date(PRESALE_TIMING.VIP_START).toISOString().split('T')[0],
    vipDurationDays: 2,
    phase1DurationDays: 14,
    phase2DurationDays: 14,
    phase3DurationDays: 14,
  });
  
  // Preview calculations
  const [preview, setPreview] = useState<PreviewPhases | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Calculate preview when form changes
  useEffect(() => {
    if (!isEditing) return;
    
    try {
      const vipStart = new Date(formData.vipStartDate + 'T00:00:00Z').getTime();
      const vipDuration = formData.vipDurationDays * 24 * 60 * 60 * 1000;
      const phase1Duration = formData.phase1DurationDays * 24 * 60 * 60 * 1000;
      const phase2Duration = formData.phase2DurationDays * 24 * 60 * 60 * 1000;
      const phase3Duration = formData.phase3DurationDays * 24 * 60 * 60 * 1000;
      
      const vipEnd = vipStart + vipDuration;
      const phase1Start = vipEnd;
      const phase1End = phase1Start + phase1Duration;
      const phase2Start = phase1End;
      const phase2End = phase2Start + phase2Duration;
      const phase3Start = phase2End;
      const phase3End = phase3Start + phase3Duration;
      
      setPreview({
        vip: { start: new Date(vipStart), end: new Date(vipEnd) },
        phase1: { start: new Date(phase1Start), end: new Date(phase1End) },
        phase2: { start: new Date(phase2Start), end: new Date(phase2End) },
        phase3: { start: new Date(phase3Start), end: new Date(phase3End) },
        presaleEnd: new Date(phase3End),
      });
      
      // Validate
      const errors: string[] = [];
      
      if (vipStart < Date.now()) {
        errors.push('VIP start date cannot be in the past');
      }
      
      if (formData.vipDurationDays < 1) {
        errors.push('VIP duration must be at least 1 day');
      }
      
      if (formData.phase1DurationDays < 1) {
        errors.push('Phase 1 duration must be at least 1 day');
      }
      
      if (formData.phase2DurationDays < 1) {
        errors.push('Phase 2 duration must be at least 1 day');
      }
      
      if (formData.phase3DurationDays < 1) {
        errors.push('Phase 3 duration must be at least 1 day');
      }
      
      setValidationErrors(errors);
    } catch (error) {
      setValidationErrors(['Invalid date format']);
      setPreview(null);
    }
  }, [formData, isEditing]);
  
  // Handle form input changes
  const handleInputChange = (field: keyof TimingUpdate, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Generate config file content
  const generateConfigFile = (): string => {
    if (!preview) return '';
    
    return `// ============================================================================
// PRESALE TIMING CONFIGURATION - UPDATED ${new Date().toISOString()}
// ============================================================================

export const PRESALE_TIMING = {
  VIP_START: new Date('${preview.vip.start.toISOString()}').getTime(),
  VIP_DURATION_MS: ${formData.vipDurationDays} * 24 * 60 * 60 * 1000,
  PHASE_1_DURATION_MS: ${formData.phase1DurationDays} * 24 * 60 * 60 * 1000,
  PHASE_2_DURATION_MS: ${formData.phase2DurationDays} * 24 * 60 * 60 * 1000,
  PHASE_3_DURATION_MS: ${formData.phase3DurationDays} * 24 * 60 * 60 * 1000,
} as const;

// VIP Phase: ${preview.vip.start.toISOString()} to ${preview.vip.end.toISOString()}
// Phase 1: ${preview.phase1.start.toISOString()} to ${preview.phase1.end.toISOString()}
// Phase 2: ${preview.phase2.start.toISOString()} to ${preview.phase2.end.toISOString()}
// Phase 3: ${preview.phase3.start.toISOString()} to ${preview.phase3.end.toISOString()}
// Presale Ends: ${preview.presaleEnd.toISOString()}
`;
  };
  
  // Handle save (would update config file)
  const handleSave = () => {
    if (validationErrors.length > 0) {
      alert('Please fix validation errors before saving');
      return;
    }
    
    setShowConfirm(true);
  };
  
  // Confirm and apply changes
  const handleConfirm = () => {
    const configContent = generateConfigFile();
    
    // Download the new config file
    const blob = new Blob([configContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presale-timing-config.ts';
    a.click();
    URL.revokeObjectURL(url);
    
    alert(
      'Configuration file downloaded!\n\n' +
      'NEXT STEPS:\n' +
      '1. Replace src/config/presale-timing-config.ts with the downloaded file\n' +
      '2. Restart your development server\n' +
      '3. Deploy to production\n' +
      '4. Update your smart contract if needed'
    );
    
    setShowConfirm(false);
    setIsEditing(false);
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">⏰ Presale Timing Management</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Edit Timing
          </button>
        )}
      </div>
      
      {/* Current Status */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">📊 Current Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Current Phase</p>
            <p className="text-white font-bold text-lg">{timing.phaseName}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Time Remaining</p>
            <p className="text-white font-bold text-lg">{timing.timeRemainingFormatted}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Current Price</p>
            <p className="text-white font-bold text-lg">${timing.currentPrice}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Phase Progress</p>
            <p className="text-white font-bold text-lg">{timing.phaseProgress.toFixed(1)}%</p>
          </div>
        </div>
      </div>
      
      {/* Edit Form */}
      {isEditing && (
        <div className="space-y-6">
          <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ⚠️ <strong>Warning:</strong> Changing presale timing requires updating your smart contract and redeploying the frontend.
            </p>
          </div>
          
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                VIP Phase Start Date
              </label>
              <input
                type="date"
                value={formData.vipStartDate}
                onChange={(e) => handleInputChange('vipStartDate', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  VIP Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.vipDurationDays}
                  onChange={(e) => handleInputChange('vipDurationDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">
                  Phase 1 Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.phase1DurationDays}
                  onChange={(e) => handleInputChange('phase1DurationDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">
                  Phase 2 Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.phase2DurationDays}
                  onChange={(e) => handleInputChange('phase2DurationDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">
                  Phase 3 Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.phase3DurationDays}
                  onChange={(e) => handleInputChange('phase3DurationDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
              <p className="text-red-400 font-semibold mb-2">❌ Validation Errors:</p>
              <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Preview */}
          {preview && validationErrors.length === 0 && (
            <div className="p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-3">✅ Preview Timeline:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>🎯 VIP Phase:</span>
                  <span>{preview.vip.start.toLocaleDateString()} → {preview.vip.end.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>1️⃣ Phase 1:</span>
                  <span>{preview.phase1.start.toLocaleDateString()} → {preview.phase1.end.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>2️⃣ Phase 2:</span>
                  <span>{preview.phase2.start.toLocaleDateString()} → {preview.phase2.end.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>3️⃣ Phase 3:</span>
                  <span>{preview.phase3.start.toLocaleDateString()} → {preview.phase3.end.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-2 border-t border-gray-700">
                  <span>🏁 Presale Ends:</span>
                  <span>{preview.presaleEnd.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs pt-1">
                  <span>Total Duration:</span>
                  <span>
                    {formData.vipDurationDays + formData.phase1DurationDays + 
                     formData.phase2DurationDays + formData.phase3DurationDays} days
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={validationErrors.length > 0}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Save & Download Config
            </button>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">⚠️ Confirm Changes</h3>
            <p className="text-gray-300 mb-6">
              This will download a new configuration file. You'll need to manually replace the old file and redeploy your application.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Confirm & Download
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Debug Info (Dev Only) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6">
          <summary className="text-gray-400 text-sm cursor-pointer hover:text-white">
            🔧 Debug Info
          </summary>
          <pre className="mt-2 p-3 bg-gray-800 rounded text-xs text-gray-300 overflow-auto">
            {JSON.stringify(getPresaleDebugInfo(), null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
