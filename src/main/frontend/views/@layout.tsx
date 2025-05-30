import { createMenuItems, useViewConfig } from '@vaadin/hilla-file-router/runtime.js';
import { effect, signal } from '@vaadin/hilla-react-signals';
import { AppLayout, DrawerToggle, Icon, SideNav, SideNavItem } from '@vaadin/react-components';
import { Button } from '@vaadin/react-components/Button.js';
import { STORAGE_KEYS } from 'Frontend/constants/constants';
import { useAuth } from 'Frontend/util/auth.js';
import { Suspense, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const defaultTitle = document.title;
const documentTitleSignal = signal('');
effect(() => (document.title = documentTitleSignal.value));

(window as any).Vaadin.documentTitleSignal = documentTitleSignal;

export default function MainLayout() {
  const currentTitle = useViewConfig()?.title ?? defaultTitle;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    documentTitleSignal.value = currentTitle;
  }, [currentTitle]);

  const { state, logout } = useAuth();

  const handleLogout = async () => {
    localStorage.removeItem(STORAGE_KEYS.START_DATE);
    localStorage.removeItem(STORAGE_KEYS.END_DATE);
    localStorage.removeItem(STORAGE_KEYS.CURRENCY);
    
    await logout();
    document.location.reload();
  };

  return (
    <AppLayout primarySection="drawer">
      <div slot="drawer" className="flex flex-col justify-between h-full p-m">
        <header className="flex flex-col gap-m">
          <span className="font-semibold text-l">FinBud</span>
          <SideNav onNavigate={({ path }) => navigate(path!)} location={location}>
            {createMenuItems().map(({ to, title, icon }) => (
              <SideNavItem path={to} key={to}>
                {icon ? <i className={icon} style={{ marginRight: '0.5rem' }}></i> : <></>}
                {title}
              </SideNavItem>
            ))}
          </SideNav>
        </header>
        <footer className="flex flex-col gap-s">
          {state.user && (
            <>
              <p className="text-sm">
                {state.user.firstName ? (
                  `Hello, ${state.user.firstName}!`
                ) : (
                  `Hello, ${state.user.username}!`
                )}
              </p>
              <Button onClick={handleLogout}>
                Sign out
              </Button>
            </>
          )}
        </footer>
      </div>

      <DrawerToggle slot="navbar" aria-label="Menu toggle"></DrawerToggle>
      <h1 slot="navbar" className="text-l m-0">
        {documentTitleSignal}
      </h1>

      <Suspense>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}
