import { router } from "@inertiajs/react";
import { Search } from "lucide-react";
import { Input } from "./input";
import { useState } from "react";

interface SearchInputProps {
    value?: string;
    onSearch?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchInput({
    value = "",
    onSearch,
    placeholder = "Search...",
    className = ""
}: SearchInputProps) {
    const [searchValue, setSearchValue] = useState(value);
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(searchValue);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <Input
                type="text"
                placeholder={placeholder}
                className="pl-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Search className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform" size={16} />
        </div>
    );
}
