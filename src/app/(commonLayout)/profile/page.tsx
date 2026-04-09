import { getUserInfo } from "@/services/auth.service";
import { IUser, Role, UserStatus } from "@/types/user.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, Phone, User, Shield } from "lucide-react";
import { EditProfileButton } from "@/components/modules/profile/EditProfileButton";

export default async function ProfilePage() {
  const userData = await getUserInfo() as IUser | null;

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Profile Not Found</CardTitle>
            <CardDescription className="text-center">
              Unable to load profile information. Please try logging in again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "bg-green-500";
      case UserStatus.BLOCKED:
        return "bg-red-500";
      case UserStatus.SUSPENDED:
        return "bg-yellow-500";
      case UserStatus.DELETED:
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "bg-purple-500";
      case Role.USER:
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-linear-to-br min-h-screen  from-background via-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        {/* Main Profile Card */}
        <Card className="bg-card/80 border-border backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={userData.image || userData.admin?.profilePhoto || ""}
                    alt={userData.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {userData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-foreground">{userData.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={`${getRoleColor(userData.role)} text-foreground`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {userData.role}
                    </Badge>
                    <Badge className={`${getStatusColor(userData.status)} text-foreground`}>
                      {userData.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <EditProfileButton userData={userData} />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="text-foreground">{formatDate(userData.createdAt)}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email Verified</p>
                      <Badge variant={userData.emailVerified ? "default" : "secondary"}>
                        {userData.emailVerified ? "Verified" : "Not Verified"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="text-foreground">{formatDate(userData.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border my-6" />

            {/* Admin Information (only show if user is admin) */}
            {userData.role === Role.ADMIN && userData.admin && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {userData.admin.contactNumber && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Contact Number</p>
                          <p className="text-foreground">{userData.admin.contactNumber}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Admin Created</p>
                        <p className="text-foreground">{formatDate(userData.admin.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Admin Updated</p>
                        <p className="text-foreground">{formatDate(userData.admin.updatedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">User ID</p>
                        <p className="text-foreground text-sm font-mono">{userData.admin.userId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Status */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Status</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(userData.status)}`} />
                  <span className="text-foreground capitalize">{userData.status.toLowerCase()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getRoleColor(userData.role)}`} />
                  <span className="text-foreground">{userData.role} Account</span>
                </div>
                {!userData.isDeleted && (
                  <Badge variant="outline" className="border-green-500 text-green-600">
                    Active Account
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
