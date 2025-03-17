"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { EmailTemplateCard } from "@/components/emails/email-template-card";
import { EmailTemplateModal } from "@/components/emails/email-template-modal";
import type { EmailTemplate } from "@/types/email-template";
import { emailTemplates } from "../../data/email_templates";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export function EmailTemplateList() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Filter templates based on search query (subject, body, and attachment names)
  const filteredTemplates = emailTemplates.filter(
    (template) =>
      template.subject.toLowerCase().includes(query.toLowerCase()) ||
      template.body.toLowerCase().includes(query.toLowerCase()) ||
      template.attachments.some((attachment) =>
        attachment.name.toLowerCase().includes(query.toLowerCase())
      )
  );

  // Group templates by category
  const groupTemplatesByCategory = (templates: EmailTemplate[]) => {
    return templates.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    }, {} as Record<string, EmailTemplate[]>);
  };

  const groupedTemplates = groupTemplatesByCategory(filteredTemplates);

  // Function to toggle category expansion (Show All/Show Less)
  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Function to toggle category collapse (Accordion)
  const toggleCategoryCollapse = (category: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div>
      {Object.entries(groupedTemplates).map(([category, templates]) => (
        <div key={category} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          {/* This heading grows to fill the space and centers its text */}
          <h2 className="flex-1 text-2xl font-bold text-blue-500 text-center">
            {category} Templates
          </h2>
      
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleCategoryCollapse(category)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            {collapsedCategories[category] ? "Expand" : "Collapse"}
            {collapsedCategories[category] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
          {!collapsedCategories[category] && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {templates
                  .slice(0, expandedCategories[category] ? templates.length : 3) // Show 3 cards by default
                  .map((template) => (
                    <EmailTemplateCard
                      key={template.id}
                      template={template}
                      onView={() => setSelectedTemplate(template)}
                    />
                  ))}
              </div>
              {templates.length > 3 && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="destructive"
                    onClick={() => toggleCategoryExpansion(category)}
                  >
                    {expandedCategories[category] ? "Show Less" : "Show All"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {selectedTemplate && (
        <EmailTemplateModal
          template={selectedTemplate}
          isOpen={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
}