"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import type { CheckedState } from "@radix-ui/react-checkbox";

const topics = ["Urban Planning", "Environment", "Health", "Transportation", "Community", "Technology", "Data Privacy", "Waste Management", "Sustainability"];

interface FeedFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  selectedTopics: string[];
  onTopicChange: (topic: string, checked: boolean) => void;
  sortOrder: string;
  onSortOrderChange: (order: string) => void;
}

export function FeedFilters({
  searchQuery,
  onSearchQueryChange,
  activeTab,
  onActiveTabChange,
  selectedTopics,
  onTopicChange,
  sortOrder,
  onSortOrderChange,
}: FeedFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
       <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search proposals..." 
          className="pl-10 w-full" 
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
         <Tabs value={activeTab} onValueChange={onActiveTabChange}>
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2 w-full sm:w-auto">
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-between">
                  Topics {selectedTopics.length > 0 && `(${selectedTopics.length})`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {topics.map(topic => (
                  <DropdownMenuCheckboxItem 
                    key={topic}
                    checked={selectedTopics.includes(topic)}
                    onCheckedChange={(checked) => onTopicChange(topic, !!checked)}
                  >
                    {topic}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          <Select value={sortOrder} onValueChange={onSortOrderChange}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Sort: Trending</SelectItem>
              <SelectItem value="recent">Sort: Most Recent</SelectItem>
              <SelectItem value="agree">Sort: Most Agreed</SelectItem>
              <SelectItem value="disagree">Sort: Most Disagreed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
