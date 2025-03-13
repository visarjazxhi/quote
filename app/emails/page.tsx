import { EmailTemplateList } from "@/components/emails/email-template-list"
import { SearchBar } from "@/components/emails/search-bar"

export default function EmailTemplatesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Email Templates</h1>
      <SearchBar />
      <EmailTemplateList />
    </div>
  )
}
