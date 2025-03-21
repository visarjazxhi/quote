import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Signature, Pickaxe, Mail, LibraryBig, LucideHandCoins, BookOpenText } from "lucide-react";
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
                {/* <Badge variant="success">Functional</Badge> */}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Get instant quotes for your clients. Tick the services and
                  download or email the quote.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/emails" className="flex items-center space-x-2">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Email templates
                </CardTitle>
                  {/* <Badge variant="default">Done</Badge> */}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Email templates for different processes. Send them directly to
                  your clients with a click.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/knowledge_bank" className="flex items-center space-x-2">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-col items-center">
                <div className="rounded-full bg-rose-100 p-3 mb-4">
                  <LibraryBig className="h-6 w-6 text-rose-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Knowledge Bank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  A collection of knowledge articles and resources for our
                  practice and clients.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/finance" className="flex items-center space-x-2">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-col items-center">
                <div className="rounded-full bg-purple-100 p-3 mb-4">
                  <LucideHandCoins className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Finance Tracker
                </CardTitle>
                <Badge variant="default">Work in progress</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  A platform to manage the finance of the practice. Track
                  expenses, income, and savings.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/course" className="flex items-center space-x-2">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-col items-center">
                <div className="rounded-full bg-orange-100 p-3 mb-4">
                  <BookOpenText className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Income Tax Return Course
                </CardTitle>
                <Badge variant="default">Work in progress</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  A course to learn how to prepare and lodge individual income tax returns.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/decision" className="flex items-center space-x-2">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <Pickaxe className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Business Structure Decision
                </CardTitle>
                <Badge variant="success">Work in Progress</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  A decision tree to help clients decide on the best business
                  structure for their business.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
