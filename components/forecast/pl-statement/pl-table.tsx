"use client";

import type {
  Category,
  CategoryType,
  FinancialRow,
  Subcategory,
} from "@/lib/forecast/types/financial";
import {
  ChevronDown,
  ChevronRight,
  Download,
  Expand,
  GripVertical,
  Mail,
  Minimize2,
  Plus,
  Save,
  Settings,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

const formatCurrency = (value: number) => {
  if (value === 0) {
    return "-";
  }
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Dialog components for adding new items
function AddCategoryDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType | "">("");
  const { addCategory } = useFinancialStore();

  const handleSubmit = () => {
    if (name.trim() && type) {
      // Determine the formula based on category type
      let formula = "";
      switch (type) {
        case "sales_revenue":
          formula = "revenue_subcategories";
          break;
        case "cogs":
          formula = "cogs_subcategories";
          break;
        case "operating_expenses":
          formula = "operating_expenses_subcategories";
          break;
        case "other_income":
          formula = "other_income_subcategories";
          break;
        case "financial_expenses":
          formula = "financial_expenses_subcategories";
          break;
        case "other_expenses":
          formula = "other_expenses_subcategories";
          break;
      }

      addCategory({
        name: name.trim(),
        type: type as CategoryType,
        isCalculated: true, // All categories are calculated
        isExpanded: true,
        order: 0, // Will be auto-calculated in store
        subcategories: [],
        formula,
      });
      setName("");
      setType("");
      setOpen(false);
    }
  };

  const handleTypeChange = (value: string) => {
    setType(value as CategoryType);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <div>
            <Label htmlFor="category-type">Category Type</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales_revenue">Sales Revenue</SelectItem>
                <SelectItem value="cogs">Cost of Goods Sold</SelectItem>
                <SelectItem value="operating_expenses">
                  Operating Expenses
                </SelectItem>
                <SelectItem value="other_income">Other Income</SelectItem>
                <SelectItem value="financial_expenses">
                  Financial Expenses
                </SelectItem>
                <SelectItem value="other_expenses">Other Expenses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim() || !type}>
              Add Category
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddSubcategoryDialog({
  categoryId,
  trigger,
}: {
  categoryId: string;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { addSubcategory } = useFinancialStore();

  const handleSubmit = () => {
    if (name.trim()) {
      addSubcategory(categoryId, {
        name: name.trim(),
        order: 0, // Will be auto-calculated in store
        rows: [],
      });
      setName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subcategory</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subcategory-name">Subcategory Name</Label>
            <Input
              id="subcategory-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subcategory name"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim()}>
              Add Subcategory
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddRowDialog({
  subcategoryId,
  trigger,
}: {
  subcategoryId: string;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType | "">("");
  const { addRow, data } = useFinancialStore();

  const handleSubmit = () => {
    if (name.trim() && type && subcategoryId) {
      // Find the parent category for this subcategory
      let parentCategoryId = "";
      for (const category of data.categories) {
        const subcategory = category.subcategories.find(
          (sub) => sub.id === subcategoryId
        );
        if (subcategory) {
          parentCategoryId = category.id;
          break;
        }
      }

      addRow({
        name: name.trim(),
        type: type as CategoryType,
        subcategoryId,
        categoryId: parentCategoryId,
        order: 0, // Will be auto-calculated in store
        values: data.forecastPeriods.map((period) => ({
          date: period.date,
          value: 0,
          month: period.month || 1,
          year: period.year,
          isProjected: true,
        })),
      });
      setName("");
      setType("");
      setOpen(false);
    }
  };

  const handleTypeChange = (value: string) => {
    setType(value as CategoryType);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="row-name">Account Name</Label>
            <Input
              id="row-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter account name"
            />
          </div>
          <div>
            <Label htmlFor="row-type">Account Type</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales_revenue">Sales Revenue</SelectItem>
                <SelectItem value="cogs">Cost of Goods Sold</SelectItem>
                <SelectItem value="operating_expenses">
                  Operating Expenses
                </SelectItem>
                <SelectItem value="other_income">Other Income</SelectItem>
                <SelectItem value="financial_expenses">
                  Financial Expenses
                </SelectItem>
                <SelectItem value="other_expenses">Other Expenses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim() || !type}>
              Add Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// This will be replaced with dynamic forecast periods from the store

interface EditableCellProps {
  value: number;
  onSave: (newValue: number) => void;
  isEditing: boolean;
  onEditStart: () => void;
  onEditCancel: () => void;
  onTabNext?: () => void;
  onArrowNavigate?: (direction: "up" | "down" | "left" | "right") => void;
  isCalculated?: boolean;
}

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  isEditing: boolean;
  onEditStart: () => void;
  onEditCancel: () => void;
  className?: string;
  placeholder?: string;
  isCalculated?: boolean;
}

function EditableCell({
  value,
  onSave,
  isCalculated,
}: Pick<EditableCellProps, "value" | "onSave" | "isCalculated">) {
  // Ensure value is never null/undefined - default to 0
  const safeValue = value ?? 0;

  // Initialize editValue based on the current value
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    // Only update local state if external value actually changed numerically
    const numeric = Number.isFinite(safeValue) ? safeValue : 0;
    setEditValue((prev) => {
      const prevNum = parseFloat(prev);
      return isNaN(prevNum) || prevNum !== numeric
        ? numeric === 0
          ? ""
          : String(numeric)
        : prev;
    });
  }, [safeValue]);

  const commit = () => {
    const numValue = parseFloat(editValue);
    onSave(Number.isFinite(numValue) ? numValue : 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      commit();
    } else if (e.key === "Escape") {
      setEditValue(safeValue === 0 ? "" : safeValue.toString());
    }
  };

  const handleBlur = () => {
    // Commit the current value on blur without resetting input
    commit();
  };

  if (isCalculated) {
    return (
      <div className="flex items-center justify-end p-1 rounded min-h-[36px]">
        <span className="text-right font-mono tabular-nums text-muted-foreground text-xs">
          {formatCurrency(safeValue)}
        </span>
      </div>
    );
  }

  return (
    <Input
      type="number"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className="w-full h-9 text-right text-xs font-mono tabular-nums bg-transparent border-transparent border-b border-b-border rounded-none px-1 shadow-none focus-visible:ring-0 focus-visible:border-b-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      step="0.01"
      placeholder="0"
      inputMode="decimal"
    />
  );
}

function EditableText({
  value,
  onSave,
  isEditing,
  onEditStart,
  onEditCancel,
  className = "",
  placeholder = "Enter text...",
  isCalculated = false,
}: EditableTextProps) {
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue) {
      onSave(trimmedValue);
    } else {
      setEditValue(value); // Reset to original value if empty
      onEditCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value);
      onEditCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  // Don't allow editing of calculated items
  if (isCalculated) {
    return (
      <span className={`${className} text-muted-foreground`}>{value}</span>
    );
  }

  if (isEditing) {
    return (
      <Input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`${className} h-8 text-sm border-2 border-primary bg-background focus:ring-2 focus:ring-primary/20 rounded-md shadow-sm`}
        autoFocus
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      className={`${className} group-hover:bg-primary/5 px-2 py-1 rounded cursor-pointer transition-colors hover:border hover:border-primary/20`}
      onClick={onEditStart}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEditStart();
        }
      }}
    >
      {value}
    </span>
  );
}

interface SortableRowProps {
  row: FinancialRow;
  viewType: "monthly" | "yearly";
  selectedYear: number;
  selectedYears: number[];
  isDesignMode: boolean;
  rowIndex?: number;
  onNavigateToRow?: (
    direction: "up" | "down",
    currentRowId: string,
    cellIndex: number
  ) => void;
  isEditing?: boolean;
  editingCellIndex?: number | null;
  onEditStart?: (cellIndex: number) => void;
  onEditCancel?: () => void;
}

function SortableRow({
  row,
  viewType,
  selectedYear,
  selectedYears,
  isDesignMode,
  rowIndex = 0,
}: SortableRowProps) {
  const { updateRowValue, deleteRow, updateRow } = useFinancialStore();
  const [editingRowName, setEditingRowName] = useState(false);

  // Use external editing state if provided, otherwise use internal state
  // With always-on inputs, we no longer need cell-level editing state for visuals

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete account "${row.name}"?`)) {
      deleteRow(row.id);
    }
  };

  const handleCellSave = (valueIndex: number, newValue: number) => {
    updateRowValue(row.id, valueIndex, newValue);
  };

  const handleRowNameSave = (newName: string) => {
    updateRow({ ...row, name: newName });
    setEditingRowName(false);
  };

  const handleRowNameEditStart = () => {
    setEditingRowName(true);
  };

  const handleRowNameEditCancel = () => {
    setEditingRowName(false);
  };

  // Get values for selected year (for monthly view)
  const yearValues = row.values.filter((v) => v.year === selectedYear);

  // Calculate yearly totals for all selected years
  const yearlyTotals = selectedYears.map((year) => {
    const yearValues = row.values.filter((v) => v.year === year);
    return yearValues.reduce((sum, value) => sum + (value?.value ?? 0), 0);
  });

  // Calculate total across all selected years
  const totalAcrossYears = yearlyTotals.reduce((sum, total) => sum + total, 0);

  const zebraBgClass = rowIndex % 2 === 0 ? "bg-background" : "bg-muted/5";

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`group border-b border-border/50 ${zebraBgClass} ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <td className="p-3 sticky left-0 bg-inherit border-r border-border/20 border-l-4 border-l-emerald-400/0">
        <span className="flex items-center gap-2">
          {isDesignMode && (
            <>
              <button
                {...attributes}
                {...listeners}
                className="touch-none cursor-grab active:cursor-grabbing p-1 hover:bg-muted/50 rounded"
                title="Drag to reorder"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                title="Delete account"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </span>
      </td>
      <td className="font-medium p-3 pl-4 text-sm sticky left-8 bg-inherit border-r border-border/20 min-w-[240px]">
        <div className="flex items-center gap-2">
          <EditableText
            value={row.name}
            onSave={handleRowNameSave}
            isEditing={editingRowName}
            onEditStart={handleRowNameEditStart}
            onEditCancel={handleRowNameEditCancel}
            className="font-medium text-sm text-foreground"
            placeholder="Enter account name"
          />
          {yearValues.some((v) => v?.isProjected) && (
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] uppercase tracking-wide">
              Forecast
            </span>
          )}
        </div>
      </td>

      {viewType === "monthly" ? (
        <>
          {yearValues.map((value, index) => (
            <td
              key={`${row.id}-${selectedYear}-${value?.month ?? index}`}
              className="text-right p-1 min-w-[90px]"
            >
              <EditableCell
                value={value?.value ?? 0}
                onSave={(newValue) => {
                  const directIndex = row.values.findIndex((v) => v === value);
                  const ymIndex = row.values.findIndex(
                    (v) => v.year === selectedYear && v.month === value?.month
                  );
                  const targetIndex =
                    directIndex !== -1 ? directIndex : ymIndex;
                  if (targetIndex !== -1) {
                    handleCellSave(targetIndex, newValue);
                  }
                }}
                isCalculated={false}
              />
            </td>
          ))}
          <td className="text-right font-semibold p-3 bg-muted/20 sticky right-0 border-l border-border/20 min-w-[120px] text-foreground">
            {formatCurrency(
              yearValues.reduce((sum, value) => sum + (value?.value ?? 0), 0)
            )}
          </td>
        </>
      ) : (
        <>
          {yearlyTotals.map((total, index) => (
            <td
              key={selectedYears[index]}
              className="text-right font-semibold p-3 min-w-[120px]"
            >
              {formatCurrency(total)}
            </td>
          ))}
          <td className="text-right font-semibold p-3 bg-muted/20 sticky right-0 border-l border-border/20 min-w-[120px]">
            {formatCurrency(totalAcrossYears)}
          </td>
        </>
      )}
    </tr>
  );
}

interface SortableSubcategoryProps {
  subcategory: Subcategory;
  viewType: "monthly" | "yearly";
  selectedYear: number;
  selectedYears: number[];
  isDesignMode: boolean;
}

function SortableSubcategory({
  subcategory,
  viewType,
  selectedYear,
  selectedYears,
  isDesignMode,
}: SortableSubcategoryProps) {
  const { deleteSubcategory, updateSubcategory } = useFinancialStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingCellIndex, setEditingCellIndex] = useState<number | null>(null);

  // Calculate yearly totals for all selected years
  const yearlyTotals = selectedYears.map((year) => {
    return subcategory.rows.reduce((sum, row) => {
      const yearValues = row.values.filter((v) => v.year === year);
      return sum + yearValues.reduce((rowSum, v) => rowSum + v.value, 0);
    }, 0);
  });

  // Calculate total across all selected years
  const totalAcrossYears = yearlyTotals.reduce((sum, total) => sum + total, 0);

  // Remove drag and drop sensors since we're not using nested DndContext
  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete subcategory "${subcategory.name}" and all its accounts?`
      )
    ) {
      deleteSubcategory(subcategory.id);
    }
  };

  const handleSubcategoryNameSave = (newName: string) => {
    updateSubcategory({ ...subcategory, name: newName });
    setEditingSubcategoryName(false);
  };

  const handleSubcategoryNameEditStart = () => {
    setEditingSubcategoryName(true);
  };

  const handleSubcategoryNameEditCancel = () => {
    setEditingSubcategoryName(false);
  };

  const handleNavigateToRow = (
    direction: "up" | "down",
    currentRowId: string,
    cellIndex: number
  ) => {
    const currentRowIndex = subcategory.rows.findIndex(
      (row) => row.id === currentRowId
    );
    if (currentRowIndex === -1) return;

    let targetRowIndex: number;

    if (direction === "up") {
      targetRowIndex = currentRowIndex - 1;
    } else {
      targetRowIndex = currentRowIndex + 1;
    }

    // Check if target row exists
    if (targetRowIndex >= 0 && targetRowIndex < subcategory.rows.length) {
      const targetRow = subcategory.rows[targetRowIndex];
      setEditingRowId(targetRow.id);
      setEditingCellIndex(cellIndex);
    }
  };

  // Calculate monthly totals for this subcategory
  const monthlyTotals = Array.from({ length: 12 }, (_, monthIndex) => {
    return subcategory.rows.reduce((sum, row) => {
      const monthValue = row.values.find(
        (v) => v.year === selectedYear && v.month === monthIndex + 1
      );
      return sum + (monthValue?.value ?? 0);
    }, 0);
  });

  return (
    <React.Fragment key={subcategory.id}>
      <tr className="font-medium bg-muted/10 border-b group">
        <td className="p-3 pl-6 sticky left-0 bg-muted/10 border-r border-border/20 border-l-4 border-l-accent">
          <span className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-muted/50 rounded"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {isDesignMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                title="Delete subcategory"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </span>
        </td>
        <td className="font-semibold p-3 pl-4 sticky left-8 bg-muted/10 border-r border-border/20 min-w-[200px]">
          <span className="flex items-center justify-between">
            <EditableText
              value={subcategory.name}
              onSave={handleSubcategoryNameSave}
              isEditing={editingSubcategoryName}
              onEditStart={handleSubcategoryNameEditStart}
              onEditCancel={handleSubcategoryNameEditCancel}
              className="font-semibold text-sm"
              placeholder="Enter subcategory name"
              isCalculated={true} // Make all subcategories non-editable
            />
            {isDesignMode && (
              <AddRowDialog
                subcategoryId={subcategory.id}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                    title="Add account"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                }
              />
            )}
          </span>
        </td>

        {viewType === "monthly" ? (
          <>
            {monthlyTotals.map((monthTotal, index) => (
              <td
                key={`sub-${subcategory.id}-y${selectedYear}-m${index + 1}`}
                className="text-right font-semibold p-2 min-w-[90px] text-sm"
              >
                {formatCurrency(monthTotal)}
              </td>
            ))}
            <td className="text-right font-semibold p-3 bg-muted/30 sticky right-0 border-l border-border/20 min-w-[120px]">
              {formatCurrency(yearlyTotals[0] ?? 0)}
            </td>
          </>
        ) : (
          <>
            {yearlyTotals.map((total, index) => (
              <td
                key={selectedYears[index]}
                className="text-right font-semibold p-3 min-w-[120px]"
              >
                {formatCurrency(total)}
              </td>
            ))}
            <td className="text-right font-semibold p-3 bg-muted/30 sticky right-0 border-l border-border/20 min-w-[120px]">
              {formatCurrency(totalAcrossYears)}
            </td>
          </>
        )}
      </tr>

      {isExpanded && subcategory.rows.length > 0 && (
        <>
          {subcategory.rows.map((row, idx) => (
            <SortableRow
              key={row.id}
              row={row}
              viewType={viewType}
              selectedYear={selectedYear}
              selectedYears={selectedYears}
              isDesignMode={isDesignMode}
              rowIndex={idx}
              onNavigateToRow={handleNavigateToRow}
              isEditing={editingRowId === row.id}
              editingCellIndex={editingCellIndex}
              onEditStart={(cellIndex: number) => {
                setEditingRowId(row.id);
                setEditingCellIndex(cellIndex);
              }}
              onEditCancel={() => {
                setEditingRowId(null);
                setEditingCellIndex(null);
              }}
            />
          ))}
        </>
      )}
    </React.Fragment>
  );
}

interface SortableCategoryProps {
  category: Category;
  viewType: "monthly" | "yearly";
  selectedYear: number;
  selectedYears: number[];
  isDesignMode: boolean;
}

function SortableCategory({
  category,
  viewType,
  selectedYear,
  selectedYears,
  isDesignMode,
}: SortableCategoryProps) {
  const {
    toggleCategory,
    deleteCategory,
    getCalculatedCategoryMonthlyValue,
    updateCategory,
    data,
  } = useFinancialStore();
  const [editingCategoryName, setEditingCategoryName] = useState(false);

  // Calculate yearly totals for all selected years
  const yearlyTotals = selectedYears.map((year) => {
    if (category.isCalculated) {
      // For calculated categories, sum up monthly values for the year
      return Array.from({ length: 12 }, (_, monthIndex) =>
        getCalculatedCategoryMonthlyValue(category.id, monthIndex, year)
      ).reduce((sum, value) => sum + value, 0);
    } else {
      // For non-calculated categories, sum up the values manually
      return category.subcategories.reduce((catSum, subcategory) => {
        return (
          catSum +
          subcategory.rows.reduce((subSum, row) => {
            const yearValues = row.values.filter((v) => v.year === year);
            return (
              subSum + yearValues.reduce((rowSum, v) => rowSum + v.value, 0)
            );
          }, 0)
        );
      }, 0);
    }
  });

  // Calculate total across all selected years
  const totalAcrossYears = yearlyTotals.reduce((sum, total) => sum + total, 0);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggle = () => {
    toggleCategory(category.id);
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete category "${category.name}" and all its subcategories?`
      )
    ) {
      deleteCategory(category.id);
    }
  };

  const handleCategoryNameSave = (newName: string) => {
    updateCategory({ ...category, name: newName });
    setEditingCategoryName(false);
  };

  const handleCategoryNameEditStart = () => {
    setEditingCategoryName(true);
  };

  const handleCategoryNameEditCancel = () => {
    setEditingCategoryName(false);
  };

  // Get dynamic category name based on tax rate for income tax expense
  const getDynamicCategoryName = () => {
    if (category.type === "income_tax_expense") {
      const taxRate = data.taxRate;
      return `9. Income Tax Expense (${taxRate}%)`;
    }
    // Make all main categories non-editable headers
    if (category.type === "sales_revenue") {
      return "1. Sales Revenue";
    }
    if (category.type === "cogs") {
      return "2. Cost of Goods Sold";
    }
    if (category.type === "operating_expenses") {
      return "4. Operating Expenses";
    }
    if (category.type === "other_income") {
      return "6. Other Income";
    }
    if (category.type === "financial_expenses") {
      return "7. Financial Expenses";
    }
    if (category.type === "other_expenses") {
      return "8. Other Expenses";
    }
    return category.name;
  };

  // Calculate monthly totals for this category
  const monthlyTotals = Array.from({ length: 12 }, (_, monthIndex) => {
    if (category.isCalculated) {
      // For calculated categories, use the store's calculation function with year context
      return getCalculatedCategoryMonthlyValue(
        category.id,
        monthIndex,
        selectedYear
      );
    } else {
      // For non-calculated categories, sum up the values manually
      return category.subcategories.reduce((monthSum, subcategory) => {
        return (
          monthSum +
          subcategory.rows.reduce((rowSum, row) => {
            const monthValue = row.values.find(
              (v) => v.year === selectedYear && v.month === monthIndex + 1
            );
            return rowSum + (monthValue?.value ?? 0);
          }, 0)
        );
      }, 0);
    }
  });

  return (
    <React.Fragment>
      <tr
        ref={setNodeRef}
        style={style}
        className={`group font-bold border-b-2 ${
          isDragging ? "opacity-50" : ""
        } bg-muted/30 border-muted`}
      >
        <td
          className={`font-medium p-3 sticky left-0 border-r border-border/20 bg-muted/30 border-l-4 border-l-primary`}
        >
          <span className="flex items-center gap-2">
            {category.subcategories.length > 0 && (
              <button
                onClick={handleToggle}
                className="p-1 hover:bg-muted/50 rounded"
                title={
                  category.isExpanded ? "Collapse category" : "Expand category"
                }
              >
                {category.isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            {isDesignMode && (
              <>
                <button
                  {...attributes}
                  {...listeners}
                  className="touch-none cursor-grab active:cursor-grabbing p-1 hover:bg-muted/50 rounded"
                  title="Drag to reorder category"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                  title="Delete category"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </span>
        </td>
        <td
          className={`font-bold text-base p-3 sticky left-8 border-r border-border/20 min-w-[200px] bg-muted/30`}
        >
          <span className="flex items-center justify-between">
            <EditableText
              value={getDynamicCategoryName()}
              onSave={handleCategoryNameSave}
              isEditing={editingCategoryName}
              onEditStart={handleCategoryNameEditStart}
              onEditCancel={handleCategoryNameEditCancel}
              className="font-bold text-base tracking-wide uppercase"
              placeholder="Enter category name"
              isCalculated={
                category.isCalculated ||
                category.type === "sales_revenue" ||
                category.type === "cogs" ||
                category.type === "operating_expenses" ||
                category.type === "other_income" ||
                category.type === "financial_expenses" ||
                category.type === "other_expenses"
              }
            />
            {isDesignMode && (
              <AddSubcategoryDialog
                categoryId={category.id}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                    title="Add subcategory"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                }
              />
            )}
          </span>
        </td>

        {viewType === "monthly" ? (
          <>
            {monthlyTotals.map((monthTotal, index) => (
              <td
                key={`cat-${category.id}-y${selectedYear}-m${index + 1}`}
                className="text-right font-bold p-2 min-w-[90px] text-sm"
              >
                {formatCurrency(monthTotal)}
              </td>
            ))}
            <td
              className={`text-right font-bold text-lg p-3 sticky right-0 border-l border-border/20 min-w-[120px] bg-muted/40`}
            >
              {formatCurrency(yearlyTotals[0] ?? 0)}
            </td>
          </>
        ) : (
          <>
            {yearlyTotals.map((total, index) => (
              <td
                key={selectedYears[index]}
                className="text-right font-bold text-lg p-3 min-w-[120px]"
              >
                {formatCurrency(total)}
              </td>
            ))}
            <td
              className={`text-right font-bold text-lg p-3 sticky right-0 border-l border-border/20 min-w-[120px] bg-muted/40`}
            >
              {formatCurrency(totalAcrossYears)}
            </td>
          </>
        )}
      </tr>

      {category.isExpanded && category.subcategories.length > 0 && (
        <>
          {category.subcategories.map((subcategory) => (
            <SortableSubcategory
              key={subcategory.id}
              subcategory={subcategory}
              viewType={viewType}
              selectedYear={selectedYear}
              selectedYears={selectedYears}
              isDesignMode={isDesignMode}
            />
          ))}
        </>
      )}
    </React.Fragment>
  );
}

export function PLTable() {
  // NOTE: A standardized, simplified P&L is available as <PLStandardTable /> in pl-standard-table.tsx.
  // You can switch to that component wherever this table is rendered if you prefer the fixed structure.

  const {
    data,
    reorderCategories,
    toggleCategory,
    forceLoadSampleData,
    resetToEmpty,
  } = useFinancialStore();

  const [viewType, setViewType] = useState<"monthly" | "yearly">("monthly");
  const [isDesignMode, setIsDesignMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedYears, setSelectedYears] = useState<number[]>([2024]);

  const availableYears = Array.from(
    new Set(data.forecastPeriods.map((period) => period.year))
  ).sort();

  // Expand/Collapse All functionality
  const handleExpandAll = () => {
    data.categories.forEach((category) => {
      if (!category.isExpanded) {
        toggleCategory(category.id);
      }
    });
  };

  const handleCollapseAll = () => {
    data.categories.forEach((category) => {
      if (category.isExpanded) {
        toggleCategory(category.id);
      }
    });
  };

  // Handle year selection for yearly view
  const handleYearToggle = (year: number) => {
    setSelectedYears((prev) => {
      if (prev.includes(year)) {
        return prev.filter((y) => y !== year);
      } else {
        return [...prev, year].sort();
      }
    });
  };

  // Initialize selectedYears when view type changes
  useEffect(() => {
    if (viewType === "yearly" && selectedYears.length === 0) {
      setSelectedYears([selectedYear]);
    }
  }, [viewType, selectedYear, selectedYears.length]);

  // Update selectedYears when selectedYear changes in yearly view
  useEffect(() => {
    if (viewType === "yearly" && !selectedYears.includes(selectedYear)) {
      setSelectedYears((prev) => [...prev, selectedYear].sort());
    }
  }, [selectedYear, viewType, selectedYears]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // React hooks must be called before early returns
  // Ensure data has the required structure - safety fallback
  if (!data || !data.categories) {
    return <div>Loading financial data...</div>;
  }

  // Get periods for selected year with safety check
  const selectedYearPeriods = data.forecastPeriods
    ? data.forecastPeriods.filter((p) => p.year === selectedYear)
    : [];

  const handleSaveData = () => {
    // TODO: Implement save functionality
    console.log("Saving data...");
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    console.log("Downloading PDF...");
  };

  const handleEmailReport = () => {
    // TODO: Implement email functionality
    console.log("Emailing report...");
  };

  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to clear all data to zero? This cannot be undone."
      )
    ) {
      resetToEmpty();
    }
  };

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.categories.findIndex(
        (category) => category.id === active.id
      );
      const newIndex = data.categories.findIndex(
        (category) => category.id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderCategories(oldIndex, newIndex);
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Controls Container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/20 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            {viewType === "monthly" ? (
              <>
                <label
                  htmlFor="year-select"
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Year:
                </label>
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-2 border rounded-md bg-background text-sm min-w-[80px]"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label className="text-sm font-medium whitespace-nowrap">
                  Years:
                </label>
                <div className="flex flex-wrap gap-1">
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearToggle(year)}
                      className={`px-2 py-1 text-xs rounded border transition-colors ${
                        selectedYears.includes(year)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-muted"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewType === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("monthly")}
              className="text-xs sm:text-sm"
            >
              Monthly
            </Button>
            <Button
              variant={viewType === "yearly" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("yearly")}
              className="text-xs sm:text-sm"
            >
              Yearly
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isDesignMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsDesignMode(!isDesignMode)}
              className="text-xs sm:text-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isDesignMode ? "Design Mode ON" : "Design Mode OFF"}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExpandAll}
              className="text-xs sm:text-sm"
              title="Expand all categories"
            >
              <Expand className="h-4 w-4 mr-2" />
              Expand All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCollapseAll}
              className="text-xs sm:text-sm"
              title="Collapse all categories"
            >
              <Minimize2 className="h-4 w-4 mr-2" />
              Collapse All
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Category Button */}
          {isDesignMode && (
            <AddCategoryDialog
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              }
            />
          )}

          {/* Save as Button */}
          <Button
            onClick={handleSaveData}
            variant="default"
            size="sm"
            className="text-xs sm:text-sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          {/* Export actions as icons */}
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            size="sm"
            className="p-2"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            onClick={handleEmailReport}
            variant="outline"
            size="sm"
            className="p-2"
            title="Email Report"
          >
            <Mail className="h-4 w-4" />
          </Button>

          <Button
            onClick={handleClearData}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Data
          </Button>

          <Button
            onClick={() => forceLoadSampleData()}
            variant="default"
            size="sm"
            className="text-xs sm:text-sm bg-green-600 hover:bg-green-700"
          >
            Load Sample Data
          </Button>
        </div>
      </div>

      {/* Table Container with Responsive Scrolling */}
      <div className="w-full">
        <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleCategoryDragEnd}
            >
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b bg-muted/20">
                    <th className="text-left font-semibold p-4 w-8 sticky left-0 bg-muted/20 z-10 border-r border-border/30">
                      Actions
                    </th>
                    <th className="text-left font-semibold p-4 min-w-[240px] sticky left-8 bg-muted/20 z-10 border-r border-border/30">
                      Account
                    </th>
                    {viewType === "monthly" ? (
                      <>
                        {selectedYearPeriods.slice(0, 12).map((period) => (
                          <th
                            key={period.date}
                            className="text-right font-semibold p-2 min-w-[90px] whitespace-nowrap text-xs text-muted-foreground"
                          >
                            {period.label.split(" ")[1]}
                          </th>
                        ))}
                        <th className="text-right font-semibold p-4 bg-muted/30 min-w-[140px] sticky right-0 z-10 border-l border-border/30">
                          Total
                        </th>
                      </>
                    ) : (
                      <>
                        {selectedYears.map((year) => (
                          <th
                            key={year}
                            className="text-right font-semibold p-4 min-w-[120px] whitespace-nowrap text-muted-foreground"
                          >
                            {year} Total
                          </th>
                        ))}
                        <th className="text-right font-semibold p-4 bg-muted/30 min-w-[140px] sticky right-0 z-10 border-l border-border/30">
                          Total
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <SortableContext
                  items={data.categories.map((cat) => cat.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <tbody>
                    {data.categories.map((category) => (
                      <SortableCategory
                        key={category.id}
                        category={category}
                        viewType={viewType}
                        selectedYear={selectedYear}
                        selectedYears={selectedYears}
                        isDesignMode={isDesignMode}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </table>
            </DndContext>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
        <p className="font-medium mb-2">Getting Started:</p>
        <ul className="space-y-1 list-disc list-inside text-xs sm:text-sm">
          <li>Type directly into any value cell</li>
          <li>Click on subcategory or account names to edit them</li>
          <li>Press Enter to save text changes, Escape to cancel</li>
          <li>Press Enter or Tab to save numerical values, Escape to cancel</li>
          <li>Switch between Monthly and Yearly views</li>
          <li>
            All main categories and subcategories are fixed headers with
            calculated sums
          </li>
          <li>
            Gross Profit and Operating Profit are automatically calculated
          </li>
          <li className="text-muted-foreground/80">
            Scroll horizontally to view all months in monthly view
          </li>
          <li className="text-primary">
            Toggle Design Mode to add/delete subcategories and accounts
          </li>
          {isDesignMode && (
            <li className="text-green-600 font-medium">
              Design Mode Active: Add accounts to existing subcategories
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
