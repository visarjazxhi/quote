"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  ChevronLeft,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

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

interface QuoteListProps {
  onSelectQuote: (quote: Quote) => void;
  onNewQuote: () => void;
  onDeleteComplete?: (deletedQuoteId: string) => void;
  onToggleVisibility?: () => void;
  selectedQuoteId?: string;
}

export const QuoteList = React.forwardRef<
  { refreshQuotes: () => Promise<void> },
  QuoteListProps
>(
  (
    {
      onSelectQuote,
      onNewQuote,
      onDeleteComplete,
      onToggleVisibility,
      selectedQuoteId,
    },
    ref
  ) => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSelecting, setIsSelecting] = useState(false);

    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/quotes");
        if (!response.ok) {
          throw new Error("Failed to fetch quotes");
        }
        const data = await response.json();
        setQuotes(data);
        setFilteredQuotes(data);
        setError(null);
      } catch (err) {
        console.error("fetchQuotes error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    // Filter quotes based on search term
    useEffect(() => {
      if (!searchTerm.trim()) {
        setFilteredQuotes(quotes);
      } else {
        const filtered = quotes.filter((quote) => {
          const searchLower = searchTerm.toLowerCase();

          // Search in client group
          if (quote.clientGroup?.toLowerCase().includes(searchLower)) {
            return true;
          }

          // Search in contact person
          if (quote.contactPerson?.toLowerCase().includes(searchLower)) {
            return true;
          }

          // Search in entity names
          if (
            quote.entities.some((entity) =>
              entity.name.toLowerCase().includes(searchLower)
            )
          ) {
            return true;
          }

          return false;
        });
        setFilteredQuotes(filtered);
      }
    }, [quotes, searchTerm]);

    // Expose refresh function via ref
    React.useImperativeHandle(ref, () => ({
      refreshQuotes: fetchQuotes,
    }));

    useEffect(() => {
      fetchQuotes();
    }, []);

    const handleDeleteQuote = async (quoteId: string) => {
      try {
        const response = await fetch(`/api/quotes/${quoteId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete quote");
        }

        // Refresh the quotes list
        await fetchQuotes();

        // Notify parent component about deletion with the deleted quote ID
        if (onDeleteComplete) {
          onDeleteComplete(quoteId);
        }

        setError(null); // Clear any previous errors
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete quote";
        setError(errorMessage);
        console.error("Delete error:", err);
      }
    };

    const handleQuoteSelect = async (quote: Quote) => {
      // Prevent rapid clicks during selection
      if (isSelecting) return;

      try {
        setIsSelecting(true);
        await onSelectQuote(quote);
      } catch (error) {
        console.error("Error selecting quote:", error);
      } finally {
        // Add a small delay to prevent rapid clicking
        setTimeout(() => setIsSelecting(false), 500);
      }
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    if (loading) {
      return (
        <div className="w-64 border-r bg-gray-50 p-2">
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-64 border-r bg-gray-50 p-2">
          <div className="text-red-600 text-sm">{error}</div>
          <Button onClick={fetchQuotes} className="mt-2" size="sm">
            Try Again
          </Button>
        </div>
      );
    }

    return (
      <div className="w-64 border-r bg-gray-50 h-full flex flex-col">
        <div className="p-2 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quotes</h2>
            <div className="flex items-center gap-1">
              <Button onClick={fetchQuotes} variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
              {onToggleVisibility && (
                <Button
                  onClick={onToggleVisibility}
                  variant="ghost"
                  size="sm"
                  title="Hide quotes sidebar"
                  className="hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          <Button onClick={onNewQuote} className="w-full mb-3" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Quote
          </Button>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
              <Button
                onClick={() => setError(null)}
                variant="ghost"
                size="sm"
                className="ml-2 h-auto p-0 text-red-700 hover:text-red-900"
              >
                ×
              </Button>
            </div>
          )}

          {searchTerm && (
            <div className="text-xs text-gray-500 px-1">
              {filteredQuotes.length} of {quotes.length} quotes
            </div>
          )}

          {filteredQuotes.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              {searchTerm ? (
                <>
                  <p>No quotes found for &quot;{searchTerm}&quot;</p>
                  <p className="text-xs mt-2">Try a different search term.</p>
                </>
              ) : (
                <>
                  <p>No quotes found.</p>
                  <p className="text-sm mt-2">
                    Create your first quote to get started.
                  </p>
                </>
              )}
            </div>
          ) : (
            filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className={`bg-white rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                  selectedQuoteId === quote.id
                    ? "ring-2 ring-blue-500 border-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                } ${isSelecting ? "opacity-50 pointer-events-none" : ""}`}
                onClick={() => handleQuoteSelect(quote)}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                      {quote.clientGroup || "Unnamed Quote"}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDate(quote.updatedAt)}
                    </span>
                  </div>

                  {/* Contact Person */}
                  {quote.contactPerson && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                      <span className="font-medium">Contact:</span>{" "}
                      {quote.contactPerson}
                    </p>
                  )}

                  {/* Entity Names */}
                  {quote.entities.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">
                        {quote.entities.length}{" "}
                        {quote.entities.length === 1 ? "Entity" : "Entities"}:
                      </p>
                      <div className="space-y-1">
                        {quote.entities.slice(0, 2).map((entity) => (
                          <p
                            key={entity.id}
                            className="text-xs text-gray-700 line-clamp-1 pl-2"
                          >
                            • {entity.name}
                          </p>
                        ))}
                        {quote.entities.length > 2 && (
                          <p className="text-xs text-gray-500 pl-2">
                            +{quote.entities.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Services Count */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">
                        {quote.services.length}
                      </span>{" "}
                      services selected
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuoteSelect(quote);
                        }}
                        title="View/Edit"
                        disabled={isSelecting}
                      >
                        <Eye className="h-3 w-3 text-blue-600" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-red-50"
                            onClick={(e) => e.stopPropagation()}
                            title="Delete"
                            disabled={isSelecting}
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Quote</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this quote? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteQuote(quote.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
);

QuoteList.displayName = "QuoteList";
