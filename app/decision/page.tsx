import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
export default function ThreeCardsPage() {
  const cards = [
    {
      title: "Bussiness Structure Decision Tree",
      content:
        "This is a decision tree that helps you decide the best business structure for your business.",
      icon: <Building2 className="h-6 w-6 text-indigo-600" />,
      link: "/decision/business",
    },
    {
      title: "Small business transfers - Subdivision 328-G",
      content:
        "This form will help you determine if you are eligible for the small business restructure relief.",
      icon: <ArrowRightLeft className="h-6 w-6 text-pink-600" />,
      link: "/decision/s328g",
    },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
          Explore Our Tools
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from a variety of tools that help you make informed decisions for your business.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 bg-white"
          >
            <CardHeader className="flex flex-col items-center space-y-2">
              <div className="bg-gray-100 rounded-full p-3">{card.icon}</div>
              <CardTitle className="text-xl font-semibold text-gray-900 text-center">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">{card.content}</p>
              <div className="mt-4 flex justify-center">
                <Link href={card.link}>
                  <Button variant="indigo">Use this tool</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}