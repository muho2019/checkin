export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-[2200px] items-center justify-between px-6">
        <div className="text-sm text-muted-foreground">
          © {currentYear} 근태 관리 서비스. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            이용약관
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            개인정보처리방침
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            고객센터
          </a>
        </div>
      </div>
    </footer>
  );
}
