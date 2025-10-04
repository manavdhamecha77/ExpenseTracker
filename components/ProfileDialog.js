'use client'

import { useSession, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Shield, LogOut } from 'lucide-react'

export default function ProfileDialog() {
  const { data: session, status } = useSession()

  if (!session) return null

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const userInitials = session.user?.name?.[0]?.toUpperCase() || 
                      session.user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={session.user?.image || ''} 
              alt={session.user?.name || 'User'} 
            />
            <AvatarFallback>
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Information</DialogTitle>
          <DialogDescription>
            View your account details and manage your profile.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={session.user?.image || ''} 
                alt={session.user?.name || 'User'} 
              />
              <AvatarFallback className="text-lg">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">
                {session.user?.name || 'Anonymous User'}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-1 h-3 w-3" />
                {session.user?.email}
              </div>
            </div>
          </div>

          {/* Account Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account Type</span>
                <Badge variant="outline">
                  {session.user?.image ? 'OAuth' : 'Local'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  Member Since
                </span>
                <span className="text-sm">Today</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </Button>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="pt-4 border-t">
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}