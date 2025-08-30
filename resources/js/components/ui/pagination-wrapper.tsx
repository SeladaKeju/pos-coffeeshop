import React from 'react';
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

interface PaginationWrapperProps {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  onNavigate: (page: number) => void;
}

export function PaginationWrapper({
  currentPage,
  lastPage,
  perPage,
  total,
  onNavigate,
}: PaginationWrapperProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-muted-foreground text-sm sm:order-1">
        Showing {Math.min(currentPage * perPage, total)} of {total} entries
      </div>
      <div className="flex w-full justify-end sm:order-2 sm:w-auto">
        <Pagination>
          <PaginationContent>
            {/* Previous Page Link */}
            <PaginationItem>
              <PaginationPrevious
                onClick={e => {
                  e.preventDefault();
                  if (currentPage > 1) onNavigate(currentPage - 1);
                }}
              
              />
            </PaginationItem>
            <PaginationItem key="back-forward">
              <PaginationLink
               
                onClick={e => {
                  e.preventDefault();
                  onNavigate(1);
                }}
              >
                <ChevronsLeftIcon />
              </PaginationLink>
            </PaginationItem>
            {/* Render Page Links */}
            {(() => {
              const displayPages = [];
              // Case: 3 or fewer total pages - show all
              if (lastPage <= 3) {
                for (let i = 1; i <= lastPage; i++) {
                  displayPages.push(
                    <PaginationItem key={`page-${i}`}>
                      <PaginationLink
                        onClick={e => {
                          e.preventDefault();
                          onNavigate(i);
                        }}
                        isActive={currentPage === i}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>,
                  );
                }
              } else {
                // First page
                if (currentPage === 1) {
                  displayPages.push(
                    <PaginationItem key="page-1">
                      <PaginationLink
                        onClick={e => e.preventDefault()}
                        isActive={true}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>,
                    <PaginationItem key="page-2">
                      <PaginationLink
                        onClick={e => {
                          e.preventDefault();
                          onNavigate(2);
                        }}
                      >
                        2
                      </PaginationLink>
                    </PaginationItem>,
                    <PaginationItem key="ellipsis">
                      <PaginationEllipsis />
                    </PaginationItem>,
                  );
                } else if (currentPage === lastPage) {
                  displayPages.push(
                    <PaginationItem key="ellipsis">
                      <PaginationEllipsis />
                    </PaginationItem>,
                    <PaginationItem key={`page-${lastPage - 1}`}>
                      <PaginationLink
                        onClick={e => {
                          e.preventDefault();
                          onNavigate(lastPage - 1);
                        }}
                      >
                        {lastPage - 1}
                      </PaginationLink>
                    </PaginationItem>,
                    <PaginationItem key={`page-${lastPage}`}>
                      <PaginationLink
                        onClick={e => e.preventDefault()}
                        isActive={true}
                      >
                        {lastPage}
                      </PaginationLink>
                    </PaginationItem>,
                  );
                } else {
                  // Middle pages
                  displayPages.push(
                    <PaginationItem key={`page-${currentPage - 1}`}>
                      <PaginationLink
                 
                        onClick={e => {
                          e.preventDefault();
                          onNavigate(currentPage - 1);
                        }}
                      >
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>,
                    <PaginationItem key={`page-${currentPage}`}>
                      <PaginationLink
                        onClick={e => e.preventDefault()}
                        isActive={true}
                        
                      >
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>,
                    <PaginationItem key={`page-${currentPage + 1}`}>
                      <PaginationLink
            
                        onClick={e => {
                          e.preventDefault();
                          onNavigate(currentPage + 1);
                        }}
                      >
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>,
                  );
                }
              }
              return displayPages;
            })()}
            {/* Next Page Link */}
            <PaginationItem key="fast-forward">
              <PaginationLink
          
                onClick={e => {
                  e.preventDefault();
                  onNavigate(lastPage);
                }}
              >
                <ChevronsRightIcon />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={e => {
                  e.preventDefault();
                  if (currentPage < lastPage) onNavigate(currentPage + 1);
                }}
               
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
