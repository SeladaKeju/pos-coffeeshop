import React from 'react';
import { SearchInput } from './search-input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
    value?: string;
    onSearch?: (value: string) => void;
    placeholder?: string;
    className?: string;
    showCurrentSearch?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value = "",
    onSearch,
    placeholder = "Search...",
    className,
    showCurrentSearch = false
}) => {
    return (
        <div className={cn("space-y-2", className)}>
            <SearchInput
                value={value}
                onSearch={onSearch}
                placeholder={placeholder}
                className="w-full"
            />
            {showCurrentSearch && value && (
                <p className="text-sm text-gray-500">
                    Searching for: "<span className="font-semibold">{value}</span>"
                </p>
            )}
        </div>
    );
};

export { SearchBar };
export type { SearchBarProps };
