import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowLeft, Upload, Loader2, CheckCircle, AlertCircle, FileText, Mail, Building, Microscope, Users, Sprout } from 'lucide-react';
import { WaterDropletBackground } from './WaterDropletBackground';
import { UserRole } from './RoleUpgrade';
import { useAuth } from './AuthContext';

interface RoleAuthenticationProps {
  role: UserRole;
  onVerified: () => void;
  onBack: () => void;
}

interface FormData {
  institutionalEmail?: string;
  scholarId?: string;
  institutionName?: string;
  position?: string;
  idProof?: File | null;
  description?: string;
  experience?: string;
  farmLocation?: string;
  farmSize?: string;
  cropTypes?: string;
  customRequirements?: string;
}

export const RoleAuthentication: React.FC<RoleAuthenticationProps> = ({ role, onVerified, onBack }) => {
  const { updateUserRole } = useAuth();
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roleConfig = {
    researcher: {
      title: 'Researcher Verification',
      description: 'Verify your academic or research credentials',
      icon: <Microscope className="w-12 h-12 text-blue-600" />,
      character: '👨‍🔬', // 3D-like character representation
      gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    policymaker: {
      title: 'Policymaker Verification', 
      description: 'Verify your governmental or policy-making credentials',
      icon: <Users className="w-12 h-12 text-purple-600" />,
      character: '👔', // 3D-like character representation
      gradient: 'from-purple-500/20 to-indigo-500/20'
    },
    farmer: {
      title: 'Farmer Verification',
      description: 'Verify your agricultural credentials and farm details',
      icon: <Sprout className="w-12 h-12 text-green-600" />,
      character: '👨‍🌾', // 3D-like character representation
      gradient: 'from-green-500/20 to-emerald-500/20'
    },
    others: {
      title: 'Custom Role Processing',
      description: 'Your request is being processed',
      icon: <Loader2 className="w-12 h-12 text-gray-600 animate-spin" />,
      character: '⚙️',
      gradient: 'from-gray-500/20 to-slate-500/20'
    }
  };

  const config = roleConfig[role];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('idProof', file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (role) {
      case 'researcher':
        if (!formData.institutionalEmail) newErrors.institutionalEmail = 'Institutional email is required';
        if (!formData.scholarId) newErrors.scholarId = 'Google Scholar ID is required';
        if (!formData.institutionName) newErrors.institutionName = 'Institution name is required';
        if (!formData.position) newErrors.position = 'Position is required';
        break;
      case 'policymaker':
        if (!formData.institutionalEmail) newErrors.institutionalEmail = 'Government email is required';
        if (!formData.institutionName) newErrors.institutionName = 'Department/Agency is required';
        if (!formData.position) newErrors.position = 'Position is required';
        if (!formData.idProof) newErrors.idProof = 'ID proof is required';
        break;
      case 'farmer':
        if (!formData.farmLocation) newErrors.farmLocation = 'Farm location is required';
        if (!formData.farmSize) newErrors.farmSize = 'Farm size is required';
        if (!formData.cropTypes) newErrors.cropTypes = 'Crop types are required';
        if (!formData.experience) newErrors.experience = 'Experience is required';
        break;
      case 'others':
        // No validation for others, will show processing message
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role === 'others') {
      // For "Others" role, just show processing
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call and update user role
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the user's role in the auth context
      const roleUpdateSuccess = await updateUserRole(role);
      
      if (roleUpdateSuccess) {
        onVerified();
      } else {
        console.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Special handling for "Others" role
  if (role === 'others') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-500/5 via-background to-slate-500/5 relative overflow-hidden">
        <WaterDropletBackground intensity="light" />
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-gray-500/20 to-slate-500/20 flex items-center justify-center">
                <div className="text-4xl">⚙️</div>
              </div>
              <CardTitle className="text-xl">Custom Role Processing</CardTitle>
              <CardDescription>
                We're working on adding your specialized role
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="animate-pulse">
                <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin mb-4" />
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="font-medium mb-2">We will let you know when your role is added</p>
                <p>For now, you can continue using the application with your current profile and access all standard features.</p>
              </div>
              <div className="pt-4 space-y-3">
                <Button 
                  onClick={async () => {
                    // For "others" role, we still want to update the user type even though it's not a predefined role
                    await updateUserRole('others');
                    onVerified();
                  }} 
                  className="w-full"
                >
                  Continue with Current Profile
                </Button>
                <Button variant="outline" onClick={onBack} className="w-full">
                  Back to Role Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.gradient} relative overflow-hidden`}>
      <WaterDropletBackground intensity="light" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">{config.title}</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {config.description}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 pb-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center pb-6">
                {/* 3D Character Representation */}
                <div className={`mx-auto mb-4 w-24 h-24 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center border-2 border-muted`}>
                  <div className="text-5xl">{config.character}</div>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  {config.icon}
                  <Badge variant="secondary" className="ml-2">
                    {role.charAt(0).toUpperCase() + role.slice(1)} Role
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Researcher Form */}
                  {role === 'researcher' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="institutionalEmail">Institutional Email</Label>
                        <Input
                          id="institutionalEmail"
                          type="email"
                          placeholder="researcher@university.edu"
                          value={formData.institutionalEmail || ''}
                          onChange={(e) => handleInputChange('institutionalEmail', e.target.value)}
                          className={errors.institutionalEmail ? 'border-destructive' : ''}
                        />
                        {errors.institutionalEmail && (
                          <p className="text-destructive text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.institutionalEmail}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scholarId">Google Scholar ID</Label>
                        <Input
                          id="scholarId"
                          placeholder="Your Google Scholar ID"
                          value={formData.scholarId || ''}
                          onChange={(e) => handleInputChange('scholarId', e.target.value)}
                          className={errors.scholarId ? 'border-destructive' : ''}
                        />
                        {errors.scholarId && (
                          <p className="text-destructive text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.scholarId}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="institutionName">Institution</Label>
                          <Input
                            id="institutionName"
                            placeholder="University/Research Institute"
                            value={formData.institutionName || ''}
                            onChange={(e) => handleInputChange('institutionName', e.target.value)}
                            className={errors.institutionName ? 'border-destructive' : ''}
                          />
                          {errors.institutionName && (
                            <p className="text-destructive text-sm flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.institutionName}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="position">Position</Label>
                          <Input
                            id="position"
                            placeholder="Professor, PhD Student, etc."
                            value={formData.position || ''}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                            className={errors.position ? 'border-destructive' : ''}
                          />
                          {errors.position && (
                            <p className="text-destructive text-sm flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.position}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Policymaker Form */}
                  {role === 'policymaker' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="institutionalEmail">Government Email</Label>
                        <Input
                          id="institutionalEmail"
                          type="email"
                          placeholder="official@gov.in"
                          value={formData.institutionalEmail || ''}
                          onChange={(e) => handleInputChange('institutionalEmail', e.target.value)}
                          className={errors.institutionalEmail ? 'border-destructive' : ''}
                        />
                        {errors.institutionalEmail && (
                          <p className="text-destructive text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.institutionalEmail}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="institutionName">Department/Agency</Label>
                          <Input
                            id="institutionName"
                            placeholder="Ministry, Department, or Agency"
                            value={formData.institutionName || ''}
                            onChange={(e) => handleInputChange('institutionName', e.target.value)}
                            className={errors.institutionName ? 'border-destructive' : ''}
                          />
                          {errors.institutionName && (
                            <p className="text-destructive text-sm flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.institutionName}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="position">Position</Label>
                          <Input
                            id="position"
                            placeholder="Officer, Secretary, etc."
                            value={formData.position || ''}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                            className={errors.position ? 'border-destructive' : ''}
                          />
                          {errors.position && (
                            <p className="text-destructive text-sm flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.position}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="idProof">Government ID Proof</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            id="idProof"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <label htmlFor="idProof" className="cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload government ID proof
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PDF, JPG, or PNG up to 10MB
                            </p>
                          </label>
                          {formData.idProof && (
                            <div className="mt-2 flex items-center justify-center space-x-2">
                              <FileText className="w-4 h-4 text-primary" />
                              <span className="text-sm text-primary">{formData.idProof.name}</span>
                            </div>
                          )}
                        </div>
                        {errors.idProof && (
                          <p className="text-destructive text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.idProof}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Farmer Form */}
                  {role === 'farmer' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="farmLocation">Farm Location</Label>
                          <Input
                            id="farmLocation"
                            placeholder="Village, District, State"
                            value={formData.farmLocation || ''}
                            onChange={(e) => handleInputChange('farmLocation', e.target.value)}
                            className={errors.farmLocation ? 'border-destructive' : ''}
                          />
                          {errors.farmLocation && (
                            <p className="text-destructive text-sm flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.farmLocation}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="farmSize">Farm Size (acres)</Label>
                          <Input
                            id="farmSize"
                            type="number"
                            placeholder="Enter farm size in acres"
                            value={formData.farmSize || ''}
                            onChange={(e) => handleInputChange('farmSize', e.target.value)}
                            className={errors.farmSize ? 'border-destructive' : ''}
                          />
                          {errors.farmSize && (
                            <p className="text-destructive text-sm flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.farmSize}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cropTypes">Primary Crop Types</Label>
                        <Input
                          id="cropTypes"
                          placeholder="Rice, Wheat, Cotton, etc."
                          value={formData.cropTypes || ''}
                          onChange={(e) => handleInputChange('cropTypes', e.target.value)}
                          className={errors.cropTypes ? 'border-destructive' : ''}
                        />
                        {errors.cropTypes && (
                          <p className="text-destructive text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.cropTypes}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Farming Experience (years)</Label>
                        <Input
                          id="experience"
                          type="number"
                          placeholder="Years of farming experience"
                          value={formData.experience || ''}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          className={errors.experience ? 'border-destructive' : ''}
                        />
                        {errors.experience && (
                          <p className="text-destructive text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.experience}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete Verification
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleAuthentication;