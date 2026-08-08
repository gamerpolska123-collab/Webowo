#!/usr/bin/env bash
# ============================================
# Webowo v2.0 – Deploy Script (Raspberry Pi → GitHub)
# ============================================
# Użycie:
#   ./deploy-to-github.sh              # auto-commit z timestampem
#   ./deploy-to-github.sh "msg"        # custom commit message
#   ./deploy-to-github.sh --dry-run    # tylko pokaż co by się wydarzyło
#   ./deploy-to-github.sh --status     # tylko status repo
# ============================================

set -euo pipefail

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfiguracja
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
BRANCH="main"
REMOTE="origin"
DRY_RUN=false
STATUS_ONLY=false

# Parsowanie argumentów
COMMIT_MSG=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --status)
      STATUS_ONLY=true
      shift
      ;;
    --help|-h)
      echo "Użycie: $0 [OPCJE] [COMMIT_MSG]"
      echo ""
      echo "Opcje:"
      echo "  --dry-run     Symulacja (nie wykonuje git push)"
      echo "  --status      Tylko status repozytorium"
      echo "  --help, -h    Ta pomoc"
      echo ""
      echo "Przykłady:"
      echo "  $0                           # Auto-commit z datą"
      echo "  $0 'Fix: naprawiono navbar'  # Custom message"
      echo "  $0 --dry-run                 # Podgląd zmian"
      exit 0
      ;;
    *)
      COMMIT_MSG="$1"
      shift
      ;;
  esac
done

cd "$REPO_DIR"

echo -e "${BLUE}🚀 Webowo Deploy Script${NC}"
echo -e "${BLUE}   Katalog: $REPO_DIR${NC}"
echo ""

# 1. Sprawdź czy to repo git
if [[ ! -d ".git" ]]; then
  echo -e "${RED}❌ Błąd: To nie jest repozytorium git.${NC}"
  echo "   Uruchom: git init && git remote add origin <URL>"
  exit 1
fi

# 2. Sprawdź czy origin istnieje
if ! git remote get-url "$REMOTE" &>/dev/null; then
  echo -e "${RED}❌ Błąd: Remote '$REMOTE' nie jest skonfigurowany.${NC}"
  echo "   Dodaj: git remote add origin https://github.com/uzytkownik/repo.git"
  exit 1
fi

REMOTE_URL=$(git remote get-url "$REMOTE")
echo -e "${BLUE}   Remote: $REMOTE_URL${NC}"
echo -e "${BLUE}   Branch: $BRANCH${NC}"
echo ""

# 3. Tylko status
if [[ "$STATUS_ONLY" == true ]]; then
  echo -e "${YELLOW}📊 Status repozytorium:${NC}"
  git status
  echo ""
  echo -e "${YELLOW}📊 Ostatnie commity:${NC}"
  git log --oneline -5
  exit 0
fi

# 4. Sprawdź czy branch istnieje lokalnie
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != "$BRANCH" ]]; then
  echo -e "${YELLOW}⚠️  Jesteś na branchu '$CURRENT_BRANCH', przełączam na '$BRANCH'...${NC}"
  if [[ "$DRY_RUN" == false ]]; then
    git checkout "$BRANCH" || {
      echo -e "${RED}❌ Nie udało się przełączyć na branch $BRANCH.${NC}"
      exit 1
    }
  else
    echo -e "${GREEN}[DRY-RUN] git checkout $BRANCH${NC}"
  fi
fi

# 5. Pull przed push (opcjonalnie – zapobiega konfliktom)
echo -e "${BLUE}⬇️  Pobieram zmiany z $REMOTE/$BRANCH...${NC}"
if [[ "$DRY_RUN" == false ]]; then
  if ! git pull "$REMOTE" "$BRANCH" --ff-only 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Fast-forward niemożliwy – możliwe konflikty lub zmiany na zdalnym repo.${NC}"
    echo -e "${YELLOW}   Pomijam pull (zakładam, że RPi jest źródłem prawdy).${NC}"
  fi
else
  echo -e "${GREEN}[DRY-RUN] git pull $REMOTE $BRANCH --ff-only${NC}"
fi

# 6. Sprawdź czy są zmiany do zacommitowania
if git diff --quiet && git diff --cached --quiet; then
  echo -e "${GREEN}✅ Brak zmian do wypchnięcia. Wszystko jest aktualne.${NC}"
  exit 0
fi

# 7. Dodaj wszystkie zmiany
echo -e "${BLUE}📁 Dodaję zmiany do stage...${NC}"
if [[ "$DRY_RUN" == false ]]; then
  git add -A
else
  echo -e "${GREEN}[DRY-RUN] git add -A${NC}"
fi

# 8. Commit
if [[ -z "$COMMIT_MSG" ]]; then
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  COMMIT_MSG="deploy(rpi): aktualizacja z Raspberry Pi [$TIMESTAMP]"
fi

echo -e "${BLUE}📝 Commit: $COMMIT_MSG${NC}"
if [[ "$DRY_RUN" == false ]]; then
  git commit -m "$COMMIT_MSG"
else
  echo -e "${GREEN}[DRY-RUN] git commit -m "$COMMIT_MSG"${NC}"
fi

# 9. Push
echo -e "${BLUE}⬆️  Push do $REMOTE/$BRANCH...${NC}"
if [[ "$DRY_RUN" == false ]]; then
  git push "$REMOTE" "$BRANCH"
  echo ""
  echo -e "${GREEN}✅ Sukces! Zmiany wypchnięte na GitHub.${NC}"
  echo -e "${GREEN}   $REMOTE_URL${NC}"
else
  echo -e "${GREEN}[DRY-RUN] git push $REMOTE $BRANCH${NC}"
  echo ""
  echo -e "${YELLOW}🏁 Symulacja zakończona. Użyj bez --dry-run aby wypchnąć.${NC}"
fi

echo ""
echo -e "${BLUE}📊 Ostatnie commity:${NC}"
git log --oneline -3
