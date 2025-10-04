import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Shield, Users, ArrowRight, Code, Palette, Database } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                Hackathon Ready
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Build Amazing Apps
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {' '}Faster Than Ever
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A production-ready Next.js starter with authentication, modern UI components, 
              and everything you need to launch your next project in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8 py-3">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with modern technologies and best practices to give you a head start
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Secure Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Complete authentication system with NextAuth.js supporting secure 
                  credentials authentication. Password hashing with bcryptjs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Palette className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Beautiful UI Components</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Pre-built with ShadCN UI components and Tailwind CSS for rapid 
                  development and professional design.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Database className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Database Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Prisma ORM with SQLite by default. Easy migration to PostgreSQL 
                  for production deployments.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Modern Tech Stack
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on top of industry-leading technologies
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Code className="h-12 w-12 text-primary mb-2" />
              <h3 className="font-semibold">Next.js 15</h3>
              <p className="text-sm text-muted-foreground">App Router</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-primary mb-2" />
              <h3 className="font-semibold">NextAuth.js</h3>
              <p className="text-sm text-muted-foreground">Authentication</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Database className="h-12 w-12 text-primary mb-2" />
              <h3 className="font-semibold">Prisma</h3>
              <p className="text-sm text-muted-foreground">Database ORM</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Palette className="h-12 w-12 text-primary mb-2" />
              <h3 className="font-semibold">Tailwind</h3>
              <p className="text-sm text-muted-foreground">Styling</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers who trust our platform to build and scale their applications.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8 py-3">
                  Start Building Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}