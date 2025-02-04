import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Signature, LucideLink, Pickaxe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Welcome at Integritas
        </h1>
        <p className="text-center text-lg">Choose from below functions</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/quote" className="flex items-center space-x-2">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-col items-center">
                <div className="rounded-full bg-blue-100 p-3 mb-4">
                  <Signature className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Quote estimation
                </CardTitle>
                <Badge variant="default">Work in progress</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Get instant quotes for your clients. Tick the services and
                  download or email the quote.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="#" className="flex items-center space-x-2">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <Calculator className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Calculators
                </CardTitle>
                  <Badge variant="destructive">Not started yet</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Important tools and calculators for our practices to assist
                  with different tasks.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="#" className="flex items-center space-x-2">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-col items-center">
                <div className="rounded-full bg-purple-100 p-3 mb-4">
                  <LucideLink className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Links and shortcuts
                </CardTitle>
                <Badge variant="destructive">Not started yet</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  A collection of links and shortcuts of the website and
                  services we use.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="#" className="flex items-center space-x-2">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <Pickaxe className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Coming soon
                </CardTitle>
                <Badge variant="destructive">Not started yet</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  A description for this functionality. A description for this
                  functionality.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="#" className="flex items-center space-x-2">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <Pickaxe className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Coming soon
                </CardTitle>
                <Badge variant="destructive">Not started yet</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  A description for this functionality. A description for this
                  functionality.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
