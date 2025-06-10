'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Building, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchCompanyResponseDto } from '@/types/company-response';
import { api, handleApiError } from '@/lib/api';

interface CompanySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CompanySearch({
  value,
  onChange,
  placeholder = '회사명을 입력하세요',
  className,
}: CompanySearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchCompanyResponseDto[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 검색 함수
  const searchCompanies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsOpen(false);
      return;
    }

    let companies: SearchCompanyResponseDto[] = [];

    try {
      const res = await api.get(`/companies?name=${query}`);
      companies = res.data;
    } catch (error) {
      handleApiError(error, '회사를 검색하는 중 오류가 발생했습니다.');
    } finally {
      setSearchResults(companies.slice(0, 10)); // 최대 10개 결과만 표시
      setIsOpen(companies.length > 0);
      setSelectedIndex(-1);
    }
  };

  // 입력값 변경 처리
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    await searchCompanies(newValue);
  };

  // 회사 선택 처리
  const handleCompanySelect = (company: SearchCompanyResponseDto) => {
    onChange(company.name);
    setIsOpen(false);
    setSearchResults([]);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleCompanySelect(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.trim() && searchResults.length > 0) {
              setIsOpen(true);
            }
          }}
          className={cn('pl-10 pr-10', className)}
          autoComplete="off"
        />
        {value && <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />}
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && searchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 shadow-md"
        >
          {searchResults.map((company, index) => (
            <div
              key={company.id}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
                index === selectedIndex && 'bg-accent text-accent-foreground',
              )}
              onClick={() => handleCompanySelect(company)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{company.name}</span>
                <span className="text-xs text-muted-foreground">{company.industry}</span>
              </div>
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}

          {/* 검색 결과가 없을 때 */}
          {searchResults.length === 0 && value.trim() && (
            <div className="px-3 py-2 text-sm text-muted-foreground">검색 결과가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}
