"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { AlertTriangle, Scale, FileText } from "lucide-react"

export default function LegalDisclaimerDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Scale className="h-4 w-4" /> Legal Disclaimer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Legal Disclaimer
          </DialogTitle>
          <DialogDescription className="text-base">
            Important information about this Small Business Restructure Relief eligibility checklist
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-900">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-400">Not Legal or Tax Advice</h4>
              <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                This checklist tool is provided for informational purposes only and does not constitute legal, tax, or
                professional advice. The information provided is based on our understanding of Subdivision 328-G of the
                Income Tax Assessment Act 1997 as of the date of creation, but tax laws are complex and subject to
                change.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Limitations of This Tool</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  This tool provides a simplified assessment based on the key criteria in Subdivision 328-G. The actual
                  application of the law to your specific circumstances may involve additional considerations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  The assessment is based solely on the information you provide and cannot account for all nuances of
                  your specific situation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Tax law is subject to interpretation, and the Australian Taxation Office may have specific views on
                  how these provisions apply in particular circumstances.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Seek Professional Advice</h3>
            <p className="text-muted-foreground">
              Before proceeding with any business restructure or making decisions based on the information provided by
              this tool, we strongly recommend that you:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Consult with a qualified tax professional who can provide advice tailored to your specific
                  circumstances
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Consider obtaining a private ruling from the Australian Taxation Office for complex situations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Review the full text of Subdivision 328-G and related guidance materials, including Law Companion
                  Ruling 2016/3
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">No Liability</h3>
            <p className="text-muted-foreground">
              The creators of this tool accept no responsibility or liability for any errors, omissions, or consequences
              arising from the use of this information. Your use of this tool indicates your acceptance of these
              limitations and your understanding that you are solely responsible for verifying the accuracy and
              applicability of this information to your specific circumstances.
            </p>
          </div>

          <div className="pt-4 border-t">
            <DialogClose asChild>
              <Button className="w-full">I Understand</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

