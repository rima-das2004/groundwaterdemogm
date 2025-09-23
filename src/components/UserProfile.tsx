import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { 
  User, 
  Settings, 
  Bell, 
  HelpCircle, 
  FileText, 
  Download,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Users,
  LogOut,
  ChevronRight,
  Shield,
  Smartphone,
  Globe,
  BarChart3,
  BookOpen,
  Heart,
  CheckCircle,
  Lock,
  KeyRound,
  GraduationCap,
  Upload,
  ExternalLink
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { ChangePassword } from './ChangePassword';
import { toast } from 'sonner';

interface UserProfileProps {
  onLogout: () => void;
  onRoleUpgrade?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onLogout, onRoleUpgrade }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    waterAlerts: true,
    communityUpdates: true,
    weeklyReports: false,
    systemMaintenance: true
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showResearcherUpgrade, setShowResearcherUpgrade] = useState(false);
  const [researcherForm, setResearcherForm] = useState({
    scholarId: '',
    institution: '',
    researchArea: '',
    publications: '',
    experience: '',
    reason: '',
    proofDocument: null as File | null
  });
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    userType: user?.userType || '',
    state: user?.state || '',
    district: user?.district || '',
    location: user?.location || ''
  });

  // Debug the callback on component mount
  React.useEffect(() => {
    console.log('UserProfile mounted with onRoleUpgrade callback:', onRoleUpgrade);
  }, [onRoleUpgrade]);

  const userStats = {
    reportsSubmitted: 8,
    communityRank: 'Silver Contributor',
    waterSaved: 1250, // liters
    daysActive: 45,
    forumPosts: 3
  };

  const achievements = [
    { name: 'First Report', description: 'Submitted your first water report', earned: true, icon: FileText },
    { name: 'Water Saver', description: 'Helped save 1000+ liters', earned: true, icon: TrendingUp },
    { name: 'Community Helper', description: 'Active in forum discussions', earned: true, icon: Users },
    { name: 'Consistent Monitor', description: 'Monitor water for 30 days', earned: false, icon: Calendar },
  ];

  const userTypes = [
    { value: 'household', label: 'Household User' },
    { value: 'farmer', label: 'Farmer' },
    { value: 'industry', label: 'Industry' },
    { value: 'researcher', label: 'Researcher' },
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  // Handle role upgrade with comprehensive error handling
  const handleRoleUpgrade = () => {
    console.log('=== ROLE UPGRADE DEBUG ===');
    console.log('onRoleUpgrade callback:', onRoleUpgrade);
    console.log('typeof onRoleUpgrade:', typeof onRoleUpgrade);
    console.log('onRoleUpgrade defined?', !!onRoleUpgrade);
    
    if (onRoleUpgrade && typeof onRoleUpgrade === 'function') {
      try {
        console.log('Calling onRoleUpgrade callback...');
        onRoleUpgrade();
        console.log('onRoleUpgrade callback called successfully');
        toast.success('Opening role upgrade flow...');
      } catch (error) {
        console.error('Error calling onRoleUpgrade:', error);
        toast.error('Failed to open role upgrade: ' + (error as Error).message);
      }
    } else {
      console.error('onRoleUpgrade callback is not a function:', onRoleUpgrade);
      toast.error('Role upgrade feature is not available - callback missing');
    }
    console.log('=== END ROLE UPGRADE DEBUG ===');
  };

  // Handle secure logout
  const handleLogout = async () => {
    try {
      await logout()
      onLogout()
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback to local logout if API fails
      onLogout()
    }
  }

  const menuItems = [
    {
      section: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', action: () => setShowEditProfile(true), hasChevron: true },
        { icon: Lock, label: 'Change Password', action: () => setShowChangePassword(true), hasChevron: true },
        { icon: MapPin, label: 'Location Settings', action: () => toast.info('Location settings coming soon!'), hasChevron: true },
        { icon: Bell, label: 'Notifications', action: () => toast.info('Notification settings coming soon!'), hasChevron: true },
      ]
    },
    {
      section: 'App Features',
      items: [
        { icon: BarChart3, label: 'Water Level Check', action: () => toast.info('Water level monitoring coming soon!'), hasChevron: true },
        { icon: BookOpen, label: 'Recommendations', action: () => toast.info('Smart recommendations coming soon!'), hasChevron: true },
        { icon: FileText, label: 'Impact Reports', action: () => toast.info('Impact reporting coming soon!'), hasChevron: true },
        { icon: HelpCircle, label: 'FAQs & Help', action: () => toast.info('Help center coming soon!'), hasChevron: true },
      ]
    },
    {
      section: 'Professional Growth',
      items: user?.userType === 'researcher' ? [
        { icon: Download, label: 'Download Research Data', action: () => toast.info('Preparing research dataset...'), hasChevron: true },
        { icon: BarChart3, label: 'Analytics Dashboard', action: () => toast.info('Advanced analytics coming soon!'), hasChevron: true },
        { icon: Globe, label: 'Data Sharing Settings', action: () => toast.info('Data sharing settings coming soon!'), hasChevron: true },
      ] : [
        { 
          icon: GraduationCap, 
          label: 'Upgrade Your Role', 
          action: handleRoleUpgrade,
          hasChevron: true 
        },
        { icon: Globe, label: 'Data Sharing Settings', action: () => toast.info('Data sharing settings coming soon!'), hasChevron: true },
      ]
    },
    {
      section: 'Support',
      items: [
        { icon: Settings, label: 'App Settings', action: () => toast.info('App settings coming soon!'), hasChevron: true },
        { icon: Heart, label: 'Rate AquaWatch', action: () => toast.info('Rating feature coming soon!'), hasChevron: true },
        { icon: LogOut, label: 'Sign Out', action: handleLogout, hasChevron: false, isDestructive: true },
      ]
    }
  ];

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleEditProfile = async () => {
    // Simple validation
    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully!');
      setShowEditProfile(false);
      // In a real app, you would update the user context here
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResearcherFormChange = (field: string, value: string | File | null) => {
    setResearcherForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      setResearcherForm(prev => ({
        ...prev,
        proofDocument: file
      }));
    }
  };

  const handleResearcherApplicationSubmit = async () => {
    // Validate required fields
    if (!researcherForm.scholarId || !researcherForm.institution || !researcherForm.researchArea || !researcherForm.proofDocument) {
      toast.error('Please fill in all required fields and upload verification document');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Researcher application submitted successfully! We will review and contact you within 3-5 business days.');
      setShowResearcherUpgrade(false);
      setResearcherForm({
        scholarId: '',
        institution: '',
        researchArea: '',
        publications: '',
        experience: '',
        reason: '',
        proofDocument: null
      });
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="p-4 space-y-6 pb-20">


        {/* User Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-secondary text-white">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{user?.name || 'User'}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                    {user?.userType || 'User'}
                  </Badge>
                  <Badge variant="outline">
                    {userStats.communityRank}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span>{user?.district}, {user?.state}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Active for {userStats.daysActive} days</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-lg font-semibold">{userStats.reportsSubmitted}</p>
              <p className="text-xs text-muted-foreground">Reports Submitted</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto text-secondary mb-2" />
              <p className="text-lg font-semibold">{userStats.waterSaved}L</p>
              <p className="text-xs text-muted-foreground">Water Saved</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-warning" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      achievement.earned ? 'bg-success/10 border border-success/20' : 'bg-muted/20'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      achievement.earned ? 'bg-success/20' : 'bg-muted/50'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        achievement.earned ? 'text-success' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${
                        achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {achievement.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Water Level Alerts</span>
                </div>
                <Switch
                  checked={notifications.waterAlerts}
                  onCheckedChange={() => handleNotificationChange('waterAlerts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Community Updates</span>
                </div>
                <Switch
                  checked={notifications.communityUpdates}
                  onCheckedChange={() => handleNotificationChange('communityUpdates')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Weekly Reports</span>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={() => handleNotificationChange('weeklyReports')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        {menuItems.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle className="text-base">{section.section}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={itemIndex}
                      variant="ghost"
                      className={`w-full justify-start h-12 ${
                        item.isDestructive ? 'text-destructive hover:text-destructive' : ''
                      }`}
                      onClick={() => {
                        try {
                          console.log('Profile menu item clicked:', item.label, item);
                          if (item.action) {
                            item.action();
                          } else {
                            console.warn('No action defined for menu item:', item.label);
                            toast.error('Feature not available');
                          }
                        } catch (error) {
                          console.error('Error executing menu action:', error);
                          toast.error('An error occurred. Please try again.');
                        }
                      }}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.hasChevron && <ChevronRight className="w-4 h-4" />}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Account Security Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Account Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Aadhar Verified</p>
                    <p className="text-xs text-green-600">Your account is verified with government database</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <KeyRound className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Secure Authentication</p>
                    <p className="text-xs text-blue-600">JWT token-based secure login</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Password Protected</p>
                    <p className="text-xs text-orange-600">Encrypted with industry-standard security</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editFormData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-userType">User Type</Label>
              <Select value={editFormData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your user type" />
                </SelectTrigger>
                <SelectContent>
                  {userTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-state">State</Label>
              <Select value={editFormData.state} onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-district">District</Label>
              <Input
                id="edit-district"
                value={editFormData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                placeholder="Enter your district"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={editFormData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter your location"
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditProfile(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditProfile}
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="w-[95vw] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your password to keep your account secure
            </DialogDescription>
          </DialogHeader>
          
          <ChangePassword
            onSuccess={() => {
              setShowChangePassword(false)
              toast.success('Password changed successfully!')
            }}
            onCancel={() => setShowChangePassword(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Researcher Upgrade Dialog */}
      <Dialog open={showResearcherUpgrade} onOpenChange={setShowResearcherUpgrade}>
        <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              <span>Upgrade to Researcher Account</span>
            </DialogTitle>
            <DialogDescription>
              Get access to advanced datasets, analytics, and research tools by verifying your academic credentials
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scholar-id">Google Scholar ID *</Label>
              <Input
                id="scholar-id"
                value={researcherForm.scholarId}
                onChange={(e) => handleResearcherFormChange('scholarId', e.target.value)}
                placeholder="Enter your Google Scholar ID"
              />
              <p className="text-xs text-muted-foreground">Find your ID in your Google Scholar profile URL</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution/Organization *</Label>
              <Input
                id="institution"
                value={researcherForm.institution}
                onChange={(e) => handleResearcherFormChange('institution', e.target.value)}
                placeholder="University, Research Institute, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="research-area">Primary Research Area *</Label>
              <Input
                id="research-area"
                value={researcherForm.researchArea}
                onChange={(e) => handleResearcherFormChange('researchArea', e.target.value)}
                placeholder="e.g., Hydrogeology, Environmental Science, Water Resources"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publications">Number of Publications</Label>
              <Input
                id="publications"
                type="number"
                value={researcherForm.publications}
                onChange={(e) => handleResearcherFormChange('publications', e.target.value)}
                placeholder="Approximate number of peer-reviewed publications"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Research Experience (Years)</Label>
              <Input
                id="experience"
                type="number"
                value={researcherForm.experience}
                onChange={(e) => handleResearcherFormChange('experience', e.target.value)}
                placeholder="Years of research experience"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Research Purpose</Label>
              <Textarea
                id="reason"
                value={researcherForm.reason}
                onChange={(e) => handleResearcherFormChange('reason', e.target.value)}
                placeholder="Briefly describe how you plan to use AquaWatch data in your research"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proof-document">Verification Document *</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="proof-document"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('proof-document')?.click()}
                  className="flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Verification</span>
                </Button>
                {researcherForm.proofDocument && (
                  <p className="text-sm text-success">{researcherForm.proofDocument.name}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload institutional ID, degree certificate, or official letterhead document (Max 5MB)
              </p>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-1">Verification Process</p>
                <p className="text-sm">We manually review all researcher applications to ensure data integrity. This process typically takes 3-5 business days. You'll receive an email confirmation once approved.</p>
              </AlertDescription>
            </Alert>

            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowResearcherUpgrade(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleResearcherApplicationSubmit}
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
                disabled={!researcherForm.scholarId || !researcherForm.institution || !researcherForm.researchArea || !researcherForm.proofDocument}
              >
                Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};