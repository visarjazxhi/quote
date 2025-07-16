"use client";

import React, { useCallback, useRef, useState } from "react";

import EstimationForm from "./EstimationForm";
import { QuoteList } from "./QuoteList";
import SummaryCard from "./SummaryCard";
import { loadQuoteFromDatabase } from "@/lib/quote-utils";
import { toast } from "sonner";
import { useEstimationStore } from "@/lib/store";

interface QuoteListRef {
  refreshQuotes: () => Promise<void>;
}

interface Quote {
  id: string;
  createdAt: string;
  updatedAt: string;
  clientGroup: string | null;
  address: string | null;
  contactPerson: string | null;
  status: "DRAFT" | "DOWNLOADED" | "SENT";
  discountDescription: string | null;
  discountAmount: number;
  feesCharged: number;
  entities: Array<{
    id: string;
    name: string;
    entityType: string;
    businessType: string;
    hasXeroFile: boolean;
    accountingSoftware: string | null;
  }>;
  services: Array<{
    id: string;
    serviceId: string;
    sectionId: string;
    serviceName: string;
    serviceType: string;
  }>;
}

export const QuoteManager: React.FC = () => {
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isQuoteListVisible, setIsQuoteListVisible] = useState(true);
  const [isSummaryVisible, setIsSummaryVisible] = useState(true);
  const quoteListRef = useRef<QuoteListRef>(null);

  // Mobile-specific handlers to ensure only one sidebar is open at a time
  const handleQuoteListToggle = () => {
    if (window.innerWidth < 1024) {
      // lg breakpoint
      if (!isQuoteListVisible && isSummaryVisible) {
        setIsSummaryVisible(false);
      }
    }
    setIsQuoteListVisible(!isQuoteListVisible);
  };

  const handleSummaryToggle = () => {
    if (window.innerWidth < 1024) {
      // lg breakpoint
      if (!isSummaryVisible && isQuoteListVisible) {
        setIsQuoteListVisible(false);
      }
    }
    setIsSummaryVisible(!isSummaryVisible);
  };

  // Reset store to initial state
  const resetStore = useCallback(() => {
    const store = useEstimationStore.getState();

    // Reset all sections
    store.sections.forEach((section) => {
      section.services.forEach((service) => {
        if (service.type === "withOptions") {
          service.selectedOption = undefined;
          service.quantity = undefined;
          service.useCustomRate = false;
          service.customRate = undefined;
        } else if (service.type === "fixedCost") {
          service.value = undefined;
        } else if (service.type === "manualInput") {
          service.customDescription = undefined;
          service.customAmount = undefined;
          service.customRate = undefined;
        } else if (service.type === "rnD") {
          service.rdExpenses = undefined;
        }
      });
    });

    // Reset client info
    store.updateClientGroup("");
    store.updateClientAddress("");
    store.updateContactPerson("");

    // Clear all entities
    const currentEntities = [...store.clientInfo.entities];
    currentEntities.forEach((entity) => {
      store.removeEntity(entity.id);
    });

    // Reset discount and fees
    store.updateDiscount("description", "");
    store.updateDiscount("amount", 0);
    store.updateFeesCharged(0);
  }, []);

  const handleSelectQuote = useCallback(
    async (quote: Quote) => {
      try {
        setIsLoading(true);
        resetStore();

        // Check if the quote still exists before trying to load it
        const checkResponse = await fetch(`/api/quotes/${quote.id}`, {
          method: "HEAD", // Just check if it exists without fetching data
        });

        if (!checkResponse.ok) {
          // Quote doesn't exist anymore (likely deleted)
          toast.error("This quote no longer exists. It may have been deleted.");

          // Refresh the quote list to remove stale quotes
          if (quoteListRef.current) {
            await quoteListRef.current.refreshQuotes();
          }
          return;
        }

        await loadQuoteFromDatabase(quote.id);
        setSelectedQuoteId(quote.id);

        // Close sidebars on mobile after selection
        if (window.innerWidth < 1024) {
          setIsQuoteListVisible(false);
          setIsSummaryVisible(false);
        }
      } catch (error) {
        console.error("Error loading quote:", error);

        // If it's a 404 error, the quote was likely deleted
        if (
          error instanceof Error &&
          error.message.includes("Failed to load quote")
        ) {
          toast.error("This quote no longer exists. It may have been deleted.");

          // Refresh the quote list to remove stale quotes
          if (quoteListRef.current) {
            await quoteListRef.current.refreshQuotes();
          }

          // Clear the selected quote if it was the one that failed to load
          if (selectedQuoteId === quote.id) {
            setSelectedQuoteId(undefined);
            resetStore();
          }
        } else {
          toast.error("Failed to load quote. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [resetStore, selectedQuoteId]
  );

  const handleNewQuote = useCallback(() => {
    resetStore();
    setSelectedQuoteId(undefined);

    // Close sidebars on mobile after creating new quote
    if (window.innerWidth < 1024) {
      setIsQuoteListVisible(false);
      setIsSummaryVisible(false);
    }
  }, [resetStore]);

  const handleQuoteSaved = useCallback(async (quoteId: string) => {
    setSelectedQuoteId(quoteId);

    // Refresh the quote list to show the new/updated quote
    if (quoteListRef.current) {
      await quoteListRef.current.refreshQuotes();
    }

    // Form is cleared in SummaryCard after successful save
    // Don't reset here to avoid interference
  }, []);

  const handleDeleteComplete = useCallback(
    async (deletedQuoteId: string) => {
      // Always clear selected quote if the deleted quote was the currently selected one
      if (selectedQuoteId === deletedQuoteId) {
        setSelectedQuoteId(undefined);
        resetStore();
      }

      // Refresh the quote list to ensure UI is in sync
      if (quoteListRef.current) {
        await quoteListRef.current.refreshQuotes();
      }
    },
    [selectedQuoteId, resetStore]
  );

  return (
    <div className="relative h-screen bg-gray-100">
      {/* Mobile Overlay Background */}
      {(isQuoteListVisible || isSummaryVisible) && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => {
            setIsQuoteListVisible(false);
            setIsSummaryVisible(false);
          }}
        />
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        {/* Quote List Sidebar - Desktop */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isQuoteListVisible ? "w-64" : "w-0"
          } overflow-hidden`}
        >
          <QuoteList
            ref={quoteListRef}
            onSelectQuote={handleSelectQuote}
            onNewQuote={handleNewQuote}
            onDeleteComplete={handleDeleteComplete}
            onToggleVisibility={handleQuoteListToggle}
            selectedQuoteId={selectedQuoteId}
          />
        </div>

        {/* Main Content - Desktop */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto transition-all duration-300 pl-2 pr-4 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="ml-2 text-gray-600">Loading quote...</span>
              </div>
            ) : (
              <div className="w-full">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 text-center">
                    {selectedQuoteId ? "Edit Quote" : "Create New Quote"}
                  </h1>
                </div>
                <EstimationForm />
              </div>
            )}
          </div>

          {/* Summary Card - Desktop */}
          <div
            className={`border-l bg-white transition-all duration-300 overflow-hidden ${
              isSummaryVisible ? "w-96" : "w-0"
            }`}
          >
            {isSummaryVisible && (
              <SummaryCard
                currentQuoteId={selectedQuoteId}
                onQuoteSaved={handleQuoteSaved}
                onToggleVisibility={handleSummaryToggle}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full">
        {/* Main Content - Mobile (always full width) */}
        <div className="h-full overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-gray-600">Loading quote...</span>
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedQuoteId ? "Edit Quote" : "Create New Quote"}
                </h1>
              </div>
              <EstimationForm />
            </div>
          )}
        </div>

        {/* Quote List Sidebar - Mobile (overlay) */}
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-40 transform transition-transform duration-300 ${
            isQuoteListVisible ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <QuoteList
            ref={quoteListRef}
            onSelectQuote={handleSelectQuote}
            onNewQuote={handleNewQuote}
            onDeleteComplete={handleDeleteComplete}
            onToggleVisibility={handleQuoteListToggle}
            selectedQuoteId={selectedQuoteId}
          />
        </div>

        {/* Summary Card - Mobile (overlay) */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-40 transform transition-transform duration-300 ${
            isSummaryVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {isSummaryVisible && (
            <SummaryCard
              currentQuoteId={selectedQuoteId}
              onQuoteSaved={handleQuoteSaved}
              onToggleVisibility={handleSummaryToggle}
            />
          )}
        </div>
      </div>

      {/* Floating Show Buttons - Desktop Only */}
      <div className="hidden lg:block">
        {/* Show Quotes Button */}
        {!isQuoteListVisible && (
          <div className="fixed top-20 left-4 z-50">
            <button
              onClick={handleQuoteListToggle}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 font-medium text-sm"
              title="Show quotes sidebar"
            >
              Show Quotes
            </button>
          </div>
        )}

        {/* Show Summary Button */}
        {!isSummaryVisible && (
          <div className="fixed top-20 right-4 z-50">
            <button
              onClick={handleSummaryToggle}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 font-medium text-sm"
              title="Show summary sidebar"
            >
              Show Summary
            </button>
          </div>
        )}
      </div>

      {/* Mobile Toggle Buttons */}
      <div className="lg:hidden">
        {/* Mobile Show Quotes Button */}
        {!isQuoteListVisible && (
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={handleQuoteListToggle}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg transition-all duration-300 font-medium text-xs"
              title="Show quotes sidebar"
            >
              Quotes
            </button>
          </div>
        )}

        {/* Mobile Show Summary Button */}
        {!isSummaryVisible && (
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={handleSummaryToggle}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg transition-all duration-300 font-medium text-xs"
              title="Show summary sidebar"
            >
              Summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
