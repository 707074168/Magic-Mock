import { useMemo } from "react";
import { useLocation } from "react-router-dom";


const usePathname = () => {
  const location = useLocation();

  const pathnames = useMemo(() => {
    return location.pathname.split('/').filter(Boolean)
  }, [location.pathname])

  return pathnames
}

export {
  usePathname
}