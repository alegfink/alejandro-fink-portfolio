export const PORTFOLIO_LOADER_SESSION_KEY = "af-portfolio-loader-seen-v1";

type SessionStorageReader = Pick<Storage, "getItem">;
type SessionStorageWriter = Pick<Storage, "setItem">;

export function hasSeenPortfolioLoader(storage: SessionStorageReader | null | undefined): boolean {
  if (!storage) return false;
  try {
    return storage.getItem(PORTFOLIO_LOADER_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPortfolioLoaderSeen(storage: SessionStorageWriter | null | undefined): boolean {
  if (!storage) return false;
  try {
    storage.setItem(PORTFOLIO_LOADER_SESSION_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

export const PORTFOLIO_LOADER_BOOTSTRAP_SCRIPT = `try{if(sessionStorage.getItem(${JSON.stringify(PORTFOLIO_LOADER_SESSION_KEY)})==="1")document.documentElement.dataset.portfolioLoaderSeen="true"}catch{}`;
