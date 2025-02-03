import EstimationForm from "@/components/EstimationForm"
import Image from 'next/image'

export default function EstimationPage() {
  return (
    <>
      <Image src="/logo.png" width={200} height={200} alt="Logo" className="mx-auto" />
    <div className="container mx-auto p-4">
      {/* <h1 className="text-3xl font-bold mb-6">IAA Service Estimation</h1> */}
      <EstimationForm />
    </div>
    </>
  )
}

