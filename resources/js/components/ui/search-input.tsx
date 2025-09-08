import { Search } from "lucide-react";
import { Input } from "./input";
import { useState, useEffect } from "react";

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
    
    // Sync with external value prop
    useEffect(() => {
        setSearchValue(value);
    }, [value]);
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(searchValue);
        }
    };

    const handleBlur = () => {
        if (onSearch && searchValue !== value) {
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
                onBlur={handleBlur}
            />
            <Search className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform" size={16} />
        </div>
    );
}
