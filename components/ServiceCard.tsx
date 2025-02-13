"use client";

import { useEstimationStore, type Service } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { motion } from "framer-motion";

interface ServiceCardProps {
  sectionId: string;
  service: Service;
}

export default function ServiceCard({ sectionId, service }: ServiceCardProps) {
  const { toggleService, updateOption, updateQuantity, updateFixedCost } = useEstimationStore();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const isSelected =
    service.type === "withOptions"
      ? service.selectedOption !== undefined
      : service.type === "fixedCost"
      ? service.value !== undefined
      : false;

  return (
    <motion.div variants={cardVariants} className="w-full">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={service.id}
              checked={isSelected}
              onCheckedChange={() => toggleService(sectionId, service.id)}
            />
            <CardTitle className="text-sm">{service.name}</CardTitle>
          </div>
          <CardDescription>{service.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {isSelected && (
            <div className="space-y-4">
              {service.type === "withOptions" ? (
                <>
                  <div>
                    <Label htmlFor={`${service.id}-option`}>Option</Label>
                    <Select
                      onValueChange={(value) => updateOption(sectionId, service.id, value)}
                      value={service.selectedOption}
                    >
                      <SelectTrigger id={`${service.id}-option`}>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {service.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} - ${option.rate}/unit
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`${service.id}-quantity`}>Quantity</Label>
                    <Input
                      id={`${service.id}-quantity`}
                      type="number"
                      value={service.quantity || ""}
                      onChange={(e) => {
                        const quantity = Number(e.target.value);
                        updateQuantity(sectionId, service.id, quantity >= 0 ? quantity : 1);
                      }}
                      onBlur={(e) => {
                        if (!e.target.value || Number(e.target.value) < 0) {
                          updateQuantity(sectionId, service.id, 1);
                        }
                      }}
                      className="mt-1"
                      min="0"
                    />
                  </div>
                </>
              ) : service.type === "fixedCost" ? (
                <div>
                  <Label htmlFor={`${service.id}-value`}>Enter amount</Label>
                  <Input
                    id={`${service.id}-value`}
                    type="number"
                    value={service.value || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      updateFixedCost(sectionId, service.id, value); // Allow negative values
                    }}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        updateFixedCost(sectionId, service.id, 0); // Set to 0 if empty
                      }
                    }}
                    className="mt-1"
                  />
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}